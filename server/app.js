import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import helmet from "helmet";
import rateLimit from "express-rate-limit";

import { connectDB, requireDatabase } from "./config/db.js";
import enquiryRoutes from "./routes/enquiries.js";
import authRoutes from "./routes/auth.js";

const app = express();

// Security
app.use(helmet());

const allowedOrigins = (process.env.WEB_ORIGIN || "http://localhost:3000").split(",").map((origin) => origin.trim()).filter(Boolean);
app.use(cors({ origin(origin, callback) { if (!origin || allowedOrigins.includes(origin)) return callback(null, true); return callback(new Error("Origin is not allowed by CORS")); }, credentials: true }));

// JSON body
app.use(express.json({ limit: "20kb" }));
app.use(cookieParser());

// Rate limiting for API
app.use(
  "/api",
  rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 150,
  }),
);

// Health check
app.get("/health", async (req, res) => {
  try { await connectDB(); res.status(200).json({ status: "ok" }); }
  catch { res.status(503).json({ status: "degraded", database: "unavailable" }); }
});

// API routes
app.use("/api/auth", requireDatabase, authRoutes);
app.use("/api/enquiries", requireDatabase, enquiryRoutes);

// Error handler
app.use((err, req, res, next) => {
  console.error("API error:", err.message);
  if (err.message === "Origin is not allowed by CORS") return res.status(403).json({ error: "Origin is not allowed." });
  res.status(500).json({ error: "Internal server error" });
});

// Render provides PORT automatically
const PORT = process.env.PORT || 5000;

app.listen(PORT, "0.0.0.0", () => { console.log(`API ready on port ${PORT}`); connectDB().catch((error) => console.error("Initial MongoDB connection failed; API will retry per request:", error.message)); });
