const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const { protect, isAdmin } = require('../middleware/auth');

// Tạo user mới (yêu cầu đăng nhập)
router.post('/', protect, userController.createUser);

// Lấy danh sách users (yêu cầu đăng nhập, không cần admin)
router.get('/', protect, userController.getUsers);

// Cập nhật user (vẫn yêu cầu đăng nhập)
router.put('/:id', protect, userController.updateUser);

// Xóa user (vẫn yêu cầu đăng nhập hoặc admin)
router.delete('/:id', protect, userController.deleteUser);

// Chỉ admin được reset password người khác
router.post('/reset-password', protect, isAdmin, userController.resetUserPassword);

module.exports = router;
