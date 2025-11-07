import React, { useState, useEffect } from 'react';
import axiosInstance from '../utils/axios';

const Profile = () => {
  const [profile, setProfile] = useState({
    name: '',
    email: '',
    avatar: ''
  });
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const { data } = await axiosInstance.get('/profile');
      setProfile(data);
    } catch (error) {
      setMessage('Lỗi khi tải thông tin profile');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const updateData = {
        name: profile.name,
        password: password || undefined
      };

      await axiosInstance.put('/profile', updateData);
      setMessage('Cập nhật thành công!');
      setPassword('');
    } catch (error) {
      setMessage('Lỗi khi cập nhật profile');
    }
  };

  return (
    <div className="container mt-4">
      <h2>Thông tin cá nhân</h2>
      {message && (
        <div className="alert alert-info" role="alert">
          {message}
        </div>
      )}
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label className="form-label">Email:</label>
          <input
            type="email"
            className="form-control"
            value={profile.email}
            disabled
          />
        </div>
        <div className="mb-3">
          <label className="form-label">Tên:</label>
          <input
            type="text"
            className="form-control"
            value={profile.name}
            onChange={(e) => setProfile({ ...profile, name: e.target.value })}
          />
        </div>
        <div className="mb-3">
          <label className="form-label">Mật khẩu mới (để trống nếu không thay đổi):</label>
          <input
            type="password"
            className="form-control"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        <button type="submit" className="btn btn-primary">
          Cập nhật
        </button>
      </form>
    </div>
  );
};

export default Profile;