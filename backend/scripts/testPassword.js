/**
 * Script test password để debug vấn đề login
 * Chạy: node scripts/testPassword.js
 */

require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('../models/User');
const connectDB = require('../config/db');

async function testPassword() {
  try {
    // Kết nối database
    await connectDB();
    
    const email = 'jax@gmail.com';
    const testPassword = 'your_password_here'; // Thay bằng password bạn muốn test
    
    // Tìm user
    const user = await User.findOne({ email }).select('+password');
    
    if (!user) {
      console.log('❌ User không tồn tại!');
      return;
    }
    
    console.log('=== THÔNG TIN USER ===');
    console.log('Email:', user.email);
    console.log('Name:', user.name);
    console.log('Password hash length:', user.password?.length);
    console.log('Password hash (first 30 chars):', user.password?.substring(0, 30));
    console.log('Password hash format:', user.password?.startsWith('$2') ? '✅ Bcrypt format' : '❌ Không phải bcrypt');
    
    console.log('\n=== TEST PASSWORD ===');
    console.log('Testing password:', testPassword);
    
    // Test so sánh password
    const isValid = await bcrypt.compare(testPassword, user.password);
    console.log('Password match:', isValid ? '✅ ĐÚNG' : '❌ SAI');
    
    // Test với một số biến thể
    console.log('\n=== TEST CÁC BIẾN THỂ ===');
    const variants = [
      testPassword,
      testPassword.trim(),
      testPassword + ' ',
      ' ' + testPassword,
      testPassword.toLowerCase(),
      testPassword.toUpperCase()
    ];
    
    for (const variant of variants) {
      const match = await bcrypt.compare(variant, user.password);
      console.log(`"${variant}" (length: ${variant.length}):`, match ? '✅ MATCH' : '❌ NO MATCH');
    }
    
    // Tạo password hash mới để so sánh
    console.log('\n=== TẠO PASSWORD HASH MỚI ===');
    const newHash = await bcrypt.hash(testPassword, 10);
    console.log('New hash:', newHash.substring(0, 30) + '...');
    const newMatch = await bcrypt.compare(testPassword, newHash);
    console.log('New hash matches test password:', newMatch ? '✅ YES' : '❌ NO');
    
    // So sánh hash cũ và hash mới
    console.log('\n=== SO SÁNH HASH ===');
    console.log('Old hash và new hash giống nhau?', user.password === newHash ? '✅ YES' : '❌ NO (bình thường vì bcrypt tạo salt ngẫu nhiên)');
    
    console.log('\n=== KẾT LUẬN ===');
    if (isValid) {
      console.log('✅ Password đúng! Vấn đề có thể ở frontend hoặc cách gửi request.');
    } else {
      console.log('❌ Password sai! Có thể:');
      console.log('   1. Password bạn nhập không đúng với password khi đăng ký');
      console.log('   2. Password đã bị thay đổi sau khi đăng ký');
      console.log('   3. Có khoảng trắng hoặc ký tự đặc biệt trong password');
      console.log('\n💡 Giải pháp:');
      console.log('   - Sử dụng chức năng "Forgot Password" để reset password');
      console.log('   - Hoặc admin có thể reset password qua API: POST /api/users/reset-password');
    }
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }
}

// Chạy script
testPassword();

