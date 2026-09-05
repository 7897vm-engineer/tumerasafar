import "server-only";
import jwt from "jsonwebtoken";

const maxAge = 60 * 60 * 8;
export function sessionCookie(token) {
  return { name: "ts_session", value: token, options: { httpOnly: true, secure: process.env.NODE_ENV === "production", sameSite: "lax", maxAge, path: "/" } };
}
export function createSession(user) {
  if (!process.env.JWT_SECRET) throw new Error("JWT_SECRET is not configured");
  return jwt.sign({ sub: user._id.toString(), role: user.role, name: user.name, email: user.email }, process.env.JWT_SECRET, { expiresIn: maxAge });
}
export function verifySession(token) {
  if (!token || !process.env.JWT_SECRET) return null;
  try { return jwt.verify(token, process.env.JWT_SECRET); } catch { return null; }
}
