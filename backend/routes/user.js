const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');

// 📤 Lấy danh sách người dùng
router.get('/', userController.getUsers);

// 📥 Thêm người dùng
router.post('/', userController.createUser);

// ✏️ Cập nhật thông tin người dùng
router.put('/:id', userController.updateUser);

// 🗑️ Xóa người dùng
router.delete('/:id', userController.deleteUser);

module.exports = router;
