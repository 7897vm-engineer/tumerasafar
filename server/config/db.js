import mongoose from "mongoose";
let connectionPromise;
export async function connectDB() { if (mongoose.connection.readyState === 1) return mongoose.connection; if (!process.env.MONGODB_URI) throw new Error("MONGODB_URI is not configured"); if (!connectionPromise) connectionPromise = mongoose.connect(process.env.MONGODB_URI, { serverSelectionTimeoutMS: 10000, bufferCommands: false }).catch((error) => { connectionPromise = undefined; throw error; }); return connectionPromise; }
export async function requireDatabase(req, res, next) { try { await connectDB(); next(); } catch (error) { console.error("MongoDB unavailable:", error.message); res.status(503).json({ error: "The database is temporarily unavailable. Please try again shortly." }); } }
