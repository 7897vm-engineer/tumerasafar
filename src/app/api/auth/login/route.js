import { NextResponse } from "next/server";
import { z } from "zod";
import bcrypt from "bcryptjs";
import { connectDB } from "@/lib/db";
import { User } from "@/lib/user-model";
import { createSession, sessionCookie } from "@/lib/auth";
const input = z.object({ email: z.string().email(), password: z.string().min(8) });
export async function POST(request) { try { const { email, password } = input.parse(await request.json()); await connectDB(); const user = await User.findOne({ email: email.toLowerCase() }).select("+passwordHash"); if (!user || !(await bcrypt.compare(password, user.passwordHash))) return NextResponse.json({ error: "Invalid email or password." }, { status: 401 }); if (user.status !== "active") return NextResponse.json({ error: "This account is currently unavailable." }, { status: 403 }); const response = NextResponse.json({ user: { id: user._id, name: user.name, role: user.role } }); const cookie = sessionCookie(createSession(user)); response.cookies.set(cookie.name, cookie.value, cookie.options); return response; } catch (error) { if (error instanceof z.ZodError) return NextResponse.json({ error: "Invalid credentials." }, { status: 400 }); if (error?.message === "MONGODB_URI is not configured") return NextResponse.json({ error: "Sign-in is unavailable until MongoDB is configured." }, { status: 503 }); console.error("Login error", error); return NextResponse.json({ error: "Unable to sign in." }, { status: 500 }); } }
