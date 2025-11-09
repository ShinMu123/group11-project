import React, { useState } from "react";
import axiosInstance from '../utils/axios';

export default function AddUser({ onAdd }) {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState("");

    const handleSubmit = async (e) => {
        e.preventDefault();
        setMessage("");

        if (!name.trim()) {
            setMessage("Tên không được để trống");
            return;
        }

        if (!/\S+@\S+\.\S+/.test(email)) {
            setMessage("Email không hợp lệ");
            return;
        }

        if (!password || password.length < 6) {
            setMessage("Mật khẩu phải có ít nhất 6 ký tự");
            return;
        }

        setLoading(true);
        try {
            const response = await axiosInstance.post('/users', { 
                name: name.trim(), 
                email: email.trim(), 
                password 
            });
            
            console.log("User added successfully:", response.data);
            
            // Clear form
            setName("");
            setEmail("");
            setPassword("");
            setMessage("✅ User đã được thêm thành công!");
            
            // Gọi onAdd để refresh danh sách
            if (typeof onAdd === 'function') {
                // Đợi một chút để đảm bảo backend đã lưu xong
                setTimeout(() => {
                    onAdd();
                }, 500);
            }
            
            setTimeout(() => setMessage(""), 3000);
        } catch (error) {
            console.error("Lỗi khi thêm user:", error);
            const errorMessage = error.response?.data?.message || 
                                error.response?.data?.error || 
                                "❌ Có lỗi xảy ra khi thêm user. Vui lòng thử lại.";
            setMessage(errorMessage);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="card shadow border-0 mb-4" style={{ borderRadius: '15px' }}>
            <div className="card-header bg-white border-0" style={{ borderRadius: '15px 15px 0 0' }}>
                <h4 className="mb-0" style={{ color: '#333', fontWeight: '600' }}>
                    <i className="bi bi-person-plus-fill me-2 text-primary"></i>
                    Thêm User Mới
                </h4>
            </div>
            <div className="card-body">
                {message && (
                    <div className={`alert ${message.startsWith('✅') ? 'alert-success' : 'alert-danger'} alert-dismissible fade show`} role="alert">
                        {message}
                        <button type="button" className="btn-close" onClick={() => setMessage('')}></button>
                    </div>
                )}
                
                <form onSubmit={handleSubmit}>
                    <div className="row g-3">
                        <div className="col-md-4">
                            <label className="form-label fw-bold">
                                <i className="bi bi-person me-2"></i>Tên
                            </label>
                            <input
                                type="text"
                                className="form-control form-control-lg"
                                placeholder="Nhập tên"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                required
                            />
                        </div>
                        <div className="col-md-4">
                            <label className="form-label fw-bold">
                                <i className="bi bi-envelope me-2"></i>Email
                            </label>
                            <input
                                type="email"
                                className="form-control form-control-lg"
                                placeholder="Nhập email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                            />
                        </div>
                        <div className="col-md-4">
                            <label className="form-label fw-bold">
                                <i className="bi bi-lock me-2"></i>Mật khẩu
                            </label>
                            <input
                                type="password"
                                className="form-control form-control-lg"
                                placeholder="Nhập mật khẩu"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                                minLength={6}
                            />
                        </div>
                    </div>
                    <div className="mt-3">
                        <button
                            type="submit"
                            className="btn btn-primary btn-lg"
                            disabled={loading}
                            style={{
                                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                                border: 'none',
                                borderRadius: '10px',
                                padding: '12px 30px'
                            }}
                        >
                            {loading ? (
                                <>
                                    <span className="spinner-border spinner-border-sm me-2" role="status"></span>
                                    Đang thêm...
                                </>
                            ) : (
                                <>
                                    <i className="bi bi-plus-circle me-2"></i>Thêm User
                                </>
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}