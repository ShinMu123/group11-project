import React, { useState } from 'react';
import axiosInstance from '../utils/axios';
import { useNavigate } from 'react-router-dom';

const Register = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const navigate = useNavigate();

  const { name, email, password, confirmPassword } = formData;

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      setError('Mật khẩu không khớp');
      return;
    }

    try {
      await axiosInstance.post('/auth/register', {
        name,
        email,
        password
      });
      setSuccess('Đăng ký thành công!');
      setTimeout(() => {
        navigate('/login');
      }, 2000);
    } catch (err) {
      setError(err.response?.data?.message || 'Có lỗi xảy ra khi đăng ký');
    }
  };

  return (
    <div className="container-fluid min-vh-100 d-flex align-items-center justify-content-center" style={{
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 50%, #f093fb 100%)',
      animation: 'gradientShift 10s ease infinite'
    }}>
      <style>
        {`
          @keyframes gradientShift {
            0% { background-position: 0% 50%; }
            50% { background-position: 100% 50%; }
            100% { background-position: 0% 50%; }
          }
          .card-custom {
            border-radius: '20px';
            backdrop-filter: blur(15px);
            background: rgba(255, 255, 255, 0.95);
            box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
            transition: transform 0.3s ease, box-shadow 0.3s ease;
          }
          .card-custom:hover {
            transform: translateY(-5px);
            box-shadow: 0 30px 60px rgba(0, 0, 0, 0.15);
          }
          .input-group-custom .input-group-text {
            background-color: #f8f9fa;
            border-color: #dee2e6;
            transition: background-color 0.3s ease, border-color 0.3s ease;
          }
          .input-group-custom .form-control {
            border-radius: 0 15px 15px 0;
            border-left: none;
            transition: border-color 0.3s ease, box-shadow 0.3s ease;
          }
          .input-group-custom .form-control:focus {
            border-color: #667eea;
            box-shadow: 0 0 0 0.2rem rgba(102, 126, 234, 0.25);
          }
          .input-group-custom .form-control:focus + .input-group-text {
            border-color: #667eea;
          }
          .btn-custom {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            border: none;
            border-radius: 15px;
            color: white;
            font-weight: bold;
            padding: 12px;
            transition: transform 0.3s ease, box-shadow 0.3s ease;
          }
          .btn-custom:hover {
            transform: translateY(-2px);
            box-shadow: 0 10px 20px rgba(102, 126, 234, 0.4);
          }
          .icon-custom {
            font-size: 4rem;
            color: #667eea;
            transition: color 0.3s ease, transform 0.3s ease;
          }
          .icon-custom:hover {
            color: #764ba2;
            transform: scale(1.1);
          }
          .alert-custom {
            border-radius: 15px;
            animation: fadeIn 0.5s ease;
          }
          @keyframes fadeIn {
            from { opacity: 0; transform: translateY(-10px); }
            to { opacity: 1; transform: translateY(0); }
          }
        `}
      </style>
      <div className="row justify-content-center w-100">
        <div className="col-md-6 col-lg-4">
          <div className="card card-custom border-0">
            <div className="card-body p-5">
              <div className="text-center mb-4">
                <i className="bi bi-person-plus icon-custom"></i>
                <h2 className="mt-3" style={{ color: '#333', fontWeight: 'bold', fontSize: '2rem' }}>Đăng ký</h2>
              </div>
              {error && <div className="alert alert-danger alert-custom">{error}</div>}
              {success && <div className="alert alert-success alert-custom">{success}</div>}
              <form onSubmit={handleSubmit}>
                <div className="mb-4">
                  <label className="form-label fw-bold">Tên</label>
                  <div className="input-group input-group-custom">
                    <span className="input-group-text">
                      <i className="bi bi-person"></i>
                    </span>
                    <input
                      type="text"
                      className="form-control"
                      name="name"
                      value={name}
                      onChange={handleChange}
                      placeholder="Nhập tên của bạn"
                      required
                    />
                  </div>
                </div>
                <div className="mb-4">
                  <label className="form-label fw-bold">Email</label>
                  <div className="input-group input-group-custom">
                    <span className="input-group-text">
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
                    />
                  </div>
                </div>
                <div className="mb-4">
                  <label className="form-label fw-bold">Mật khẩu</label>
                  <div className="input-group input-group-custom">
                    <span className="input-group-text">
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
                    />
                  </div>
                </div>
                <div className="mb-4">
                  <label className="form-label fw-bold">Xác nhận mật khẩu</label>
                  <div className="input-group input-group-custom">
                    <span className="input-group-text">
                      <i className="bi bi-lock-fill"></i>
                    </span>
                    <input
                      type="password"
                      className="form-control"
                      name="confirmPassword"
                      value={confirmPassword}
                      onChange={handleChange}
                      placeholder="Xác nhận mật khẩu"
                      required
                    />
                  </div>
                </div>
                <button type="submit" className="btn btn-custom w-100 mb-3">
                  Đăng ký
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;