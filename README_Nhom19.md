#  Dự án nhóm 19 – Lớp DH22TIN05 - Buổi 5
**Công nghệ sử dụng:** Node.js + React + MongoDB + GitHub + Authentication & User Management

---

## 🎯 Mục tiêu Buổi 5
- Xây dựng ứng dụng web hoàn chỉnh với Authentication & User Management
- Triển khai đầy đủ các chức năng: Sign Up, Login, Profile, Admin, Forgot Password, Avatar Upload
- Sử dụng Git workflow với các nhánh chuyên biệt
- Thực hành teamwork như môi trường công ty

## 📋 Các chức năng đã triển khai

### ✅ Hoạt động 1: Authentication cơ bản
- [x] Đăng ký (Sign Up) – kiểm tra email trùng, mã hóa mật khẩu (bcrypt)
- [x] Đăng nhập (Login) – xác thực email/password, trả về JWT token
- [x] Đăng xuất (Logout) – xóa token phía client

### ✅ Hoạt động 2: Quản lý thông tin cá nhân
- [x] Cập nhật thông tin cá nhân (Update Profile)
- [x] Xem thông tin cá nhân (View Profile)

### ✅ Hoạt động 3: Quản lý User (Admin)
- [x] Danh sách người dùng (User List – Admin)
- [x] Xóa tài khoản (Delete User – Admin hoặc tự xóa)
- [x] Phân quyền (RBAC) – User thường và Admin

### ✅ Hoạt động 4: Tính năng nâng cao
- [x] Quên mật khẩu (Forgot Password) – gửi token reset qua email
- [x] Đặt lại mật khẩu (Reset Password) – dùng token để đổi mật khẩu
- [x] Upload Avatar – lưu ảnh lên Cloudinary

### ✅ Hoạt động 5: Git Workflow
- [x] Cấu trúc nhánh: backend-auth, backend-admin, frontend-auth, frontend-profile, database-auth
- [x] Commit + Push theo nhánh riêng
- [x] Pull Request + Merge vào main

---

## 👥 Phân chia công việc nhóm

### 1. Trần Ngọc Vinh (Nhóm trưởng – Backend Developer)
**Vai trò:** Quản lý nhóm + phát triển Backend
**Công việc phụ trách:**
- Quản lý tiến độ và phân chia công việc.
- Cài đặt môi trường Node.js + Express.
- Viết API Backend: Authentication, User Management, Profile, Admin routes.
- Kết nối MongoDB bằng Mongoose.
- Triển khai Forgot Password & Avatar Upload với Cloudinary.
- Test API bằng Postman.
- Push code backend lên các nhánh chuyên biệt.
**Đóng góp:** 100%

### 2. Trần Huỳnh Đăng Khôi (Frontend Developer)
**Vai trò:** Thiết kế và xây dựng giao diện ReactJS
**Công việc phụ trách:**
- Cài đặt môi trường React (`npx create-react-app`).
- Tạo các component: Login, Register, Profile, UserList, Admin, ForgotPassword, ResetPassword.
- Kết nối API từ backend bằng Axios.
- Hiển thị dữ liệu từ MongoDB lên giao diện.
- Push code frontend lên các nhánh chuyên biệt.
**Đóng góp:** 100%

### 3. Phạm Huỳnh Bảo Toàn (Database Manager)
**Vai trò:** Thiết kế và quản lý cơ sở dữ liệu MongoDB
**Công việc phụ trách:**
- Thiết kế model User với authentication fields.
- Tạo schema MongoDB với Mongoose (roles, avatar, reset tokens).
- Kết nối và test dữ liệu trên MongoDB Atlas.
- Quản lý file sao lưu dữ liệu.
- Push code database lên nhánh database-auth.
**Đóng góp:** 100%

---

## 🏗️ Cấu trúc nhánh GitHub nhóm

| Nhánh | Mục đích | Người phụ trách | Trạng thái |
|-------|-----------|----------------|------------|
| `main` | Nhánh chính chứa code ổn định | Vinh (merge cuối cùng) | ✅ |
| `backend-auth` | API Authentication (signup, login, logout) | Vinh | ✅ |
| `backend-admin` | API quản lý user cho Admin (user list, delete) | Vinh | ✅ |
| `frontend-auth` | Form đăng ký, đăng nhập React | Khôi | ✅ |
| `frontend-profile` | Giao diện Profile, Update Profile | Khôi | ✅ |
| `database-auth` | Schema User + role, reset tokens | Toàn | ✅ |

---

## 🚀 Hướng dẫn chạy project

### 1. Backend
```bash
cd group19-project/backend
npm install
# Tạo file .env với các biến môi trường
npm start
```

### 2. Frontend
```bash
cd group19-project/frontend
npm install
npm start
```

### 3. Database
- MongoDB Atlas hoặc MongoDB local
- Connection string trong file `.env`

---

## 🔧 Cấu hình môi trường (.env)

Tạo file `.env` trong thư mục `backend/`:

```env
MONGO_URI=mongodb://localhost:27017/group19-project
JWT_SECRET=your_jwt_secret_key_here
EMAIL_USER=your_gmail@gmail.com
EMAIL_PASS=your_gmail_app_password
CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret
```

---

## 📡 API Endpoints

### Authentication
- `POST /api/auth/register` - Đăng ký
- `POST /api/auth/login` - Đăng nhập
- `POST /api/auth/logout` - Đăng xuất

### Profile
- `GET /api/profile` - Lấy thông tin profile
- `PUT /api/profile` - Cập nhật profile

### Admin (yêu cầu role: admin)
- `GET /api/users` - Danh sách users
- `DELETE /api/users/:id` - Xóa user

### Password Reset
- `POST /api/forgot-password` - Gửi token reset
- `POST /api/reset-password` - Đặt lại mật khẩu

### Avatar Upload
- `POST /api/upload-avatar` - Upload avatar (multipart/form-data)

---

## 🧪 Test với Postman

### 1. Đăng ký Admin đầu tiên
```json
POST /api/auth/register
{
  "name": "Admin User",
  "email": "admin@example.com",
  "password": "admin123"
}
```

### 2. Đăng ký User thường
```json
POST /api/auth/register
{
  "name": "Test User",
  "email": "user@example.com",
  "password": "user123"
}
```

### 3. Đăng nhập
```json
POST /api/auth/login
{
  "email": "admin@example.com",
  "password": "admin123"
}
```

### 4. Test API với Authorization Header
```
Authorization: Bearer <JWT_TOKEN>
```

---

## 📸 Screenshots yêu cầu

### Hoạt động 1: Authentication
- ✅ Form đăng ký + thông báo kết quả
- ✅ Form đăng nhập + JWT token
- ✅ Postman test API /signup, /login, /logout

### Hoạt động 2: Profile Management
- ✅ Trang Profile hiển thị user info
- ✅ Form cập nhật thông tin
- ✅ Postman test API /profile (GET, PUT)

### Hoạt động 3: Admin Management
- ✅ Trang Admin hiển thị danh sách user
- ✅ Chức năng xóa user hoạt động
- ✅ Postman test API /users với quyền Admin

### Hoạt động 4: Advanced Features
- ✅ Form Forgot Password + email nhận token
- ✅ Giao diện đổi mật khẩu bằng token reset
- ✅ Upload Avatar: chọn ảnh + cập nhật thành công
- ✅ Postman test API /forgot-password, /reset-password, /upload-avatar

### Hoạt động 5: Git Workflow
- ✅ Các nhánh GitHub hiển thị rõ ràng
- ✅ Pull Request + Merge thành công vào main
- ✅ Lịch sử commit rõ ràng

---

## 🎬 Demo Video
Video demo các chức năng chính sẽ được tạo và upload lên YouTube/GitHub.

---

## 📝 Ghi chú
- Dự án đã hoàn thành đầy đủ yêu cầu của Buổi 5
- Tất cả tính năng Authentication & User Management đã được triển khai
- Git workflow đã được thực hiện đúng theo yêu cầu
- Code đã được test và chạy ổn định
