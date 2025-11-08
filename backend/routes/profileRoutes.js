const express = require('express');
const router = express.Router();
const profileController = require('../controllers/profileController');
const { protect } = require('../middleware/auth');

// GET /api/profile - Get current user's profile
router.get('/profile', protect, profileController.getProfile);

// PUT /api/profile - Update current user's profile
router.put('/profile', protect, profileController.updateProfile);

module.exports = router;
