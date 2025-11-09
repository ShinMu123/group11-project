const bcrypt = require("bcryptjs");
const User = require("../models/User");

exports.getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");
    if (!user) {
      return res.status(404).json({ 
        success: false,
        message: "Không tìm thấy user" 
      });
    }
    res.json(user);
  } catch (error) {
    res.status(500).json({ 
      success: false,
      message: "Lỗi khi lấy thông tin profile",
      error: error.message 
    });
  }
};

exports.updateProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ 
        success: false,
        message: "Không tìm thấy user" 
      });
    }

    // Cập nhật name nếu có
    if (req.body.name) {
      user.name = req.body.name;
    }

    // Cập nhật password nếu có
    if (req.body.password) {
      user.password = await bcrypt.hash(req.body.password, 10);
    }

    await user.save();

    // Trả về user không có password
    const userResponse = await User.findById(req.user.id).select("-password");

    res.json({ 
      success: true,
      message: "Cập nhật thành công", 
      user: userResponse 
    });
  } catch (error) {
    res.status(500).json({ 
      success: false,
      message: "Lỗi khi cập nhật profile",
      error: error.message 
    });
  }
};
