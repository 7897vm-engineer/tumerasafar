import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { verifySession } from "@/lib/auth";
export async function GET() { const token = (await cookies()).get("ts_session")?.value; const session = verifySession(token); if (!session) return NextResponse.json({ error: "Unauthenticated" }, { status: 401 }); return NextResponse.json({ user: { id: session.sub, name: session.name, role: session.role } }); }
