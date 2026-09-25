import express from "express";
import cors from "cors";
import menuRoutes from "./routes/menuRoutes";
import categoryRoutes from "./routes/categoryRoutes";
import authRoutes from "./routes/authRoutes";

// The Express app itself, with no app.listen() call — this is what lets
// tests (via supertest) exercise real routes/middleware/controllers
// without opening an actual network port.
export function createApp() {
  const app = express();

  app.use(
    cors({
      origin: process.env.CLIENT_URL || "http://localhost:5173",
    }),
  );
  app.use(express.json());

  app.use("/api", menuRoutes);
  app.use("/api", categoryRoutes);
  app.use("/api/auth", authRoutes);

  app.get("/api/health", (_req, res) => {
    res.json({ status: "ok", cafe: "Odessey", message: "Καλώς ήρθατε!" });
  });

  // 404 handler
  app.use((_req, res) => {
    res.status(404).json({ message: "المسار غير موجود" });
  });

  return app;
}

export const app = createApp();
