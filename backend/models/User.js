const mongoose = require('mongoose');

// Định nghĩa schema người dùng
const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true }
});

// Tạo model User
const User = mongoose.model('User', userSchema);

module.exports = User;
