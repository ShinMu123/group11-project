const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const User = require("../models/User");
const sendEmail = require("../utils/sendEmail");

// Helper: tạo JWT token
const generateToken = (user) => {
  return jwt.sign(
    { id: user._id, email: user.email, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: "24h" }
  );
};

// ========================
// Đăng ký tài khoản mới
// ========================
exports.signup = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        message: "Vui lòng điền đầy đủ thông tin",
      });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: "Email đã tồn tại",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      role: role || "user",
    });

    const token = generateToken(user);

    res.status(201).json({
      success: true,
      message: "Đăng ký thành công",
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        avatar: user.avatar || "",
      },
    });
  } catch (error) {
    console.error("Signup error:", error);
    res.status(500).json({
      success: false,
      message: "Lỗi server khi đăng ký",
      error: error.message,
    });
  }
};

// ========================
// Đăng nhập
// ========================
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Vui lòng nhập email và mật khẩu",
      });
    }

    const user = await User.findOne({ email }).select("+password");
    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Email không tồn tại",
      });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        message: "Mật khẩu không đúng",
      });
    }

    const token = generateToken(user);

    res.json({
      success: true,
      message: "Đăng nhập thành công",
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        avatar: user.avatar || "",
      },
    });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({
      success: false,
      message: "Lỗi server khi đăng nhập",
      error: error.message,
    });
  }
};

// ========================
// Đăng xuất
// ========================
exports.logout = (req, res) => {
  res.json({
    success: true,
    message: "Đăng xuất thành công",
  });
};

// ========================
// Quên mật khẩu (Forgot Password)
// ========================
exports.forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ success: false, message: "Vui lòng nhập email" });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ success: false, message: "Email không tồn tại" });
    }

    // Tạo token reset
    const resetToken = crypto.randomBytes(32).toString("hex");
    user.resetPasswordToken = resetToken;
    user.resetPasswordExpire = Date.now() + 10 * 60 * 1000; // 10 phút
    await user.save();

    const resetUrl = `http://localhost:3000/reset-password/${resetToken}`;
    const message = `Bạn nhận được email này vì đã yêu cầu đặt lại mật khẩu.\n\nNhấn vào liên kết sau để đặt lại mật khẩu:\n${resetUrl}\n\nNếu bạn không yêu cầu, hãy bỏ qua email này.`;

    await sendEmail(user.email, "Đặt lại mật khẩu", message);

    res.json({
      success: true,
      message: "Email đặt lại mật khẩu đã được gửi!",
    });
  } catch (error) {
    console.error("Forgot password error:", error);
    res.status(500).json({
      success: false,
      message: "Lỗi khi gửi email đặt lại mật khẩu",
      error: error.message,
    });
  }
};

// ========================
// Đặt lại mật khẩu bằng token
// ========================
exports.resetPassword = async (req, res) => {
  try {
    const { token } = req.params;
    const { password } = req.body;

    if (!password) {
      return res.status(400).json({ success: false, message: "Vui lòng nhập mật khẩu mới" });
    }

    const user = await User.findOne({
      resetPasswordToken: token,
      resetPasswordExpire: { $gt: Date.now() },
    }).select("+password");

    if (!user) {
      return res.status(400).json({
        success: false,
        message: "Token không hợp lệ hoặc đã hết hạn",
      });
    }

    user.password = await bcrypt.hash(password, 10);
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;
    await user.save();

    res.json({
      success: true,
      message: "Đặt lại mật khẩu thành công!",
    });
  } catch (error) {
    console.error("Reset password error:", error);
    res.status(500).json({
      success: false,
      message: "Lỗi khi đặt lại mật khẩu",
      error: error.message,
    });
  }
};
