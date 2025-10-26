import React, { useEffect, useState } from "react";
import axios from "axios";
import AddUser from "./AddUser";

// Use an environment variable for the API base URL so we don't hardcode the frontend port.
const API_BASE = process.env.REACT_APP_API_URL || 'http://localhost:5000';

export default function UserList() {
    const [users, setUsers] = useState([]);
    // State để lưu user đang được chỉnh sửa, giúp mở form Sửa
    const [editingUser, setEditingUser] = useState(null); 

    // Hàm tải danh sách user từ backend
    const fetchUsers = async () => {
        try {
            const res = await axios.get(`${API_BASE}/users`);
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

            await axios.delete(`${API_BASE}/users/${id}`);
            

            setUsers(users.filter((user) => user._id !== id));
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

            {/* Nếu có user đang được chỉnh sửa, hiển thị khung tạm (placeholder) */}
            {editingUser && (
                <div style={{ border: '1px solid #ccc', padding: '8px', marginTop: '8px' }}>
                    <h3>Đang sửa user</h3>
                    <p>{editingUser.name} - {editingUser.email}</p>
                    <button onClick={() => setEditingUser(null)}>Đóng</button>
                </div>
            )}

            {/* Bạn có thể đặt form sửa user ở đây, truyền editingUser và hàm đóng form */}
            {/* {editingUser && <EditUser user={editingUser} onUpdate={fetchUsers} onClose={() => setEditingUser(null)} />} */}

            <hr />

            <h3>Danh sách User</h3>
            {users.length === 0 ? (
                <p>Chưa có user nào.</p>
            ) : (
                <ul>
                    {users.map((u) => (
                        <li key={u._id}>
                            {u.name} - {u.email}
                            
                            {/* Nút Sửa, gọi handleEdit */}
                            <button 
                                onClick={() => handleEdit(u)} 
                                style={{ marginLeft: '10px' }}>
                                Sửa
                            </button>
                            
                            {/* Nút Xóa, gọi handleDelete và truyền ID của user */}
                            <button 
                                onClick={() => handleDelete(u._id)} 
                                style={{ marginLeft: '10px', color: 'red' }}>
                                Xóa
                            </button>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
}