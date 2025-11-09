import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Route, Routes, Link, Navigate } from "react-router-dom";
import axiosInstance from "./utils/axios";
import UserList from "./components/UserList";
import AddUser from "./components/AddUser";
import Profile from "./components/Profile";
import Login from "./components/Login";
import Register from "./components/Register";
import ForgotPassword from "./components/ForgotPassword";
import ResetPassword from "./components/ResetPassword";

function App() {
  const [users, setUsers] = useState([]);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Fetch users from backend
  const fetchUsers = async () => {
    try {
      const res = await axiosInstance.get('/users');
      console.log("Fetched users:", res.data);
      // Đảm bảo res.data là array
      if (Array.isArray(res.data)) {
        setUsers(res.data);
      } else {
        console.error("Response không phải array:", res.data);
        setUsers([]);
      }
    } catch (error) {
      console.error("Lỗi khi tải danh sách user:", error?.response?.status, error?.response?.data, error?.message);
      // Nếu lỗi 401 (unauthorized), có thể token hết hạn
      if (error?.response?.status === 401) {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        setIsAuthenticated(false);
        window.dispatchEvent(new Event('authChange'));
      }
      setUsers([]);
    }
  };

  // Check authentication status and update when token changes
  useEffect(() => {
    const checkAuth = () => {
      const token = localStorage.getItem('token');
      setIsAuthenticated(!!token);
    };
    
    checkAuth();
    
    // Listen for storage changes (when login/logout happens in another tab)
    window.addEventListener('storage', checkAuth);
    
    // Custom event for same-tab login/logout
    window.addEventListener('authChange', checkAuth);
    
    return () => {
      window.removeEventListener('storage', checkAuth);
      window.removeEventListener('authChange', checkAuth);
    };
  }, []);

  const currentUser = (() => {
    try { return JSON.parse(localStorage.getItem('user')); } catch (e) { return null; }
  })();
  const isAdmin = !!(currentUser && currentUser.role === 'admin');

  // Load users when component mounts and user is authenticated
  useEffect(() => {
    if (isAuthenticated) {
      fetchUsers();
    }
  }, [isAuthenticated]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setIsAuthenticated(false);
    // Trigger auth change event để cập nhật state
    window.dispatchEvent(new Event('authChange'));
    // Route guard sẽ tự động redirect về /login khi isAuthenticated = false
  };

  return (
    <Router>
      <div style={{ minHeight: '100vh', backgroundColor: '#f8f9fa' }}>
        <nav className="navbar navbar-expand-lg navbar-dark shadow" style={{
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          padding: '15px 0'
        }}>
          <div className="container">
            <Link className="navbar-brand fw-bold" to="/" style={{ fontSize: '1.5rem' }}>
              <i className="bi bi-people-fill me-2"></i>User Management
            </Link>
            <button
              className="navbar-toggler"
              type="button"
              data-bs-toggle="collapse"
              data-bs-target="#navbarNav"
            >
              <span className="navbar-toggler-icon"></span>
            </button>
            <div className="collapse navbar-collapse" id="navbarNav">
              <div className="navbar-nav me-auto">
                {isAuthenticated && (
                  <>
                    <Link className="nav-link" to="/">
                      <i className="bi bi-house me-1"></i>Home
                    </Link>
                    <Link className="nav-link" to="/profile">
                      <i className="bi bi-person me-1"></i>Profile
                    </Link>
                    {isAdmin && (
                      <Link className="nav-link" to="/admin">
                        <i className="bi bi-shield-check me-1"></i>Admin
                      </Link>
                    )}
                  </>
                )}
              </div>
              <div className="navbar-nav">
                {!isAuthenticated ? (
                  <>
                    <Link className="nav-link" to="/login">
                      <i className="bi bi-box-arrow-in-right me-1"></i>Đăng nhập
                    </Link>
                    <Link className="nav-link" to="/register">
                      <i className="bi bi-person-plus me-1"></i>Đăng ký
                    </Link>
                  </>
                ) : (
                  <div className="d-flex align-items-center gap-3">
                    {currentUser && (
                      <span className="text-white">
                        <i className="bi bi-person-circle me-1"></i>
                        {currentUser.name}
                        {isAdmin && (
                          <span className="badge bg-danger ms-2">Admin</span>
                        )}
                      </span>
                    )}
                    <button
                      className="btn btn-outline-light"
                      onClick={handleLogout}
                      style={{ borderRadius: '8px' }}
                    >
                      <i className="bi bi-box-arrow-right me-1"></i>Đăng xuất
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </nav>
        
        <div className="container mt-4 mb-5">
          <Routes>
            <Route path="/" element={
              isAuthenticated ? (
                <div>
                  <div className="mb-4">
                    <h2 style={{ color: '#333', fontWeight: '600' }}>
                      <i className="bi bi-speedometer2 me-2 text-primary"></i>
                      Dashboard - Quản lý User
                    </h2>
                    <p className="text-muted">Quản lý danh sách người dùng trong hệ thống</p>
                  </div>
                  <AddUser onAdd={fetchUsers} />
                  <UserList users={users} onUpdate={fetchUsers} />
                </div>
              ) : (
                <Navigate to="/login" />
              )
            } />
            <Route path="/admin" element={
              isAuthenticated && isAdmin ? (
                <div>
                  <div className="mb-4">
                    <h2 style={{ color: '#333', fontWeight: '600' }}>
                      <i className="bi bi-shield-check me-2 text-danger"></i>
                      Admin Panel
                    </h2>
                    <p className="text-muted">Quản lý tất cả người dùng trong hệ thống</p>
                  </div>
                  <UserList users={users} onUpdate={fetchUsers} />
                </div>
              ) : (
                <Navigate to="/" />
              )
            } />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/reset-password" element={<ResetPassword />} />
            <Route path="/profile" element={
              isAuthenticated ? <Profile /> : <Navigate to="/login" />
            } />
            <Route path="/login" element={
              !isAuthenticated ? <Login /> : <Navigate to="/" />
            } />
            <Route path="/register" element={
              !isAuthenticated ? <Register /> : <Navigate to="/" />
            } />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;
