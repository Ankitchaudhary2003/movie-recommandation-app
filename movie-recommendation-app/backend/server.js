import Fastify from "fastify";
import cors from "@fastify/cors";
import dotenv from "dotenv";
import routes from "./routes.js";

dotenv.config();

const app = Fastify({
  logger: true,
});

// ✅ CORS
await app.register(cors, {
  origin: true,
});

// ✅ Health check (IMPORTANT)
app.get("/", async () => {
  return { status: "API running 🚀" };
});

// ✅ Routes
await app.register(routes);

// ✅ PORT FIX (MOST IMPORTANT)
const PORT = process.env.PORT || 5000;

app.listen({ port: PORT, host: "0.0.0.0" }, (err) => {
  if (err) {
    console.error(err);
    process.exit(1);
  }
  console.log(`🚀 Backend running on port ${PORT}`);
});
