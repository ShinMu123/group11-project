/**
 * Utility script để reset password cho user
 * Chạy script này trong MongoDB shell hoặc tạo endpoint admin để reset password
 * 
 * Usage trong MongoDB shell:
 * use group19-project
 * db.users.updateOne(
 *   { email: "jax@gmail.com" },
 *   { $set: { password: "$2b$10$..." } }
 * )
 */

const bcrypt = require('bcryptjs');
const User = require('../models/User');

/**
 * Reset password cho user bằng email
 * @param {string} email - Email của user
 * @param {string} newPassword - Mật khẩu mới (plain text)
 */
async function resetUserPassword(email, newPassword) {
  try {
    const user = await User.findOne({ email });
    if (!user) {
      throw new Error('User not found');
    }

    // Hash password mới
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    
    // Cập nhật password
    user.password = hashedPassword;
    await user.save();

    console.log(`✅ Password đã được reset cho user: ${email}`);
    return { success: true, message: 'Password reset successfully' };
  } catch (error) {
    console.error('❌ Error resetting password:', error);
    throw error;
  }
}

module.exports = { resetUserPassword };

