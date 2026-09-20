import dotenv from "dotenv";
dotenv.config();

import { app } from "./app";
import { connectDB } from "./config/db";

const PORT = process.env.PORT || 5000;

async function start() {
  if (process.env.USE_MOCK_DB !== "true") {
    await connectDB();
  } else {
    console.log("🏺 Running Odessey API with in-memory mock data.");
  }

  app.listen(PORT, () => {
    console.log(`🚀 Odessey server running on http://localhost:${PORT}`);
  });
}

start();
