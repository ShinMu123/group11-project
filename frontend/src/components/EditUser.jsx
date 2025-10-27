import React, { useState } from "react";
import axios from "axios";

const API_BASE = process.env.REACT_APP_API_URL || 'http://localhost:3000';

export default function EditUser({ user, onUpdate, onClose }) {
  const [name, setName] = useState(user.name);
  const [email, setEmail] = useState(user.email);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const updatedUser = { name, email };

    try {
      // Gửi PUT request đến backend để cập nhật
      await axios.put(`${API_BASE}/users/${user._id}`, updatedUser);
      
      // Gọi hàm onUpdate để refresh danh sách
      if (typeof onUpdate === 'function') onUpdate();
      
      // Đóng form edit
      if (typeof onClose === 'function') onClose();
      
      console.log(`User ${user._id} đã được cập nhật.`);
    } catch (error) {
      console.error("Lỗi khi cập nhật user:", error?.response?.status, error?.message || error);
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