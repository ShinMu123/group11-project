const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');

// GET tất cả user
router.get('/users', userController.getUsers);

// POST thêm user
router.post('/users', userController.createUser);

// PUT cập nhật user
router.put('/users/:id', userController.updateUser);

// DELETE xóa user
router.delete('/users/:id', userController.deleteUser);

module.exports = router;
