# User Management System - Nhóm 19

Ứng dụng quản lý người dùng với đầy đủ tính năng Authentication & User Management.

## 🚀 Công nghệ sử dụng

- **Backend:** Node.js, Express.js, MongoDB, Mongoose
- **Frontend:** React.js, React Router, Axios
- **Authentication:** JWT (JSON Web Token)
- **Database:** MongoDB Atlas / MongoDB Local
- **Cloud Storage:** Cloudinary (Avatar upload)
- **Email Service:** Nodemailer (Forgot Password)

## 📋 Yêu cầu hệ thống

- Node.js >= 14.x
- MongoDB >= 4.x hoặc MongoDB Atlas account
- npm hoặc yarn

## 🔧 Cài đặt và chạy project

### 1. Clone repository

```bash
git clone <repository-url>
cd group19-project
```

### 2. Cài đặt Backend

```bash
cd backend
npm install
```

### 3. Cấu hình môi trường Backend

Tạo file `.env` trong thư mục `backend/`:

```env
# MongoDB Connection
MONGO_URI=mongodb://localhost:27017/group19-project
# Hoặc sử dụng MongoDB Atlas:
# MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/group19-project

# JWT Secret
JWT_SECRET=your_super_secret_jwt_key_change_this_in_production

# Email Configuration (Gmail)
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_gmail_app_password

# Cloudinary Configuration
CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret

# Server Port (optional)
PORT=3000
NODE_ENV=development
```

**Lưu ý:**
- Để lấy Gmail App Password: [Google App Passwords](https://support.google.com/accounts/answer/185833)
- Để lấy Cloudinary credentials: [Cloudinary Dashboard](https://cloudinary.com/console)

### 4. Chạy Backend

```bash
# Development mode (với nodemon)
npm run dev

# Production mode
npm start
```

Backend sẽ chạy tại: `http://localhost:3000`

### 5. Cài đặt Frontend

Mở terminal mới:

```bash
cd frontend
npm install
```

### 6. Chạy Frontend

```bash
npm start
```

Frontend sẽ chạy tại: `http://localhost:3000` (nếu port 3000 bị chiếm, React sẽ tự động chuyển sang port khác như 3001)

## 📡 API Endpoints

### Authentication

| Method | Endpoint | Mô tả | Auth Required |
|--------|----------|-------|---------------|
| POST | `/api/auth/register` | Đăng ký tài khoản mới | ❌ |
| POST | `/api/auth/login` | Đăng nhập | ❌ |
| POST | `/api/auth/logout` | Đăng xuất | ✅ |

### Profile Management

| Method | Endpoint | Mô tả | Auth Required |
|--------|----------|-------|---------------|
| GET | `/api/profile` | Lấy thông tin profile | ✅ |
| PUT | `/api/profile` | Cập nhật profile | ✅ |

### User Management (Admin only)

| Method | Endpoint | Mô tả | Auth Required | Role Required |
|--------|----------|-------|---------------|---------------|
| GET | `/api/users` | Lấy danh sách users | ✅ | Admin |
| POST | `/api/users` | Tạo user mới | ✅ | - |
| PUT | `/api/users/:id` | Cập nhật user | ✅ | - |
| DELETE | `/api/users/:id` | Xóa user | ✅ | Admin hoặc chính user đó |

### Password Reset

| Method | Endpoint | Mô tả | Auth Required |
|--------|----------|-------|---------------|
| POST | `/api/forgot-password` | Gửi token reset qua email | ❌ |
| POST | `/api/reset-password` | Đặt lại mật khẩu bằng token | ❌ |

### Avatar Upload

| Method | Endpoint | Mô tả | Auth Required |
|--------|----------|-------|---------------|
| POST | `/api/upload-avatar` | Upload avatar (multipart/form-data) | ✅ |

## 🧪 Test API với Postman

### 1. Đăng ký tài khoản

```http
POST http://localhost:3000/api/auth/register
Content-Type: application/json

{
  "name": "Test User",
  "email": "test@example.com",
  "password": "password123"
}
```

### 2. Đăng nhập

```http
POST http://localhost:3000/api/auth/login
Content-Type: application/json

{
  "email": "test@example.com",
  "password": "password123"
}
```

Response sẽ trả về JWT token:
```json
{
  "success": true,
  "message": "Đăng nhập thành công",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "...",
    "name": "Test User",
    "email": "test@example.com",
    "role": "user"
  }
}
```

### 3. Lấy thông tin profile (cần token)

```http
GET http://localhost:3000/api/profile
Authorization: Bearer <JWT_TOKEN>
```

### 4. Cập nhật profile

```http
PUT http://localhost:3000/api/profile
Authorization: Bearer <JWT_TOKEN>
Content-Type: application/json

{
  "name": "Updated Name",
  "password": "newpassword123"
}
```

### 5. Lấy danh sách users (Admin only)

```http
GET http://localhost:3000/api/users
Authorization: Bearer <ADMIN_JWT_TOKEN>
```

### 6. Quên mật khẩu

```http
POST http://localhost:3000/api/forgot-password
Content-Type: application/json

{
  "email": "test@example.com"
}
```

### 7. Đặt lại mật khẩu

```http
POST http://localhost:3000/api/reset-password
Content-Type: application/json

{
  "token": "ABC123",
  "password": "newpassword123"
}
```

### 8. Upload Avatar

```http
POST http://localhost:3000/api/upload-avatar
Authorization: Bearer <JWT_TOKEN>
Content-Type: multipart/form-data

avatar: <file>
```

## 👤 Tạo tài khoản Admin

Để tạo tài khoản admin, bạn có thể:

1. **Sử dụng MongoDB Compass hoặc MongoDB Shell:**
```javascript
use group19-project
db.users.updateOne(
  { email: "admin@example.com" },
  { $set: { role: "admin" } }
)
```

2. **Hoặc đăng ký tài khoản thường, sau đó cập nhật role trong database**

## 📁 Cấu trúc thư mục

```
group19-project/
├── backend/
│   ├── config/
│   │   └── db.js                 # Cấu hình MongoDB
│   ├── controllers/
│   │   ├── authController.js     # Xử lý đăng ký, đăng nhập
│   │   ├── profileController.js  # Xử lý profile
│   │   ├── userController.js     # Xử lý quản lý user
│   │   ├── forgotPasswordController.js  # Xử lý quên mật khẩu
│   │   └── avatarController.js   # Xử lý upload avatar
│   ├── middleware/
│   │   └── auth.js               # Middleware xác thực JWT
│   ├── models/
│   │   └── User.js               # Schema User
│   ├── routes/
│   │   ├── authRoutes.js         # Routes authentication
│   │   ├── profileRoutes.js      # Routes profile
│   │   ├── userRoutes.js         # Routes user management
│   │   ├── forgotPasswordRoutes.js  # Routes forgot password
│   │   └── avatarRoutes.js       # Routes avatar upload
│   ├── uploads/                  # Thư mục lưu file tạm (trước khi upload lên Cloudinary)
│   ├── server.js                 # File chính của server
│   ├── package.json
│   └── .env                      # File cấu hình (không commit lên Git)
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── components/
│   │   │   ├── Login.jsx         # Component đăng nhập
│   │   │   ├── Register.jsx      # Component đăng ký
│   │   │   ├── Profile.jsx       # Component profile
│   │   │   ├── UserList.jsx      # Component danh sách user
│   │   │   ├── AddUser.jsx       # Component thêm user
│   │   │   ├── EditUser.jsx      # Component sửa user
│   │   │   ├── ForgotPassword.jsx  # Component quên mật khẩu
│   │   │   └── ResetPassword.jsx # Component đặt lại mật khẩu
│   │   ├── utils/
│   │   │   └── axios.js          # Cấu hình Axios
│   │   ├── App.js                # Component chính
│   │   └── index.js
│   └── package.json
└── README.md
```

## 🔒 Tính năng bảo mật

- ✅ Mật khẩu được mã hóa bằng bcrypt (10 rounds)
- ✅ JWT token với thời gian hết hạn 24h
- ✅ Middleware xác thực JWT cho các route protected
- ✅ Phân quyền RBAC (Role-Based Access Control)
- ✅ Token reset password có thời gian hết hạn (10 phút)
- ✅ Validation đầu vào trên cả backend và frontend

## 🐛 Troubleshooting

### Lỗi kết nối MongoDB

```
❌ Lỗi kết nối MongoDB: MongoServerError
```

**Giải pháp:**
- Kiểm tra `MONGO_URI` trong file `.env`
- Đảm bảo MongoDB đang chạy (nếu dùng local)
- Kiểm tra firewall và network connection (nếu dùng MongoDB Atlas)

### Lỗi JWT Secret

```
JWT_SECRET is not defined
```

**Giải pháp:**
- Đảm bảo file `.env` có biến `JWT_SECRET`
- Khởi động lại server sau khi thêm biến môi trường

### Lỗi Cloudinary

```
Error: Must supply api_key
```

**Giải pháp:**

Có 2 cách xử lý:

**Cách 1: Cấu hình Cloudinary (Khuyến nghị cho Production)**

1. Tạo tài khoản tại [https://cloudinary.com](https://cloudinary.com)
2. Lấy thông tin API từ Cloudinary Dashboard:
   - Cloud Name
   - API Key
   - API Secret
3. Thêm vào file `.env`:
```env
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```
4. Khởi động lại server

Xem hướng dẫn chi tiết tại: `backend/SETUP_CLOUDINARY.md`

**Cách 2: Sử dụng Local Storage (Development)**

Nếu không cấu hình Cloudinary, hệ thống sẽ tự động sử dụng local storage:
- File được lưu trong `uploads/avatars/`
- URL: `http://localhost:3000/uploads/avatars/filename.jpg`
- Không cần cấu hình gì thêm

### Lỗi Email (Forgot Password)

```
Error sending email
```

**Giải pháp:**
- Kiểm tra `EMAIL_USER` và `EMAIL_PASS` trong file `.env`
- Sử dụng Gmail App Password (không dùng mật khẩu thường)
- Đảm bảo đã bật "Less secure app access" hoặc sử dụng App Password

### Frontend không kết nối được với Backend

**Giải pháp:**
- Kiểm tra backend đang chạy tại port 3000
- Kiểm tra CORS đã được cấu hình trong `server.js`
- Kiểm tra `baseURL` trong `frontend/src/utils/axios.js`

## 📝 Ghi chú

- File `.env` không được commit lên Git (đã có trong `.gitignore`)
- Đảm bảo thay đổi `JWT_SECRET` trong production
- Sử dụng MongoDB Atlas cho production thay vì MongoDB local
- Cấu hình CORS phù hợp với domain frontend trong production

## 👥 Thành viên nhóm

- **Trần Ngọc Vinh** - Backend Developer & Team Leader
- **Trần Huỳnh Đăng Khôi** - Frontend Developer
- **Phạm Huỳnh Bảo Toàn** - Database Manager

## 📄 License

MIT License

## 🔗 Liên kết

- [GitHub Repository](https://github.com/your-username/group19-project)
- [Demo Video](https://youtube.com/your-video-link)

---

**Lưu ý:** Đây là dự án học tập, không sử dụng cho mục đích thương mại mà không có sự cải thiện về bảo mật.

