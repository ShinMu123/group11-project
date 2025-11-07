require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');
const userRoutes = require('./routes/userRoutes');
const authRoutes = require('./routes/authRoutes'); // Import auth routes

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Kết nối database
connectDB();

// Debug middleware
app.use((req, res, next) => {
  console.log(`${req.method} ${req.url}`);
  console.log('Request body:', req.body);
  
  // Capture and log response
  const oldJson = res.json;
  res.json = function(data) {
    console.log('Response:', data);
    return oldJson.apply(res, arguments);
  };
  
  next();
});

// Routes
app.use('/api/users', userRoutes);
app.use('/api/auth', authRoutes); // Add auth routes

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(500).json({
    message: 'Lỗi server',
    error: process.env.NODE_ENV === 'development' ? err.message : undefined
  });
});

// Start server
const PORT = 3000;
app.listen(PORT, () => console.log(`🚀 Server chạy tại: http://localhost:${PORT}`));
