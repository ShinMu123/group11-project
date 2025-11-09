import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axiosInstance from '../utils/axios';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [resetToken, setResetToken] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    setError('');
    setResetToken('');
    try {
      const res = await axiosInstance.post('/forgot-password', { email });
      
      // Nếu có token trong response (development mode)
      if (res.data?.token) {
        setMessage(res.data.message || 'Token reset đã được tạo');
        setResetToken(res.data.token);
      } else {
        setMessage(res.data?.message || 'Yêu cầu đổi mật khẩu đã được gửi. Vui lòng kiểm tra email.');
      }
    } catch (err) {
      console.error('Forgot password error:', err);
      setError(err.response?.data?.message || err.response?.data?.error || 'Có lỗi xảy ra khi gửi yêu cầu');
    }
  };

  return (
    <div className="container mt-5">
      <div className="row justify-content-center">
        <div className="col-md-6">
          <div className="card shadow border-0" style={{ borderRadius: '15px' }}>
            <div className="card-body p-4">
              <h3 className="mb-4" style={{ color: '#333', fontWeight: '600' }}>
                <i className="bi bi-key me-2 text-primary"></i>
                Quên mật khẩu
              </h3>
              
              {message && (
                <div className="alert alert-success alert-dismissible fade show" role="alert">
                  {message}
                  <button type="button" className="btn-close" onClick={() => setMessage('')}></button>
                </div>
              )}
              
              {resetToken && (
                <div className="alert alert-info">
                  <strong><i className="bi bi-info-circle me-2"></i>Token reset của bạn:</strong>
                  <div className="mt-2 p-3" style={{ 
                    backgroundColor: '#f8f9fa', 
                    borderRadius: '8px',
                    border: '2px solid #007bff'
                  }}>
                    <code style={{ fontSize: '24px', fontWeight: 'bold', color: '#007bff' }}>
                      {resetToken}
                    </code>
                  </div>
                  <small className="text-muted d-block mt-2">
                    <i className="bi bi-exclamation-triangle me-1"></i>
                    Vui lòng sử dụng token này để đặt lại mật khẩu. Token sẽ hết hạn sau 10 phút.
                  </small>
                  <div className="mt-3">
                    <Link
                      to={`/reset-password?token=${resetToken}`}
                      className="btn btn-success btn-lg w-100"
                      style={{
                        borderRadius: '10px',
                        padding: '12px',
                        fontWeight: 'bold'
                      }}
                    >
                      <i className="bi bi-shield-lock me-2"></i>
                      Đến trang đặt lại mật khẩu
                    </Link>
                  </div>
                </div>
              )}
              
              {error && (
                <div className="alert alert-danger alert-dismissible fade show" role="alert">
                  <i className="bi bi-exclamation-triangle me-2"></i>
                  {error}
                  <button type="button" className="btn-close" onClick={() => setError('')}></button>
                </div>
              )}
              
              <form onSubmit={handleSubmit}>
                <div className="mb-4">
                  <label className="form-label fw-bold">
                    <i className="bi bi-envelope me-2"></i>Email
                  </label>
                  <input
                    type="email"
                    className="form-control form-control-lg"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Nhập email của bạn"
                    required
                  />
                  <small className="text-muted">Nhập email để nhận mã token đặt lại mật khẩu</small>
                </div>
                <button 
                  type="submit" 
                  className="btn btn-primary btn-lg w-100"
                  style={{
                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                    border: 'none',
                    borderRadius: '10px',
                    padding: '12px'
                  }}
                >
                  <i className="bi bi-send me-2"></i>Gửi yêu cầu
                </button>
              </form>
              
              <div className="mt-3 text-center">
                <Link to="/login" className="text-decoration-none">
                  <i className="bi bi-arrow-left me-1"></i>Quay lại đăng nhập
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
