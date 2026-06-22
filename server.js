import dotenv from "dotenv";
dotenv.config();

import mongoose from "mongoose";
import app from "./app.js";

const PORT = process.env.PORT || 8080;

const DB = process.env.MONGODB_URI;

if (!DB) {
  console.error("MONGODB_URI is missing in .env");
  process.exit(1);
}

mongoose
  .connect(DB)
  .then(() => {
    console.log("DB connected successfully");
  })
  .catch((err) => {
    console.error("MongoDB connection failed:", err.message);
    process.exit(1);
  });

const server = app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

process.on("unhandledRejection", (err) => {
  console.log("UNHANDLED REJECTION!!! shutting down...");
  console.log(err.name, err.message);
  server.close(() => {
    process.exit(1);
  });
});

process.on("uncaughtException", (err) => {
  console.log("UNCAUGHT EXCEPTION!!! shutting down...");
  console.log(err.name, err.message);
  process.exit(1);
});