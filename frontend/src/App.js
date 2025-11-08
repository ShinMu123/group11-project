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
      setUsers(res.data);
    } catch (error) {
      console.error("Lỗi khi tải danh sách user:", error?.response?.status, error?.message || error);
    }
  };

  // Check authentication status
  useEffect(() => {
    const token = localStorage.getItem('token');
    setIsAuthenticated(!!token);
  }, []);

  const currentUser = (() => {
    try { return JSON.parse(localStorage.getItem('user')); } catch (e) { return null; }
  })();
  const isAdmin = !!(currentUser && currentUser.role === 'admin');

  // Load users when component mounts
  useEffect(() => {
    fetchUsers();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setIsAuthenticated(false);
    window.location.reload();
  };

  return (
    <Router>
      <div>
        <nav className="navbar navbar-expand-lg navbar-light bg-light">
          <div className="container">
            <Link className="navbar-brand" to="/">User Management</Link>
            <div className="navbar-nav me-auto">
              <Link className="nav-link" to="/">Home</Link>
              {isAuthenticated && (
                <Link className="nav-link" to="/profile">Profile</Link>
              )}
              {isAuthenticated && isAdmin && (
                <Link className="nav-link" to="/admin">Admin</Link>
              )}
            </div>
            <div className="navbar-nav">
              {!isAuthenticated ? (
                <>
                  <Link className="nav-link" to="/login">Đăng nhập</Link>
                  <Link className="nav-link" to="/register">Đăng ký</Link>
                </>
              ) : (
                <button 
                  className="btn btn-outline-danger" 
                  onClick={handleLogout}
                >
                  Đăng xuất
                </button>
              )}
            </div>
          </div>
        </nav>
        
        <div style={{ padding: '20px' }}>
          <Routes>
            <Route path="/" element={
              isAuthenticated ? (
                <>
                  <h1>Quản lý User (CRUD)</h1>
                  <AddUser onAdd={fetchUsers} />
                  <UserList users={users} onUpdate={fetchUsers} />
                </>
              ) : (
                <Navigate to="/login" />
              )
            } />
            {/* Admin-only user list */}
            <Route path="/admin" element={
              isAuthenticated && isAdmin ? (
                <>
                  <h1>Admin - Danh sách user</h1>
                  <UserList users={users} onUpdate={fetchUsers} />
                </>
              ) : (
                <Navigate to="/" />
              )
            } />
            {/* Forgot / Reset password */}
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
