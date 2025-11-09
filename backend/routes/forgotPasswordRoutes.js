const express = require('express');
const router = express.Router();
const forgotPasswordController = require('../controllers/forgotPasswordController');

// POST /api/forgot-password - Gửi token reset mật khẩu
router.post('/forgot-password', forgotPasswordController.forgotPassword);

// POST /api/reset-password - Đặt lại mật khẩu bằng token
router.post('/reset-password', forgotPasswordController.resetPassword);

module.exports = router;
