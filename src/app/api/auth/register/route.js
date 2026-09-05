import { NextResponse } from "next/server";
import { z } from "zod";
import bcrypt from "bcryptjs";
import { connectDB } from "@/lib/db";
import { User } from "@/lib/user-model";
import { createSession, sessionCookie } from "@/lib/auth";

const input = z.object({ name: z.string().trim().min(2, "Enter your full name.").max(80), email: z.string().trim().email("Enter a valid email."), password: z.string().min(8, "Use at least 8 characters.").max(128) });
export async function POST(request) { try { const data = input.parse(await request.json()); await connectDB(); const email = data.email.toLowerCase(); if (await User.exists({ email })) return NextResponse.json({ error: "An account already exists for this email." }, { status: 409 }); const user = await User.create({ name: data.name, email, passwordHash: await bcrypt.hash(data.password, 12), role: "customer" }); const response = NextResponse.json({ user: { id: user._id, name: user.name, role: user.role } }, { status: 201 }); const cookie = sessionCookie(createSession(user)); response.cookies.set(cookie.name, cookie.value, cookie.options); return response; } catch (error) { if (error instanceof z.ZodError) return NextResponse.json({ error: error.issues[0].message }, { status: 400 }); if (error?.code === 11000) return NextResponse.json({ error: "An account already exists for this email." }, { status: 409 }); if (error?.message === "MONGODB_URI is not configured") return NextResponse.json({ error: "Registration is unavailable until MongoDB is configured." }, { status: 503 }); console.error("Registration error", error); return NextResponse.json({ error: "Unable to create account. Please try again." }, { status: 500 }); } }
