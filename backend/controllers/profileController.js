const bcrypt = require("bcryptjs");
const User = require("../models/User");

exports.getProfile = async (req, res) => {
  const user = await User.findById(req.user.id).select("-password");
  res.json(user);
};

exports.updateProfile = async (req, res) => {
  const user = await User.findById(req.user.id);
  if (!user) return res.status(404).json({ message: "Không tìm thấy user" });

  user.name = req.body.name || user.name;
  if (req.body.password) {
    user.password = await bcrypt.hash(req.body.password, 10);
  }
  await user.save();
  res.json({ message: "Cập nhật thành công", user });
};
