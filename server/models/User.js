import mongoose from "mongoose";
const schema = new mongoose.Schema({ name: { type: String, required: true, trim: true, minlength: 2, maxlength: 80 }, email: { type: String, required: true, unique: true, lowercase: true, trim: true, index: true }, passwordHash: { type: String, required: true, select: false }, role: { type: String, enum: ["customer", "vendor", "admin"], default: "customer" }, status: { type: String, enum: ["active", "pending", "disabled"], default: "active" } }, { timestamps: true });
export default mongoose.models.User || mongoose.model("User", schema);
