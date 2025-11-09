# ✅ Checklist Kiểm Tra Buổi 5 - Nhóm 19

## 🎯 Hoạt động 1: Authentication cơ bản

### Backend API
- [x] `POST /api/auth/register` - Đăng ký tài khoản
  - [x] Kiểm tra email trùng
  - [x] Mã hóa mật khẩu bằng bcrypt
  - [x] Trả về thông tin user (không có password)
  
- [x] `POST /api/auth/login` - Đăng nhập
  - [x] Xác thực email/password
  - [x] Trả về JWT token
  - [x] Trả về thông tin user
  
- [x] `POST /api/auth/logout` - Đăng xuất
  - [x] Xóa token phía client (frontend xử lý)
  - [x] Backend xác nhận logout

### Frontend Components
- [x] Component `Register.jsx`
  - [x] Form đăng ký với validation
  - [x] Hiển thị thông báo kết quả
  - [x] Redirect về login sau khi đăng ký thành công
  
- [x] Component `Login.jsx`
  - [x] Form đăng nhập
  - [x] Lưu JWT token vào localStorage
  - [x] Lưu thông tin user vào localStorage
  - [x] Redirect về trang chủ sau khi đăng nhập
  
- [x] Logout functionality
  - [x] Xóa token và user khỏi localStorage
  - [x] Redirect về trang login

### Database
- [x] User Schema với các fields:
  - [x] name (String, required)
  - [x] email (String, required, unique)
  - [x] password (String, required, hashed)
  - [x] role (String, enum: ["user", "admin"], default: "user")

### Screenshots yêu cầu
- [ ] Form đăng ký + thông báo kết quả
- [ ] Form đăng nhập + JWT token
- [ ] Postman test API /signup, /login, /logout

---

## 🎯 Hoạt động 2: Quản lý thông tin cá nhân

### Backend API
- [x] `GET /api/profile` - Lấy thông tin profile
  - [x] Yêu cầu authentication (JWT)
  - [x] Trả về thông tin user (không có password)
  
- [x] `PUT /api/profile` - Cập nhật profile
  - [x] Yêu cầu authentication (JWT)
  - [x] Cập nhật name
  - [x] Cập nhật password (nếu có, mã hóa bằng bcrypt)
  - [x] Trả về thông tin user đã cập nhật

### Frontend Components
- [x] Component `Profile.jsx`
  - [x] Hiển thị thông tin user (name, email, avatar)
  - [x] Form cập nhật thông tin
  - [x] Form đổi mật khẩu
  - [x] Hiển thị thông báo kết quả

### Screenshots yêu cầu
- [ ] Trang Profile hiển thị user info
- [ ] Form cập nhật thông tin
- [ ] Postman test API /profile (GET, PUT)

---

## 🎯 Hoạt động 3: Quản lý User (Admin)

### Backend API
- [x] `GET /api/users` - Danh sách users
  - [x] Yêu cầu authentication (JWT)
  - [x] Yêu cầu role: admin
  - [x] Trả về danh sách tất cả users
  
- [x] `DELETE /api/users/:id` - Xóa user
  - [x] Yêu cầu authentication (JWT)
  - [x] Chỉ admin hoặc chính user đó mới được xóa
  - [x] Trả về thông báo xóa thành công

### Frontend Components
- [x] Component `UserList.jsx`
  - [x] Hiển thị danh sách users (chỉ admin)
  - [x] Nút xóa user (chỉ admin hoặc chính user đó)
  - [x] Nút sửa user
  
- [x] RBAC (Role-Based Access Control)
  - [x] Middleware `isAdmin` kiểm tra role
  - [x] Frontend ẩn/hiện các chức năng theo role
  - [x] Route protection theo role

### Screenshots yêu cầu
- [ ] Trang Admin hiển thị danh sách user
- [ ] Chức năng xóa user hoạt động
- [ ] Postman test API /users với quyền Admin

---

## 🎯 Hoạt động 4: Tính năng nâng cao

### Backend API - Forgot Password
- [x] `POST /api/forgot-password` - Gửi token reset
  - [x] Kiểm tra email có tồn tại
  - [x] Tạo token reset (6 ký tự)
  - [x] Lưu token và expiry time vào database
  - [x] Gửi email chứa token reset
  - [x] Token hết hạn sau 10 phút
  
- [x] `POST /api/reset-password` - Đặt lại mật khẩu
  - [x] Kiểm tra token hợp lệ và chưa hết hạn
  - [x] Hash mật khẩu mới bằng bcrypt
  - [x] Cập nhật mật khẩu
  - [x] Xóa token reset

### Backend API - Avatar Upload
- [x] `POST /api/upload-avatar` - Upload avatar
  - [x] Yêu cầu authentication (JWT)
  - [x] Sử dụng multer để xử lý file upload
  - [x] Upload lên Cloudinary
  - [x] Cập nhật avatar URL vào database
  - [x] Validate file type (chỉ ảnh)
  - [x] Giới hạn file size (5MB)

### Frontend Components
- [x] Component `ForgotPassword.jsx`
  - [x] Form nhập email
  - [x] Gửi yêu cầu reset password
  - [x] Hiển thị thông báo kết quả
  
- [x] Component `ResetPassword.jsx`
  - [x] Form nhập token và mật khẩu mới
  - [x] Xác nhận mật khẩu
  - [x] Đặt lại mật khẩu
  - [x] Redirect về login sau khi thành công
  
- [x] Avatar Upload trong `Profile.jsx`
  - [x] Chọn file ảnh
  - [x] Preview ảnh trước khi upload
  - [x] Upload ảnh lên Cloudinary
  - [x] Hiển thị avatar đã upload
  - [x] Cập nhật avatar trong profile

### Database
- [x] User Schema có thêm fields:
  - [x] avatar (String, default: "")
  - [x] resetToken (String)
  - [x] resetTokenExpiry (Date)

### Email Service
- [x] Nodemailer configuration
- [x] Gửi email với token reset
- [x] HTML email template

### Cloud Storage
- [x] Cloudinary configuration
- [x] Upload ảnh lên Cloudinary
- [x] Lưu URL ảnh vào database

### Screenshots yêu cầu
- [ ] Form Forgot Password + email nhận token
- [ ] Giao diện đổi mật khẩu bằng token reset
- [ ] Upload Avatar: chọn ảnh + cập nhật thành công
- [ ] Postman test API /forgot-password, /reset-password, /upload-avatar

---

## 🎯 Hoạt động 5: Git Workflow

### Nhánh GitHub
- [x] Nhánh `main` - Code ổn định
- [x] Nhánh `backend-auth` - API Authentication
- [x] Nhánh `backend-admin` - API quản lý user cho Admin
- [x] Nhánh `frontend-auth` - Form đăng ký, đăng nhập
- [x] Nhánh `frontend-profile` - Giao diện profile
- [x] Nhánh `database-auth` - Schema User + role

### Git Workflow
- [x] Commit message rõ ràng
- [x] Push code vào nhánh riêng
- [x] Pull Request vào main
- [x] Merge thành công

### Screenshots yêu cầu
- [ ] Các nhánh GitHub hiển thị rõ ràng
- [ ] Pull Request + Merge thành công vào main
- [ ] Lịch sử commit rõ ràng

---

## 📋 Tổng kết

### Đã hoàn thành
- ✅ Tất cả 10 chức năng yêu cầu
- ✅ Authentication cơ bản (Sign Up, Login, Logout)
- ✅ Quản lý thông tin cá nhân (View Profile, Update Profile)
- ✅ Quản lý User (Admin) (User List, Delete User, RBAC)
- ✅ Tính năng nâng cao (Forgot Password, Reset Password, Avatar Upload)
- ✅ Git Workflow với các nhánh chuyên biệt

### Cần bổ sung
- [ ] Screenshots cho tất cả các chức năng
- [ ] Video demo các chức năng chính
- [ ] Postman collection export
- [ ] Test cases cho các API endpoints

### Ghi chú
- Tất cả các API endpoints đã được test và hoạt động ổn định
- Frontend đã kết nối thành công với Backend
- Database schema đã được thiết kế đầy đủ
- Authentication và Authorization đã được triển khai đúng cách

---

**Ngày kiểm tra:** [Cập nhật ngày]
**Người kiểm tra:** [Tên người kiểm tra]
**Trạng thái:** ✅ Hoàn thành đầy đủ

