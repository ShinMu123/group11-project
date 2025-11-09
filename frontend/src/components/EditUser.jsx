import React, { useState, useEffect } from "react";
import axiosInstance from '../utils/axios';

export default function EditUser({ user, onUpdate, onClose }) {
  const [name, setName] = useState(user?.name || "");
  const [email, setEmail] = useState(user?.email || "");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    if (user) {
      setName(user.name || "");
      setEmail(user.email || "");
    }
  }, [user]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");

    if (!user || !user._id) {
      setMessage("❌ Không tìm thấy thông tin user để cập nhật");
      return;
    }

    if (!name.trim()) {
      setMessage("❌ Tên không được để trống");
      return;
    }

    if (!/\S+@\S+\.\S+/.test(email)) {
      setMessage("❌ Email không hợp lệ");
      return;
    }

    setLoading(true);
    try {
      const response = await axiosInstance.put(`/users/${user._id}`, {
        name: name.trim(),
        email: email.trim()
      });

      if (typeof onUpdate === 'function') onUpdate();
      if (typeof onClose === 'function') onClose();
      
      setMessage("✅ User đã được cập nhật thành công!");
    } catch (error) {
      console.error("Lỗi khi cập nhật user:", error);
      setMessage(error.response?.data?.message || "❌ Có lỗi xảy ra khi cập nhật user");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="card shadow border-0" style={{ borderRadius: '15px', border: '2px solid #007bff' }}>
      <div className="card-header bg-primary text-white" style={{ borderRadius: '13px 13px 0 0' }}>
        <h5 className="mb-0">
          <i className="bi bi-pencil-square me-2"></i>
          Sửa User
        </h5>
      </div>
      <div className="card-body">
        {message && (
          <div className={`alert ${message.startsWith('✅') ? 'alert-success' : 'alert-danger'} alert-dismissible fade show`} role="alert">
            {message}
            <button type="button" className="btn-close" onClick={() => setMessage('')}></button>
          </div>
        )}
        
        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label className="form-label fw-bold">
              <i className="bi bi-person me-2"></i>Tên
            </label>
            <input
              type="text"
              className="form-control form-control-lg"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>
          <div className="mb-4">
            <label className="form-label fw-bold">
              <i className="bi bi-envelope me-2"></i>Email
            </label>
            <input
              type="email"
              className="form-control form-control-lg"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="d-flex gap-2">
            <button
              type="submit"
              className="btn btn-success btn-lg flex-fill"
              disabled={loading}
              style={{ borderRadius: '10px' }}
            >
              {loading ? (
                <>
                  <span className="spinner-border spinner-border-sm me-2" role="status"></span>
                  Đang cập nhật...
                </>
              ) : (
                <>
                  <i className="bi bi-check-circle me-2"></i>Cập nhật
                </>
              )}
            </button>
            <button
              type="button"
              className="btn btn-secondary btn-lg"
              onClick={onClose}
              style={{ borderRadius: '10px' }}
            >
              <i className="bi bi-x-circle me-2"></i>Hủy
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}