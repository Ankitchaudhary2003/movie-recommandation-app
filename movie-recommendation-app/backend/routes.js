import axios from "axios";
import db from "./db.js";

export default async function routes(fastify) {
  fastify.post("/recommend", async (request, reply) => {
    try {
      const { preference } = request.body;

      const prompt = `
Recommend 3 to 5 movies based on this preference:
"${preference}"
Return only movie names as a bullet list prefer mostly bollywood and hollywood movies.
`;

      const response = await axios.post(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${process.env.GEMINI_API_KEY}`,
        {
          contents: [
            {
              parts: [{ text: prompt }]
            }
          ]
        }
      );

      const text =
        response.data.candidates[0].content.parts[0].text;

      const movies = text
        .split("\n")
        .map(m => m.replace(/[-*•]/g, "").trim())
        .filter(Boolean);

      db.prepare(
        `INSERT INTO recommendations (user_input, recommended_movies)
         VALUES (?, ?)`
      ).run(preference, JSON.stringify(movies));

      return { movies };

    } catch (err) {
      console.error("Gemini Error:", err.response?.data || err.message);
      reply.status(500).send({ error: "AI recommendation failed" });
    }
  });
}