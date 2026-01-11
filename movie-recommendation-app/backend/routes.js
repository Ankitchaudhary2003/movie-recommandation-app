import axios from "axios";
import db from "./db.js";

export default async function routes(fastify) {
  fastify.post("/recommend", async (request, reply) => {
    try {
      // ✅ 1. Validate input
      const { preference } = request.body || {};

      if (!preference) {
        return reply
          .status(400)
          .send({ error: "Preference is required" });
      }

      const prompt = `
Recommend 3 to 5 movies based on this preference:
"${preference}"
Return only movie names as a bullet list.
Prefer mostly Bollywood and Hollywood movies.
`;

      // ✅ 2. Call Gemini safely
      const response = await axios.post(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent`,
        {
          contents: [
            {
              parts: [{ text: prompt }]
            }
          ]
        },
        {
          params: {
            key: process.env.GEMINI_API_KEY
          },
          timeout: 15000
        }
      );

      // ✅ 3. Safe response handling
      const candidates = response.data?.candidates;

      if (!candidates || candidates.length === 0) {
        throw new Error("No candidates returned from Gemini");
      }

      const parts = candidates[0]?.content?.parts;

      if (!parts || parts.length === 0) {
        throw new Error("Empty Gemini response");
      }

      const text = parts[0].text;

      const movies = text
        .split("\n")
        .map(m => m.replace(/[-*•]/g, "").trim())
        .filter(Boolean);

      // ✅ 4. DB write should NOT crash API
      try {
        db.prepare(
          `INSERT INTO recommendations (user_input, recommended_movies)
           VALUES (?, ?)`
        ).run(preference, JSON.stringify(movies));
      } catch (dbErr) {
        console.error("DB ERROR:", dbErr.message);
      }

      return reply.send({ movies });

    } catch (err) {
      console.error("RECOMMEND ERROR:", err.response?.data || err.message);
      return reply
        .status(500)
        .send({ error: "AI recommendation failed" });
    }
  });
}
