import Fastify from "fastify";
import cors from "@fastify/cors";
import dotenv from "dotenv";
import routes from "./routes.js";

dotenv.config();

const app = Fastify({
  logger: true,
});

await app.register(cors, {
  origin: true,
});

await app.register(routes);

app.listen({ port: 5000, host: "0.0.0.0" }, (err) => {
  if (err) {
    console.error(err);
    process.exit(1);
  }
  console.log("🚀 Backend running on http://localhost:5000");
});