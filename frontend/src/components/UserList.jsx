import React, { useState, useEffect } from "react";
import axiosInstance from '../utils/axios';
import EditUser from "./EditUser";

export default function UserList({ users, onUpdate }) {
    const [editingUser, setEditingUser] = useState(null);
    const [deletingId, setDeletingId] = useState(null);

    // Debug: Log users prop
    useEffect(() => {
        console.log("UserList received users:", users);
        console.log("Users count:", users?.length);
        console.log("Users is array?", Array.isArray(users));
    }, [users]);

    const handleDelete = async (id) => {
        if (!window.confirm("Bạn có chắc chắn muốn xóa user này không?")) {
            return;
        }

        setDeletingId(id);
        try {
            await axiosInstance.delete(`/users/${id}`);
            if (typeof onUpdate === 'function') onUpdate();
        } catch (error) {
            console.error("Lỗi khi xóa user:", error);
            alert(error.response?.data?.message || "Có lỗi xảy ra khi xóa user. Vui lòng thử lại.");
        } finally {
            setDeletingId(null);
        }
    };

    const handleEdit = (user) => {
        setEditingUser(user);
    };

    const getCurrentUser = () => {
        try {
            return JSON.parse(localStorage.getItem('user'));
        } catch (e) {
            return null;
        }
    };

    const currentUser = getCurrentUser();
    const canDelete = (user) => {
        if (!currentUser) return false;
        const isOwner = currentUser._id === user._id || currentUser.id === user._id || currentUser.id === user.id;
        return currentUser.role === 'admin' || isOwner;
    };

    return (
        <div>
            {editingUser && (
                <div className="mb-4">
                    <EditUser 
                        user={editingUser} 
                        onUpdate={() => {
                            if (typeof onUpdate === 'function') onUpdate();
                            setEditingUser(null);
                        }} 
                        onClose={() => setEditingUser(null)} 
                    />
                </div>
            )}

            <div className="card shadow border-0" style={{ borderRadius: '15px' }}>
                <div className="card-header bg-white border-0 pb-0" style={{ borderRadius: '15px 15px 0 0' }}>
                    <h4 className="mb-0" style={{ color: '#333', fontWeight: '600' }}>
                        <i className="bi bi-people-fill me-2 text-primary"></i>
                        Danh sách User ({users?.length || 0})
                    </h4>
                </div>
                <div className="card-body">
                    {!users || users.length === 0 ? (
                        <div className="text-center py-5">
                            <i className="bi bi-inbox" style={{ fontSize: '48px', color: '#ccc' }}></i>
                            <p className="text-muted mt-3">Chưa có user nào.</p>
                        </div>
                    ) : (
                        <div className="table-responsive">
                            <table className="table table-hover align-middle">
                                <thead>
                                    <tr style={{ backgroundColor: '#f8f9fa' }}>
                                        <th style={{ borderTop: 'none' }}>Avatar</th>
                                        <th style={{ borderTop: 'none' }}>Tên</th>
                                        <th style={{ borderTop: 'none' }}>Email</th>
                                        <th style={{ borderTop: 'none' }}>Vai trò</th>
                                        <th style={{ borderTop: 'none', textAlign: 'center' }}>Thao tác</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {users.map((u) => (
                                        <tr key={u._id} style={{ transition: 'background-color 0.2s' }}>
                                            <td>
                                                {u.avatar ? (
                                                    <img
                                                        src={u.avatar}
                                                        alt={u.name}
                                                        style={{
                                                            width: '40px',
                                                            height: '40px',
                                                            borderRadius: '50%',
                                                            objectFit: 'cover'
                                                        }}
                                                    />
                                                ) : (
                                                    <div
                                                        style={{
                                                            width: '40px',
                                                            height: '40px',
                                                            borderRadius: '50%',
                                                            backgroundColor: '#e9ecef',
                                                            display: 'flex',
                                                            alignItems: 'center',
                                                            justifyContent: 'center',
                                                            color: '#6c757d'
                                                        }}
                                                    >
                                                        <i className="bi bi-person"></i>
                                                    </div>
                                                )}
                                            </td>
                                            <td>
                                                <strong>{u.name}</strong>
                                            </td>
                                            <td>{u.email}</td>
                                            <td>
                                                <span
                                                    className={`badge ${u.role === 'admin' ? 'bg-danger' : 'bg-secondary'}`}
                                                    style={{ fontSize: '0.85rem' }}
                                                >
                                                    {u.role === 'admin' ? (
                                                        <><i className="bi bi-shield-check me-1"></i>Admin</>
                                                    ) : (
                                                        <><i className="bi bi-person me-1"></i>User</>
                                                    )}
                                                </span>
                                            </td>
                                            <td>
                                                <div className="d-flex gap-2 justify-content-center">
                                                    <button
                                                        className="btn btn-sm btn-outline-primary"
                                                        onClick={() => handleEdit(u)}
                                                        style={{ borderRadius: '8px' }}
                                                    >
                                                        <i className="bi bi-pencil me-1"></i>Sửa
                                                    </button>
                                                    {canDelete(u) && (
                                                        <button
                                                            className="btn btn-sm btn-outline-danger"
                                                            onClick={() => handleDelete(u._id)}
                                                            disabled={deletingId === u._id}
                                                            style={{ borderRadius: '8px' }}
                                                        >
                                                            {deletingId === u._id ? (
                                                                <span className="spinner-border spinner-border-sm me-1" role="status"></span>
                                                            ) : (
                                                                <i className="bi bi-trash me-1"></i>
                                                            )}
                                                            Xóa
                                                        </button>
                                                    )}
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}