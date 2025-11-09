const User = require('../models/User');

// 📥 POST: Thêm user mới
exports.createUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // Kiểm tra trùng email
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'Email đã tồn tại!' });
    }

    // Hash mật khẩu
    const bcrypt = require('bcryptjs');
    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({ 
      name, 
      email, 
      password: hashedPassword 
    });
    await newUser.save();
    res.status(201).json(newUser);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// 📤 GET: Lấy tất cả user
exports.getUsers = async (req, res) => {
  try {
    const users = await User.find();
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ✏️ PUT: Cập nhật user
exports.updateUser = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, email } = req.body;

    const updatedUser = await User.findByIdAndUpdate(
      id,
      { name, email },
      { new: true }
    );

    if (!updatedUser) {
      return res.status(404).json({ message: 'Không tìm thấy user!' });
    }

    res.json(updatedUser);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// 🗑️ DELETE: Xóa user (chỉ admin hoặc chính user đó)
exports.deleteUser = async (req, res) => {
  try {
    const { id } = req.params;
    const currentUser = req.user;

    // Kiểm tra quyền: chỉ admin hoặc chính user đó mới được xóa
    if (currentUser.role !== 'admin' && currentUser.id !== id) {
      return res.status(403).json({ message: 'Không có quyền xóa user này!' });
    }

    const deletedUser = await User.findByIdAndDelete(id);
    if (!deletedUser) {
      return res.status(404).json({ message: 'Không tìm thấy user!' });
    }
    res.json({ message: 'Đã xóa user thành công!' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// 🔄 Reset password cho user (Admin only - dùng để fix lỗi password)
exports.resetUserPassword = async (req, res) => {
  try {
    const { userId, newPassword } = req.body;
    const bcrypt = require('bcryptjs');

    // Kiểm tra quyền admin
    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Chỉ admin mới có quyền reset password!' });
    }

    if (!userId || !newPassword) {
      return res.status(400).json({ message: 'Vui lòng cung cấp userId và newPassword' });
    }

    // Tìm user
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'Không tìm thấy user!' });
    }

    // Hash password mới
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    
    // Cập nhật password
    user.password = hashedPassword;
    await user.save();

    res.json({ 
      success: true,
      message: 'Password đã được reset thành công!',
      user: {
        id: user._id,
        email: user.email,
        name: user.name
      }
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};