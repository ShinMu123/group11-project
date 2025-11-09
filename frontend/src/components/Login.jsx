import React, { useState } from 'react';
import axiosInstance from '../utils/axios';
import { useNavigate, Link } from 'react-router-dom';

const Login = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const { email, password } = formData;

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axiosInstance.post('/auth/login', {
        email,
        password
      });

      // Lưu token vào localStorage
      localStorage.setItem('token', res.data.token);
      
      // Lưu thông tin user nếu cần
      localStorage.setItem('user', JSON.stringify(res.data.user));

      // Trigger auth change event để cập nhật state
      window.dispatchEvent(new Event('authChange'));

      // Redirect về trang chủ
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.message || 'Email hoặc mật khẩu không đúng');
    }
  };

  return (
    <div className="container-fluid min-vh-100 d-flex align-items-center justify-content-center" style={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' }}>
      <div className="row justify-content-center w-100">
        <div className="col-md-6 col-lg-4">
          <div className="card shadow-lg border-0" style={{ borderRadius: '15px', backdropFilter: 'blur(10px)', background: 'rgba(255, 255, 255, 0.9)' }}>
            <div className="card-body p-5">
              <div className="text-center mb-4">
                <i className="bi bi-person-circle" style={{ fontSize: '4rem', color: '#667eea' }}></i>
                <h2 className="mt-3" style={{ color: '#333', fontWeight: 'bold' }}>Đăng nhập</h2>
              </div>
              {error && <div className="alert alert-danger" style={{ borderRadius: '10px' }}>{error}</div>}
              <form onSubmit={handleSubmit}>
                <div className="mb-4">
                  <label className="form-label fw-bold">Email</label>
                  <div className="input-group">
                    <span className="input-group-text" style={{ backgroundColor: '#f8f9fa', borderColor: '#dee2e6' }}>
                      <i className="bi bi-envelope"></i>
                    </span>
                    <input
                      type="email"
                      className="form-control"
                      name="email"
                      value={email}
                      onChange={handleChange}
                      placeholder="Nhập email của bạn"
                      required
                      style={{ borderRadius: '0 10px 10px 0' }}
                    />
                  </div>
                </div>
                <div className="mb-4">
                  <label className="form-label fw-bold">Mật khẩu</label>
                  <div className="input-group">
                    <span className="input-group-text" style={{ backgroundColor: '#f8f9fa', borderColor: '#dee2e6' }}>
                      <i className="bi bi-lock"></i>
                    </span>
                    <input
                      type="password"
                      className="form-control"
                      name="password"
                      value={password}
                      onChange={handleChange}
                      placeholder="Nhập mật khẩu"
                      required
                      style={{ borderRadius: '0 10px 10px 0' }}
                    />
                  </div>
                </div>
                <button type="submit" className="btn w-100 mb-3" style={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', border: 'none', borderRadius: '10px', color: 'white', fontWeight: 'bold', padding: '12px' }}>
                  Đăng nhập
                </button>
              </form>
              <div className="text-center">
                <Link to="/forgot-password" className="text-decoration-none" style={{ color: '#667eea', fontWeight: 'bold' }}>
                  Quên mật khẩu?
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;