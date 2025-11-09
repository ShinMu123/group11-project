import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import axiosInstance from '../utils/axios';

const ResetPassword = () => {
  const [searchParams] = useSearchParams();
  const [token, setToken] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // Lấy token từ URL nếu có
  useEffect(() => {
    const tokenFromUrl = searchParams.get('token');
    if (tokenFromUrl) {
      setToken(tokenFromUrl.toUpperCase());
    }
  }, [searchParams]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    setError('');

    // Validation
    if (!token.trim()) {
      setError('Vui lòng nhập token');
      return;
    }

    if (!password || password.length < 6) {
      setError('Mật khẩu phải có ít nhất 6 ký tự');
      return;
    }

    if (password !== confirmPassword) {
      setError('Mật khẩu không khớp');
      return;
    }

    setLoading(true);
    try {
      const res = await axiosInstance.post('/reset-password', { token, password });
      setMessage(res.data?.message || '✅ Mật khẩu đã được đặt lại thành công!');
      
      // Redirect về login sau 2 giây
      setTimeout(() => {
        navigate('/login');
      }, 2000);
    } catch (err) {
      console.error('Reset password error:', err);
      setError(err.response?.data?.message || err.response?.data?.error || 'Có lỗi xảy ra khi đổi mật khẩu');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container-fluid min-vh-100 d-flex align-items-center justify-content-center" 
         style={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' }}>
      <div className="row justify-content-center w-100">
        <div className="col-md-6 col-lg-5">
          <div className="card shadow-lg border-0" style={{ borderRadius: '20px', backdropFilter: 'blur(10px)', background: 'rgba(255, 255, 255, 0.95)' }}>
            <div className="card-body p-5">
              <div className="text-center mb-4">
                <div style={{
                  width: '80px',
                  height: '80px',
                  borderRadius: '50%',
                  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  margin: '0 auto 20px',
                  boxShadow: '0 4px 15px rgba(0,0,0,0.2)'
                }}>
                  <i className="bi bi-shield-lock" style={{ fontSize: '2.5rem', color: 'white' }}></i>
                </div>
                <h2 className="mt-3" style={{ color: '#333', fontWeight: 'bold' }}>Đặt lại mật khẩu</h2>
                <p className="text-muted">Nhập token và mật khẩu mới của bạn</p>
              </div>

              {message && (
                <div className="alert alert-success alert-dismissible fade show" role="alert">
                  <i className="bi bi-check-circle me-2"></i>
                  {message}
                  <button type="button" className="btn-close" onClick={() => setMessage('')}></button>
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
                    <i className="bi bi-key me-2"></i>Token Reset
                  </label>
                  <div className="input-group">
                    <span className="input-group-text" style={{ backgroundColor: '#f8f9fa', borderColor: '#dee2e6' }}>
                      <i className="bi bi-key-fill"></i>
                    </span>
                    <input
                      type="text"
                      className="form-control form-control-lg"
                      value={token}
                      onChange={(e) => setToken(e.target.value.toUpperCase())}
                      placeholder="Nhập token reset"
                      required
                      style={{ borderRadius: '0 10px 10px 0' }}
                    />
                  </div>
                  <small className="text-muted">
                    <i className="bi bi-info-circle me-1"></i>
                    Token được gửi qua email hoặc hiển thị trên màn hình Forgot Password
                  </small>
                </div>

                <div className="mb-4">
                  <label className="form-label fw-bold">
                    <i className="bi bi-lock me-2"></i>Mật khẩu mới
                  </label>
                  <div className="input-group">
                    <span className="input-group-text" style={{ backgroundColor: '#f8f9fa', borderColor: '#dee2e6' }}>
                      <i className="bi bi-lock-fill"></i>
                    </span>
                    <input
                      type="password"
                      className="form-control form-control-lg"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Nhập mật khẩu mới"
                      required
                      minLength={6}
                      style={{ borderRadius: '0 10px 10px 0' }}
                    />
                  </div>
                  <small className="text-muted">Mật khẩu phải có ít nhất 6 ký tự</small>
                </div>

                <div className="mb-4">
                  <label className="form-label fw-bold">
                    <i className="bi bi-lock-fill me-2"></i>Xác nhận mật khẩu
                  </label>
                  <div className="input-group">
                    <span className="input-group-text" style={{ backgroundColor: '#f8f9fa', borderColor: '#dee2e6' }}>
                      <i className="bi bi-lock-fill"></i>
                    </span>
                    <input
                      type="password"
                      className="form-control form-control-lg"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="Nhập lại mật khẩu mới"
                      required
                      minLength={6}
                      style={{ borderRadius: '0 10px 10px 0' }}
                    />
                  </div>
                  {password && confirmPassword && password !== confirmPassword && (
                    <small className="text-danger">
                      <i className="bi bi-exclamation-triangle me-1"></i>
                      Mật khẩu không khớp
                    </small>
                  )}
                  {password && confirmPassword && password === confirmPassword && (
                    <small className="text-success">
                      <i className="bi bi-check-circle me-1"></i>
                      Mật khẩu khớp
                    </small>
                  )}
                </div>

                <button
                  type="submit"
                  className="btn btn-primary btn-lg w-100 mb-3"
                  disabled={loading}
                  style={{
                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                    border: 'none',
                    borderRadius: '10px',
                    padding: '12px',
                    fontWeight: 'bold'
                  }}
                >
                  {loading ? (
                    <>
                      <span className="spinner-border spinner-border-sm me-2" role="status"></span>
                      Đang xử lý...
                    </>
                  ) : (
                    <>
                      <i className="bi bi-check-circle me-2"></i>Đặt lại mật khẩu
                    </>
                  )}
                </button>
              </form>

              <div className="text-center mt-4">
                <Link to="/login" className="text-decoration-none" style={{ color: '#667eea', fontWeight: 'bold' }}>
                  <i className="bi bi-arrow-left me-1"></i>Quay lại đăng nhập
                </Link>
                <span className="mx-2 text-muted">|</span>
                <Link to="/forgot-password" className="text-decoration-none" style={{ color: '#667eea', fontWeight: 'bold' }}>
                  <i className="bi bi-key me-1"></i>Quên mật khẩu?
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResetPassword;
