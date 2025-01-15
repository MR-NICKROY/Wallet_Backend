// Backend/index.js
import express from "express";

import dotenv from "dotenv";
import mongoose from "mongoose";
import cors from "cors";
import cookieParser from "cookie-parser";
import path from "path";
import { fileURLToPath } from "url";
import userRoute from "./routes/user.route.js";
import wallet from "./routes/money.router.js";
import goal from "./routes/goal.router.js";
// Backend/index.js

import bodyParser from "body-parser";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const app = express();
dotenv.config();

if (!process.env.JWT_TOKEN) {
  console.error("JWT_TOKEN is not defined in environment variables");
  process.exit(1);
}

// Increase all size limits for parsing
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ limit: "50mb", extended: true }));
app.use(bodyParser.json({ limit: "50mb" }));
app.use(bodyParser.urlencoded({ limit: "50mb", extended: true }));
app.use(cookieParser());

// CORS configuration
app.use(
  cors({
    origin: process.env.FRONTENDURL,
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
    allowedHeaders: ["Content-Type", "Authorization"],
    exposedHeaders: ["set-cookie"],
  })
);

// Serve static files
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

const PORT = process.env.PORT || 5000;
const URI = process.env.MONGODB_URI;

try {
  await mongoose.connect(URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
  console.log("Connected to MongoDB");
} catch (error) {
  console.error("MongoDB connection error:", error);
}

// Routes
app.use("/api/user", userRoute);
app.use("/api/wallet", wallet);
app.use("/api", goal);

// Error handling middleware
app.use((err, req, res, next) => {
  if (err instanceof SyntaxError && err.status === 413) {
    return res.status(413).json({
      error: "Request entity too large",
      message: "The file size exceeds the limit allowed",
    });
  }
  next(err);
});

app.listen(PORT, () => {
  console.log(`Server is Running on port ${PORT}`);
});
