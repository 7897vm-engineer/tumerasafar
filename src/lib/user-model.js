import mongoose from "mongoose";
const userSchema = new mongoose.Schema({ name: { type: String, required: true, trim: true, minlength: 2, maxlength: 80 }, email: { type: String, required: true, unique: true, lowercase: true, trim: true, index: true }, passwordHash: { type: String, required: true, select: false }, role: { type: String, enum: ["customer", "vendor", "admin"], default: "customer" }, status: { type: String, enum: ["active", "pending", "disabled"], default: "active" } }, { timestamps: true });
export const User = mongoose.models.User || mongoose.model("User", userSchema);
