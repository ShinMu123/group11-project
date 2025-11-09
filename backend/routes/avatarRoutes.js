const express = require('express');
const router = express.Router();
const avatarController = require('../controllers/avatarController');
const { protect } = require('../middleware/auth');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

// ====================
// Cấu hình Multer
// ====================
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const uploadDir = 'uploads/avatars';
    if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    // Tên file: timestamp + extension
    cb(null, Date.now() + path.extname(file.originalname));
  }
});

const upload = multer({
  storage: storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Chỉ chấp nhận file ảnh'), false);
    }
  }
});

// ====================
// POST /api/upload-avatar
// Middleware: protect => user phải login
// Multer: upload.single('avatar')
// Controller: avatarController.uploadAvatar
// ====================
router.post('/upload-avatar', protect, upload.single('avatar'), avatarController.uploadAvatar);

module.exports = router;
