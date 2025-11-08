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
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState('');
  const [uploadMessage, setUploadMessage] = useState('');

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

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewUrl(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!selectedFile) {
      setUploadMessage('Vui lòng chọn ảnh trước khi upload');
      return;
    }

    const formData = new FormData();
    formData.append('avatar', selectedFile);

    try {
      const res = await axiosInstance.post('/upload-avatar', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });

      // Try to update displayed avatar
      const newAvatar = res.data?.avatar || res.data?.url;
      if (newAvatar) {
        setProfile({ ...profile, avatar: newAvatar });
        setUploadMessage('Upload avatar thành công');
      } else {
        setUploadMessage('Upload thành công');
      }
      setSelectedFile(null);
      setPreviewUrl('');
    } catch (err) {
      setUploadMessage('Lỗi khi upload avatar');
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

      <hr />

      <h4>Upload Avatar</h4>
      {uploadMessage && (
        <div className="alert alert-info" role="alert">{uploadMessage}</div>
      )}
      <div className="mb-3">
        <input type="file" accept="image/*" onChange={handleFileChange} />
      </div>
      {previewUrl && (
        <div style={{ marginBottom: '10px' }}>
          <img src={previewUrl} alt="preview" style={{ maxWidth: '200px' }} />
        </div>
      )}
      {profile.avatar && !previewUrl && (
        <div style={{ marginBottom: '10px' }}>
          <img src={profile.avatar} alt="avatar" style={{ maxWidth: '200px' }} />
        </div>
      )}
      <button className="btn btn-secondary" onClick={handleUpload}>Upload avatar</button>
    </div>
  );
};

export default Profile;