import React, { useState } from "react";
import axiosInstance from '../utils/axios';
import EditUser from "./EditUser";

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
            await axiosInstance.delete(`/users/${id}`);
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
                            
                            {/* Nút Xóa: chỉ hiện nếu là Admin hoặc là chính user đó */}
                            {(() => {
                                try {
                                    const currentUser = JSON.parse(localStorage.getItem('user'));
                                    if (currentUser && (currentUser.role === 'admin' || currentUser._id === u._id)) {
                                        return (
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
                                        );
                                    }
                                } catch (e) {
                                    // ignore parse errors
                                }
                                return null;
                            })()}
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
}