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
  const [messageType, setMessageType] = useState('info');
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState('');
  const [uploadMessage, setUploadMessage] = useState('');
  const [uploading, setUploading] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      setLoading(true);
      const { data } = await axiosInstance.get('/profile');
      if (data) {
        setProfile({
          name: data.name || '',
          email: data.email || '',
          avatar: data.avatar || ''
        });
      }
    } catch (error) {
      console.error('Error fetching profile:', error);
      setMessage('Lỗi khi tải thông tin profile');
      setMessageType('danger');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setMessage('');
      const updateData = {
        name: profile.name,
        password: password || undefined
      };

      const { data } = await axiosInstance.put('/profile', updateData);
      setMessage(data.message || 'Cập nhật thành công!');
      setMessageType('success');
      
      if (data.user) {
        setProfile({
          name: data.user.name || profile.name,
          email: data.user.email || profile.email,
          avatar: data.user.avatar || profile.avatar
        });
      } else if (data.name || data.email) {
        setProfile({
          name: data.name || profile.name,
          email: data.email || profile.email,
          avatar: data.avatar || profile.avatar
        });
      }
      setPassword('');
      
      setTimeout(() => setMessage(''), 3000);
    } catch (error) {
      setMessage(error.response?.data?.message || 'Lỗi khi cập nhật profile');
      setMessageType('danger');
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        setUploadMessage('File quá lớn! Vui lòng chọn file nhỏ hơn 5MB');
        return;
      }
      setSelectedFile(file);
      setUploadMessage('');
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
    setUploading(true);
    setUploadMessage('');

    try {
      const res = await axiosInstance.post('/upload-avatar', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });

      if (res.data.success && res.data.avatar) {
        setProfile({ ...profile, avatar: res.data.avatar });
        setUploadMessage('✅ Upload avatar thành công!');
        setSelectedFile(null);
        setPreviewUrl('');
        setTimeout(() => setUploadMessage(''), 3000);
      }
    } catch (err) {
      console.error('Upload error:', err);
      setUploadMessage('❌ ' + (err.response?.data?.message || 'Lỗi khi upload avatar'));
    } finally {
      setUploading(false);
    }
  };

  if (loading) {
    return (
      <div className="container mt-5">
        <div className="text-center">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mt-4" style={{ maxWidth: '800px' }}>
      <div className="card shadow-lg border-0" style={{ borderRadius: '20px', overflow: 'hidden' }}>
        {/* Header với gradient */}
        <div style={{
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          padding: '40px 30px',
          color: 'white',
          textAlign: 'center'
        }}>
          <div style={{ position: 'relative', display: 'inline-block' }}>
            {profile.avatar || previewUrl ? (
              <img
                src={previewUrl || profile.avatar}
                alt="Avatar"
                style={{
                  width: '120px',
                  height: '120px',
                  borderRadius: '50%',
                  border: '5px solid white',
                  objectFit: 'cover',
                  boxShadow: '0 4px 15px rgba(0,0,0,0.2)'
                }}
              />
            ) : (
              <div style={{
                width: '120px',
                height: '120px',
                borderRadius: '50%',
                border: '5px solid white',
                background: 'rgba(255,255,255,0.2)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '48px',
                boxShadow: '0 4px 15px rgba(0,0,0,0.2)'
              }}>
                <i className="bi bi-person-fill"></i>
              </div>
            )}
          </div>
          <h2 className="mt-3 mb-0" style={{ fontWeight: 'bold' }}>{profile.name || 'User'}</h2>
          <p className="mb-0" style={{ opacity: 0.9 }}>{profile.email}</p>
        </div>

        <div className="card-body p-4">
          {message && (
            <div className={`alert alert-${messageType} alert-dismissible fade show`} role="alert">
              {message}
              <button type="button" className="btn-close" onClick={() => setMessage('')}></button>
            </div>
          )}

          {/* Form cập nhật thông tin */}
          <h4 className="mb-4" style={{ color: '#333', fontWeight: '600' }}>
            <i className="bi bi-person-gear me-2"></i>Cập nhật thông tin
          </h4>
          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <label className="form-label fw-bold">
                <i className="bi bi-envelope me-2"></i>Email
              </label>
              <input
                type="email"
                className="form-control form-control-lg"
                value={profile.email}
                disabled
                style={{ backgroundColor: '#f8f9fa' }}
              />
            </div>
            <div className="mb-3">
              <label className="form-label fw-bold">
                <i className="bi bi-person me-2"></i>Tên
              </label>
              <input
                type="text"
                className="form-control form-control-lg"
                value={profile.name}
                onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                placeholder="Nhập tên của bạn"
              />
            </div>
            <div className="mb-4">
              <label className="form-label fw-bold">
                <i className="bi bi-lock me-2"></i>Mật khẩu mới
              </label>
              <input
                type="password"
                className="form-control form-control-lg"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Để trống nếu không thay đổi"
              />
              <small className="text-muted">Để trống nếu không muốn thay đổi mật khẩu</small>
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
              <i className="bi bi-check-circle me-2"></i>Cập nhật thông tin
            </button>
          </form>

          <hr className="my-5" />

          {/* Upload Avatar */}
          <h4 className="mb-4" style={{ color: '#333', fontWeight: '600' }}>
            <i className="bi bi-image me-2"></i>Upload Avatar
          </h4>
          {uploadMessage && (
            <div className={`alert ${uploadMessage.startsWith('✅') ? 'alert-success' : 'alert-danger'}`} role="alert">
              {uploadMessage}
            </div>
          )}
          
          <div className="mb-3">
            <label className="form-label fw-bold">Chọn ảnh đại diện</label>
            <input
              type="file"
              className="form-control form-control-lg"
              accept="image/*"
              onChange={handleFileChange}
              disabled={uploading}
            />
            <small className="text-muted">Chọn file ảnh (tối đa 5MB)</small>
          </div>

          {previewUrl && (
            <div className="mb-3 text-center">
              <img
                src={previewUrl}
                alt="Preview"
                style={{
                  maxWidth: '200px',
                  maxHeight: '200px',
                  borderRadius: '10px',
                  border: '2px solid #dee2e6',
                  padding: '5px'
                }}
              />
            </div>
          )}

          <button
            className="btn btn-secondary btn-lg w-100"
            onClick={handleUpload}
            disabled={!selectedFile || uploading}
            style={{
              borderRadius: '10px',
              padding: '12px'
            }}
          >
            {uploading ? (
              <>
                <span className="spinner-border spinner-border-sm me-2" role="status"></span>
                Đang upload...
              </>
            ) : (
              <>
                <i className="bi bi-upload me-2"></i>Upload Avatar
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Profile;
