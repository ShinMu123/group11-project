const crypto = require('crypto');
const bcrypt = require('bcryptjs');
const nodemailer = require('nodemailer');
const User = require('../models/User');

// Kiểm tra email có được cấu hình không
const isEmailConfigured = () => {
  return !!(process.env.EMAIL_USER && process.env.EMAIL_PASS);
};

// Tạo transporter cho email (nếu có cấu hình)
let transporter = null;
if (isEmailConfigured()) {
  try {
    transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
      }
    });
    console.log('✅ Email service đã được cấu hình');
  } catch (error) {
    console.error('❌ Lỗi cấu hình email:', error.message);
  }
} else {
  console.warn('⚠️  Email chưa được cấu hình. Token sẽ được trả về trong response (chỉ dùng cho development)');
  console.warn('   Để sử dụng email, thêm vào file .env:');
  console.warn('   - EMAIL_USER=your_email@gmail.com');
  console.warn('   - EMAIL_PASS=your_gmail_app_password');
}

// Quên mật khẩu - gửi token reset
exports.forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;

    console.log('Forgot password request for email:', email);

    if (!email) {
      return res.status(400).json({
        success: false,
        message: 'Vui lòng nhập email'
      });
    }

    // Tìm user theo email
    let user;
    try {
      user = await User.findOne({ email });
      console.log('User found:', user ? 'Yes' : 'No');
    } catch (dbError) {
      console.error('Database error when finding user:', dbError);
      throw dbError;
    }

    if (!user) {
      // Trả về message chung để không tiết lộ email có tồn tại hay không (bảo mật)
      return res.json({
        success: true,
        message: 'Nếu email tồn tại trong hệ thống, mã token đã được gửi đến email của bạn'
      });
    }

    // Tạo token reset (6 ký tự hex)
    const resetToken = crypto.randomBytes(3).toString('hex').toUpperCase();
    console.log('Generated reset token:', resetToken);

    // Lưu token vào database
    try {
      // Sử dụng đúng tên field trong User model
      user.resetPasswordToken = resetToken;
      user.resetPasswordExpire = new Date(Date.now() + 10 * 60 * 1000); // 10 phút
      await user.save();
      console.log('Token saved to database successfully');
    } catch (saveError) {
      console.error('Error saving token to database:', saveError);
      throw saveError;
    }

    // Kiểm tra NODE_ENV (mặc định là development nếu không set)
    const nodeEnv = process.env.NODE_ENV || 'development';
    console.log('NODE_ENV:', nodeEnv);
    console.log('Email configured:', isEmailConfigured());
    console.log('Transporter available:', !!transporter);

    // Nếu email được cấu hình, gửi email
    if (isEmailConfigured() && transporter) {
      try {
        console.log('Attempting to send email...');
        const mailOptions = {
          from: process.env.EMAIL_USER,
          to: email,
          subject: 'Đặt lại mật khẩu - User Management System',
          html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
              <h2 style="color: #333;">Đặt lại mật khẩu</h2>
              <p>Xin chào ${user.name},</p>
              <p>Bạn đã yêu cầu đặt lại mật khẩu cho tài khoản của mình.</p>
              <p>Mã token của bạn là: <strong style="font-size: 24px; color: #007bff;">${resetToken}</strong></p>
              <p>Mã này sẽ hết hạn sau 10 phút.</p>
              <p>Nếu bạn không yêu cầu đặt lại mật khẩu, vui lòng bỏ qua email này.</p>
              <br>
              <p>Trân trọng,<br>User Management Team</p>
            </div>
          `
        };

        await transporter.sendMail(mailOptions);
        console.log('Email sent successfully');
        
        return res.json({
          success: true,
          message: 'Mã token đã được gửi đến email của bạn'
        });
      } catch (emailError) {
        console.error('❌ Lỗi khi gửi email:', emailError.message);
        console.error('Email error details:', emailError);
        // Fallback: Luôn trả về token trong response khi email lỗi
        // (Để không làm gián đoạn quá trình reset password)
        console.log('⚠️  Email gửi thất bại, trả về token trong response...');
        return res.json({
          success: true,
          message: 'Email chưa được cấu hình hoặc có lỗi khi gửi. Token reset của bạn:',
          token: resetToken,
          warning: 'Vui lòng kiểm tra cấu hình email (EMAIL_USER, EMAIL_PASS) trong file .env',
          emailError: emailError.message
        });
      }
    } else {
      // Không có cấu hình email - trả về token trong response
      console.log('⚠️  No email config, returning token in response');
      return res.json({
        success: true,
        message: 'Email chưa được cấu hình. Token reset của bạn:',
        token: resetToken,
        warning: 'Vui lòng cấu hình email (EMAIL_USER, EMAIL_PASS) trong file .env để gửi token qua email'
      });
    }

  } catch (error) {
    console.error('Forgot password error:', error);
    console.error('Error stack:', error.stack);
    console.error('Error name:', error.name);
    console.error('Error message:', error.message);
    
    res.status(500).json({
      success: false,
      message: 'Lỗi khi xử lý yêu cầu đặt lại mật khẩu',
      error: (process.env.NODE_ENV === 'development' || !process.env.NODE_ENV) ? error.message : undefined,
      details: (process.env.NODE_ENV === 'development' || !process.env.NODE_ENV) ? {
        name: error.name,
        stack: error.stack
      } : undefined
    });
  }
};

// Đặt lại mật khẩu bằng token
exports.resetPassword = async (req, res) => {
  try {
    const { token, password } = req.body;

    if (!token || !password) {
      return res.status(400).json({
        success: false,
        message: 'Vui lòng nhập token và mật khẩu mới'
      });
    }

    // Tìm user có token hợp lệ
    const user = await User.findOne({
      resetPasswordToken: token,
      resetPasswordExpire: { $gt: Date.now() }
    });

    if (!user) {
      return res.status(400).json({
        success: false,
        message: 'Token không hợp lệ hoặc đã hết hạn'
      });
    }

    // Hash mật khẩu mới
    const hashedPassword = await bcrypt.hash(password, 10);

    // Cập nhật mật khẩu và xóa token
    user.password = hashedPassword;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;
    await user.save();

    res.json({
      success: true,
      message: 'Mật khẩu đã được đặt lại thành công'
    });

  } catch (error) {
    console.error('Reset password error:', error);
    res.status(500).json({
      success: false,
      message: 'Lỗi khi đặt lại mật khẩu',
      error: error.message
    });
  }
};
