import React, { useEffect, useState } from "react";
import axios from "axios";
import AddUser from "./AddUser";
import EditUser from "./EditUser";

// Use an environment variable for the API base URL so we don't hardcode the frontend port.
const API_BASE = process.env.REACT_APP_API_URL || 'http://localhost:3000';

export default function UserList() {
    const [users, setUsers] = useState([]);
    // State để lưu user đang được chỉnh sửa, giúp mở form Sửa
    const [editingUser, setEditingUser] = useState(null); 

    // Hàm tải danh sách user từ backend
    const fetchUsers = async () => {
        try {
            const res = await axios.get(`${API_BASE}/users`);
            console.log("Fetched users:", res.data);
            setUsers(res.data);
        } catch (error) {
            console.error("Lỗi khi tải danh sách user:", error?.response?.status, error?.message || error);
        }
    };

    // Hàm xử lý sự kiện Xóa user
    const handleDelete = async (id) => {
        // Hỏi xác nhận trước khi xóa
        if (!window.confirm("Bạn có chắc chắn muốn xóa user này không?")) {
            return;
        }

        try {
            await axios.delete(`http://localhost:3000/users/${id}`);
            setUsers(users.filter(user => user.id !== id));
            console.log(`User ${id} đã được xóa.`);
        } catch (error) {
            console.error("Lỗi khi xóa user:", error);
        }
    };


    const handleEdit = (user) => {

        setEditingUser(user);

    };

    // Chạy fetchUsers khi component được mount
    useEffect(() => {
        fetchUsers();
    }, []);

    return (
        <div>
            <h2>Quản lý User (CRUD)</h2>
            
            {/* Component thêm user, khi thêm thành công thì gọi lại fetchUsers */}
            <AddUser onAdd={fetchUsers} /> 

            {/* Form sửa user */}
            {editingUser && (
                <EditUser 
                    user={editingUser} 
                    onUpdate={fetchUsers} 
                    onClose={() => setEditingUser(null)} 
                />
            )}

            <hr />

            <h3>Danh sách User</h3>
            {users.length === 0 ? (
                <p>Chưa có user nào.</p>
            ) : (
                <ul>
                    {users.map((u) => (
<<<<<<< HEAD
                        <li key={u._id} style={{ marginBottom: '10px', padding: '5px' }}>
                            <span style={{ fontWeight: 'bold' }}>{u.name}</span> - {u.email}
=======
                        <li key={u.id}>
                            {u.name} - {u.email}
>>>>>>> 0acabda1e13e0605d154acff126bd445bee06537
                            
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
<<<<<<< HEAD
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
=======
                                onClick={() => handleDelete(u.id)} 
                                style={{ marginLeft: '10px', color: 'red' }}>
>>>>>>> 0acabda1e13e0605d154acff126bd445bee06537
                                Xóa
                            </button>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
}