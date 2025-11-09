const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true, select: false }, // không trả về password khi query
  role: { type: String, enum: ["user", "admin"], default: "user" },
  avatar: { type: String, default: "" },
  resetPasswordToken: { type: String },
  resetPasswordExpire: { type: Date },
}, { timestamps: true });

module.exports = mongoose.model("User", userSchema);
