import mongoose from "mongoose";

export async function connectDB(): Promise<void> {
  const mongoUri = process.env.MONGO_URI;

  if (!mongoUri) {
    console.warn("⚠️  MONGO_URI not set — skipping MongoDB connection.");
    return;
  }

  try {
    await mongoose.connect(mongoUri);
    console.log("✅ MongoDB connected successfully");
  } catch (error) {
    console.error("❌ MongoDB connection error:", error);
    console.warn("↪️  Falling back to in-memory mock data.");
  }
}

export function isDbConnected(): boolean {
  return mongoose.connection.readyState === 1;
}
