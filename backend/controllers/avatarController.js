const cloudinary = require('cloudinary').v2;
const User = require('../models/User');
const path = require('path');
const fs = require('fs');

// Kiểm tra Cloudinary có được cấu hình không
const isCloudinaryConfigured = () => {
  return !!(
    process.env.CLOUDINARY_CLOUD_NAME &&
    process.env.CLOUDINARY_API_KEY &&
    process.env.CLOUDINARY_API_SECRET
  );
};

// Cấu hình Cloudinary (nếu có)
if (isCloudinaryConfigured()) {
  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
  });
  console.log('✅ Cloudinary đã được cấu hình');
} else {
  console.warn('⚠️  Cloudinary chưa được cấu hình. Sẽ sử dụng lưu file local.');
  console.warn('   Để sử dụng Cloudinary, thêm các biến sau vào file .env:');
  console.warn('   - CLOUDINARY_CLOUD_NAME');
  console.warn('   - CLOUDINARY_API_KEY');
  console.warn('   - CLOUDINARY_API_SECRET');
}

// Upload avatar
exports.uploadAvatar = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'Không có file nào được upload'
      });
    }

    let avatarUrl;
    let usedCloudinary = false;

    // Nếu Cloudinary được cấu hình, thử upload lên Cloudinary
    if (isCloudinaryConfigured()) {
      try {
        console.log('Attempting to upload to Cloudinary...');
        const result = await cloudinary.uploader.upload(req.file.path, {
          folder: 'user-avatars',
          width: 300,
          height: 300,
          crop: 'fill',
          gravity: 'face'
        });

        avatarUrl = result.secure_url;
        usedCloudinary = true;
        console.log('✅ Avatar uploaded to Cloudinary:', avatarUrl);

        // Xóa file tạm sau khi upload lên Cloudinary thành công
        try {
          fs.unlinkSync(req.file.path);
        } catch (unlinkError) {
          console.warn('Warning: Could not delete temp file:', unlinkError.message);
        }
      } catch (cloudinaryError) {
        console.error('❌ Cloudinary upload error:', cloudinaryError.message);
        console.log('⚠️  Falling back to local storage...');
        // Fallback về lưu local nếu Cloudinary lỗi
        // Không return error, tiếp tục với local storage
      }
    }

    // Nếu Cloudinary không được cấu hình hoặc upload lỗi, dùng local storage
    if (!avatarUrl) {
      // Fallback: Lưu file local và trả về URL local
      const fileName = `avatar-${req.user.id}-${Date.now()}${path.extname(req.file.originalname)}`;
      const publicPath = path.join('uploads', 'avatars');
      
      // Tạo thư mục nếu chưa có
      if (!fs.existsSync(publicPath)) {
        fs.mkdirSync(publicPath, { recursive: true });
      }

      const targetPath = path.join(publicPath, fileName);
      fs.renameSync(req.file.path, targetPath);

      // Tạo URL local (trong production nên dùng domain thực tế)
      const baseUrl = process.env.BASE_URL || 'http://localhost:3000';
      avatarUrl = `${baseUrl}/uploads/avatars/${fileName}`;
      console.log('✅ Avatar saved locally:', avatarUrl);
    }

    // Cập nhật avatar trong database
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'Không tìm thấy user'
      });
    }

    user.avatar = avatarUrl;
    await user.save();

    res.json({
      success: true,
      message: usedCloudinary 
        ? 'Upload avatar thành công (Cloudinary)'
        : 'Upload avatar thành công (Local storage)',
      avatar: avatarUrl
    });

  } catch (error) {
    console.error('Upload avatar error:', error);
    res.status(500).json({
      success: false,
      message: 'Lỗi khi upload avatar',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
    });
  }
};
