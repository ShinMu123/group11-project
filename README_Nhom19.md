#  Dự án nhóm 19 – Lớp DH22TIN05  
**Công nghệ sử dụng:** Node.js + React + MongoDB + GitHub  

---

##  Phân chia công việc nhóm

###  1. Trần Ngọc Vinh (Nhóm trưởng – Backend Developer)
**Vai trò:** Quản lý nhóm + phát triển Backend  
**Công việc phụ trách:**
- Quản lý tiến độ và phân chia công việc.  
- Cài đặt môi trường Node.js + Express.  
- Viết API Backend xử lý CRUD người dùng, sản phẩm, đơn hàng.  
- Kết nối MongoDB bằng Mongoose.  
- Test API bằng Postman.  
- Push code backend lên nhánh `backend`.  
**Đóng góp:** 100%

---

###  2. Trần Huỳnh Đăng Khôi (Frontend Developer)
**Vai trò:** Thiết kế và xây dựng giao diện ReactJS  
**Công việc phụ trách:**
- Cài đặt môi trường React (`npx create-react-app`).  
- Tạo các component giao diện (Home, UserList, AddUser, EditUser...).  
- Kết nối API từ backend bằng Axios.  
- Hiển thị dữ liệu từ MongoDB lên giao diện.  
- Push code frontend lên nhánh `frontend`.  
**Đóng góp:** 100%

---

###  3. Phạm Huỳnh Bảo Toàn (Database Manager)
**Vai trò:** Thiết kế và quản lý cơ sở dữ liệu MongoDB  
**Công việc phụ trách:**
- Thiết kế model cho các collection: `users`, `products`, `orders`.  
- Tạo schema MongoDB bằng Mongoose.  
- Kết nối và test dữ liệu trên MongoDB Atlas.  
- Quản lý file sao lưu dữ liệu.  
- Push code database lên nhánh `database`.  
**Đóng góp:** 100%

---

##  Cấu trúc nhánh GitHub nhóm

| Nhánh | Mục đích | Người phụ trách |
|-------|-----------|----------------|
| `main` | Nhánh chính chứa code ổn định | Vinh (merge cuối cùng) |
| `backend` | Code Node.js + Express | Vinh |
| `frontend` | Code ReactJS | Khôi |
| `database` | Model & dữ liệu MongoDB | Toàn |

---

##  Hướng dẫn chạy project

### 1. Backend
```bash
cd backend
npm install
npm start
