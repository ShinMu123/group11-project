import React, { useState, useEffect } from "react";
import axios from "axios";

const API_BASE = process.env.REACT_APP_API_URL || 'http://localhost:3000';

export default function EditUser({ user, onUpdate, onClose }) {
  const [name, setName] = useState(user?.name || "");
  const [email, setEmail] = useState(user?.email || "");

  // Update state when user prop changes
  useEffect(() => {
    if (user) {
      setName(user.name || "");
      setEmail(user.email || "");
    }
  }, [user]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Check if user exists
    if (!user || !user._id) {
      alert("Không tìm thấy thông tin user để cập nhật");
      return;
    }

    // Validation: Check if name is not empty
    if (!name.trim()) {
      alert("Name không được để trống");
      return;
    }

    // Validation: Check if email has valid format
    if (!/\S+@\S+\.\S+/.test(email)) {
      alert("Email không hợp lệ");
      return;
    }

    const updatedUser = { name: name.trim(), email: email.trim() };

    try {
      console.log('Đang cập nhật user:', user._id, 'với dữ liệu:', updatedUser);
      
      // Gửi PUT request đến backend để cập nhật
      const response = await axios.put(`${API_BASE}/users/${user._id}`, updatedUser);
      
      console.log('Phản hồi từ server:', response.data);

      // Gọi hàm onUpdate để refresh danh sách
      if (typeof onUpdate === 'function') onUpdate();
      
      // Đóng form edit
      if (typeof onClose === 'function') onClose();
      
      console.log(`User ${user._id} đã được cập nhật.`);
      alert("User đã được cập nhật thành công!");

    } catch (error) {
      console.error("Lỗi khi cập nhật user:", error);
      console.error("Error response:", error?.response?.data);
      console.error("Error status:", error?.response?.status);
      
      const errorMessage = error?.response?.data?.message || error?.message || 'Có lỗi xảy ra khi cập nhật user';
      alert(errorMessage + ". Vui lòng thử lại.");
    }
  };

  return (
    <div style={{ border: '2px solid #007bff', padding: '15px', marginTop: '10px', backgroundColor: '#f8f9fa' }}>
      <h3>Sửa User</h3>
      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: '10px' }}>
          <label>Tên:</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            style={{ marginLeft: '10px', padding: '5px' }}
          />
        </div>
        <div style={{ marginBottom: '10px' }}>
          <label>Email:</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            style={{ marginLeft: '10px', padding: '5px' }}
          />
        </div>
        <div>
          <button type="submit" style={{ marginRight: '10px', backgroundColor: '#28a745', color: 'white', padding: '8px 15px', border: 'none' }}>
            Cập nhật
          </button>
          <button type="button" onClick={onClose} style={{ backgroundColor: '#6c757d', color: 'white', padding: '8px 15px', border: 'none' }}>
            Hủy
          </button>
        </div>
      </form>
    </div>
  );
}