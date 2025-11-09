# 🔧 Hướng dẫn xử lý lỗi Password không khớp

## Vấn đề

Khi đăng nhập, bạn gặp lỗi "Mật khẩu không đúng" mặc dù đã nhập đúng password.

## Nguyên nhân có thể

1. **Password nhập vào không đúng với password khi đăng ký**
   - Có thể có khoảng trắng ở đầu/cuối
   - Có thể bị viết hoa/thường sai
   - Có thể có ký tự đặc biệt bị nhầm lẫn

2. **User được tạo từ route khác**
   - User có thể được tạo từ `/api/users` thay vì `/api/auth/register`
   - Cả hai đều hash password đúng, nhưng có thể có sự khác biệt

3. **Password đã bị thay đổi**
   - Password có thể đã bị reset hoặc thay đổi sau khi đăng ký

## Giải pháp

### Giải pháp 1: Sử dụng chức năng "Forgot Password"

1. Truy cập trang "Quên mật khẩu" trên frontend
2. Nhập email: `jax@gmail.com`
3. Kiểm tra email để lấy token reset
4. Sử dụng token để đặt lại mật khẩu mới

### Giải pháp 2: Admin reset password (Nếu bạn là admin)

**Sử dụng Postman:**

```http
POST http://localhost:3000/api/users/reset-password
Authorization: Bearer <ADMIN_JWT_TOKEN>
Content-Type: application/json

{
  "userId": "690f932aaf0c0d2212c2512a",
  "newPassword": "password123"
}
```

**Hoặc sử dụng script:**

1. Chỉnh sửa file `backend/scripts/testPassword.js`
2. Thay `testPassword = 'your_password_here'` bằng password mới bạn muốn
3. Chạy:
```bash
cd backend
node scripts/testPassword.js
```

### Giải pháp 3: Reset password trực tiếp trong MongoDB

**Sử dụng MongoDB Compass hoặc MongoDB Shell:**

```javascript
use group19-project

// Tìm user
db.users.findOne({ email: "jax@gmail.com" })

// Reset password (hash mật khẩu mới)
// Lưu ý: Bạn cần hash password trước, có thể dùng script testPassword.js
// Hoặc sử dụng bcrypt trong Node.js để tạo hash

// Ví dụ: Reset password thành "password123"
// Hash của "password123" với bcrypt sẽ là: $2b$10$...
// Bạn có thể lấy hash này từ script testPassword.js

db.users.updateOne(
  { email: "jax@gmail.com" },
  { $set: { password: "$2b$10$NEW_HASHED_PASSWORD_HERE" } }
)
```

### Giải pháp 4: Tạo lại user mới

Nếu không cần giữ lại user cũ, bạn có thể:

1. Xóa user cũ
2. Đăng ký lại với email và password mới

## Kiểm tra và Debug

### 1. Chạy script test password

```bash
cd backend
node scripts/testPassword.js
```

Script này sẽ:
- Tìm user trong database
- Kiểm tra format password hash
- Test so sánh password với các biến thể
- Đưa ra kết luận và gợi ý

### 2. Kiểm tra log khi đăng nhập

Khi đăng nhập, server sẽ log:
- Password input (để debug)
- Password hash trong database
- Kết quả so sánh

Xem log trong console để biết thêm chi tiết.

### 3. Kiểm tra password hash format

Password hash phải bắt đầu bằng `$2b$10$` (hoặc `$2a$10$`, `$2y$10$`)

Nếu không, password đã bị hash sai hoặc không phải bcrypt.

## Phòng ngừa

1. **Luôn sử dụng `/api/auth/register` để đăng ký**
   - Không sử dụng `/api/users` để tạo user (trừ khi cần admin tạo user)

2. **Kiểm tra password trước khi lưu**
   - Trim whitespace
   - Validate độ dài
   - Không cho phép password rỗng

3. **Test password ngay sau khi đăng ký**
   - Đăng nhập ngay sau khi đăng ký thành công
   - Đảm bảo password hoạt động

## Liên hệ

Nếu vấn đề vẫn tiếp tục, hãy:
1. Kiểm tra log server để xem chi tiết lỗi
2. Chạy script testPassword.js và gửi kết quả
3. Kiểm tra xem user có được tạo đúng cách không

---

**Lưu ý:** File này chỉ dùng cho môi trường development. Trong production, nên sử dụng chức năng "Forgot Password" thay vì reset trực tiếp trong database.

