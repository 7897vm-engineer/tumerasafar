import { Router } from "express";
import { z } from "zod";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/User.js";
const router = Router();
const loginSchema = z.object({ email: z.string().trim().email(), password: z.string().min(8).max(128) });
const registerSchema = loginSchema.extend({ name: z.string().trim().min(2).max(80) });
const cookieOptions = { httpOnly: true, secure: process.env.NODE_ENV === "production", sameSite: process.env.NODE_ENV === "production" ? "none" : "lax", maxAge: 8 * 60 * 60 * 1000, path: "/" };
function sign(user) { if (!process.env.JWT_SECRET) throw new Error("JWT_SECRET is not configured"); return jwt.sign({ sub: user._id.toString(), name: user.name, email: user.email, role: user.role }, process.env.JWT_SECRET, { expiresIn: "8h" }); }
router.post("/register", async (req, res, next) => { try { const data = registerSchema.parse(req.body); const email = data.email.toLowerCase(); if (await User.exists({ email })) return res.status(409).json({ error: "An account already exists for this email." }); const user = await User.create({ name: data.name, email, passwordHash: await bcrypt.hash(data.password, 12), role: "customer" }); res.cookie("ts_session", sign(user), cookieOptions); return res.status(201).json({ user: { id: user._id, name: user.name, email: user.email, role: user.role } }); } catch (error) { if (error instanceof z.ZodError) return res.status(400).json({ error: error.issues[0]?.message || "Invalid request." }); if (error?.code === 11000) return res.status(409).json({ error: "An account already exists for this email." }); next(error); } });
router.post("/login", async (req, res, next) => { try { const data = loginSchema.parse(req.body); const user = await User.findOne({ email: data.email.toLowerCase() }).select("+passwordHash"); if (!user || !(await bcrypt.compare(data.password, user.passwordHash))) return res.status(401).json({ error: "Invalid email or password." }); if (user.status !== "active") return res.status(403).json({ error: "This account is currently unavailable." }); res.cookie("ts_session", sign(user), cookieOptions); return res.json({ user: { id: user._id, name: user.name, email: user.email, role: user.role } }); } catch (error) { if (error instanceof z.ZodError) return res.status(400).json({ error: error.issues[0]?.message || "Invalid request." }); next(error); } });
router.post("/logout", (req, res) => { res.clearCookie("ts_session", cookieOptions); res.json({ success: true }); });
router.get("/me", (req, res) => { try { const token = req.cookies?.ts_session; if (!token || !process.env.JWT_SECRET) return res.status(401).json({ error: "Unauthenticated" }); const user = jwt.verify(token, process.env.JWT_SECRET); return res.json({ user: { id: user.sub, name: user.name, email: user.email, role: user.role } }); } catch { return res.status(401).json({ error: "Unauthenticated" }); } });
export default router;
