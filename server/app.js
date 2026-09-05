import express from "express";
import cors from "cors";
import helmet from "helmet";
import rateLimit from "express-rate-limit";

import { connectDB } from "./config/db.js";
import enquiryRoutes from "./routes/enquiries.js";

const app = express();

// Security
app.use(helmet());

// CORS
const allowedOrigins = process.env.WEB_ORIGIN
  ? process.env.WEB_ORIGIN.split(",").map((origin) => origin.trim())
  : ["http://localhost:3000"];

app.use(
  cors({
    origin: allowedOrigins,
    credentials: true,
  }),
);

// JSON body
app.use(express.json({ limit: "20kb" }));

// Rate limiting for API
app.use(
  "/api",
  rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 150,
  }),
);

// Health check
app.get("/health", (req, res) => {
  res.status(200).json({
    status: "ok",
    message: "TumeRaSafar API is running",
  });
});

// API routes
app.use("/api/enquiries", enquiryRoutes);

// Error handler
app.use((err, req, res, next) => {
  console.error(err);

  res.status(500).json({
    error: "Internal server error",
  });
});

// Render provides PORT automatically
const PORT = process.env.PORT || 4000;

// Start server after MongoDB connection
connectDB()
  .then(() => {
    app.listen(PORT, "0.0.0.0", () => {
      console.log(`API ready on port ${PORT}`);
    });
  })
  .catch((error) => {
    console.error("Database connection failed:", error);
    process.exit(1);
  });