import React, { useState, useEffect } from "react";
import axios from "axios";
import UserList from "./components/UserList";
import AddUser from "./components/AddUser";

// Use an environment variable for the API base URL
const API_BASE = process.env.REACT_APP_API_URL || 'http://localhost:3000';

function App() {
  const [users, setUsers] = useState([]);

  // Fetch users from backend
  const fetchUsers = async () => {
    try {
      const res = await axios.get(`${API_BASE}/users`);
      console.log("Fetched users:", res.data);
      setUsers(res.data);
    } catch (error) {
      console.error("Lỗi khi tải danh sách user:", error?.response?.status, error?.message || error);
    }
  };

  // Load users when component mounts
  useEffect(() => {
    fetchUsers();
  }, []);

  return (
    <div style={{ padding: '20px' }}>
      <h1>Quản lý User (CRUD)</h1>
      <AddUser onAdd={fetchUsers} />
      <UserList users={users} onUpdate={fetchUsers} />
    </div>
  );
}

export default App;
