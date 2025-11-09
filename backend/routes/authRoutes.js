const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const { protect } = require('../middleware/auth');

// ======================================
// Auth Routes
// ======================================

// Đăng ký tài khoản mới
// POST http://localhost:3001/api/auth/register
router.post('/register', authController.signup);

// Đăng nhập
// POST http://localhost:3001/api/auth/login
router.post('/login', authController.login);

// Đăng xuất (yêu cầu token hợp lệ)
// POST http://localhost:3001/api/auth/logout
router.post('/logout', protect, authController.logout);

// Quên mật khẩu: gửi email chứa token reset
// POST http://localhost:3001/api/auth/forgot-password
router.post('/forgot-password', authController.forgotPassword);

// Đặt lại mật khẩu bằng token
// POST http://localhost:3001/api/auth/reset-password/:token
router.post('/reset-password/:token', authController.resetPassword);

module.exports = router;
