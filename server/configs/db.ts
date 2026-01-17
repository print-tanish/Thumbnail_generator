import mongoose from "mongoose";

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI as string, {
      dbName: "thumblify",
    });

    console.log("MongoDB connected");
  } catch (error) {
    console.error("MongoDB connection error:", error);
    // Do not exit process in Serverless environment, allow retry or specific error handling per request
  }
};

export default connectDB;
