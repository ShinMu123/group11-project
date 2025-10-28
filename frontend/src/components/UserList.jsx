import React, { useState } from "react";
import axios from "axios";
import EditUser from "./EditUser";

// Use an environment variable for the API base URL so we don't hardcode the frontend port.
const API_BASE = process.env.REACT_APP_API_URL || 'http://localhost:3000';

export default function UserList({ users, onUpdate }) {
    // State để lưu user đang được chỉnh sửa, giúp mở form Sửa
    const [editingUser, setEditingUser] = useState(null);

    // Hàm xử lý sự kiện Xóa user
    const handleDelete = async (id) => {
        // Hỏi xác nhận trước khi xóa
        if (!window.confirm("Bạn có chắc chắn muốn xóa user này không?")) {
            return;
        }

        try {
            await axios.delete(`${API_BASE}/users/${id}`);
            console.log(`User ${id} đã được xóa.`);
            // Call parent's onUpdate to refresh the users list
            if (typeof onUpdate === 'function') onUpdate();
        } catch (error) {
            console.error("Lỗi khi xóa user:", error);
            alert("Có lỗi xảy ra khi xóa user. Vui lòng thử lại.");
        }
    };

    const handleEdit = (user) => {
        setEditingUser(user);
    };

    return (
        <div>
            {/* Form sửa user */}
            {editingUser && (
                <EditUser 
                    user={editingUser} 
                    onUpdate={onUpdate} 
                    onClose={() => setEditingUser(null)} 
                />
            )}

            <hr />

            <h3>Danh sách User</h3>
            {!users || users.length === 0 ? (
                <p>Chưa có user nào.</p>
            ) : (
                <ul>
                    {users.map((u) => (
                        <li key={u._id} style={{ marginBottom: '10px', padding: '5px' }}>
                            <span style={{ fontWeight: 'bold' }}>{u.name}</span> - {u.email}

                            
                            {/* Nút Sửa */}
                            <button 
                                onClick={() => handleEdit(u)} 
                                style={{ 
                                    marginLeft: '15px', 
                                    padding: '5px 10px',
                                    backgroundColor: '#007bff',
                                    color: 'white',
                                    border: 'none',
                                    borderRadius: '3px',
                                    cursor: 'pointer'
                                }}>
                                Sửa
                            </button>
                            
                            {/* Nút Xóa */}
                            <button 
                                onClick={() => handleDelete(u._id)} 
                                style={{ 
                                    marginLeft: '10px', 
                                    padding: '5px 10px',
                                    backgroundColor: '#dc3545',
                                    color: 'white',
                                    border: 'none',
                                    borderRadius: '3px',
                                    cursor: 'pointer'
                                }}>
                                Xóa
                            </button>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
}