const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

// Đăng ký tài khoản mới
router.post('/register', authController.signup);

// Đăng nhập
router.post('/login', authController.login);

module.exports = router;