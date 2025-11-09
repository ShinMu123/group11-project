require('dotenv').config();
const express = require('express');
const cors = require('cors');
const fs = require('fs');
const connectDB = require('./config/db');

const userRoutes = require('./routes/userRoutes');
const authRoutes = require('./routes/authRoutes');
const profileRoutes = require('./routes/profileRoutes');

const app = express();

// ===== Middleware =====
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Tạo thư mục uploads nếu chưa có
if (!fs.existsSync('uploads')) fs.mkdirSync('uploads');
if (!fs.existsSync('uploads/avatars')) fs.mkdirSync('uploads/avatars', { recursive: true });

// Serve static files
app.use('/uploads', express.static('uploads'));

// Debug middleware
if (process.env.NODE_ENV === 'development') {
  app.use((req, res, next) => {
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
    next();
  });
}

// ===== Database =====
connectDB();

// ===== Routes =====
app.use('/api/users', userRoutes);
app.use('/api/auth', authRoutes);
app.use('/api', profileRoutes);
app.use('/api', require('./routes/forgotPasswordRoutes'));
app.use('/api', require('./routes/avatarRoutes'));

// ===== Catch-all route sửa lỗi PathError =====
app.use((req, res) => {
  res.status(404).json({ message: `Cannot ${req.method} ${req.originalUrl}` });
});

// ===== Error handling middleware =====
app.use((err, req, res, next) => {
  console.error('Server Error:', err);
  res.status(500).json({
    message: 'Lỗi server',
    error: process.env.NODE_ENV === 'development' ? err.message : undefined
  });
});

// ===== Start server =====
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`🚀 Server chạy tại: http://localhost:${PORT}`));
