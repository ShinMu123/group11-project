import React, { useEffect, useState } from 'react';
import axios from 'axios';

function App() {
  const [users, setUsers] = useState([]);
  const [form, setForm] = useState({ name: '', email: '' });

  // 🟢 Lấy danh sách user từ backend
  useEffect(() => {
    axios.get('http://localhost:3000/users')
      .then(res => setUsers(res.data))
      .catch(err => console.error('Lỗi khi tải users:', err));
  }, []);

  // 🟢 Xử lý thêm user mới
  const addUser = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post('http://localhost:3000/users', form);
      setUsers([...users, res.data]);
      setForm({ name: '', email: '' });
    } catch (err) {
      console.error('Lỗi khi thêm user:', err);
    }
  };

  return (
    <div style={{ padding: '20px' }}>
      <h1>Danh sách người dùng (MongoDB)</h1>

      <form onSubmit={addUser} style={{ marginBottom: '20px' }}>
        <input
          placeholder="Tên"
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
        />
        <input
          placeholder="Email"
          value={form.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
        />
        <button type="submit">Thêm User</button>
      </form>

      <ul>
        {users.map((u) => (
          <li key={u._id}>{u.name} - {u.email}</li>
        ))}
      </ul>
    </div>
  );
}

export default App;
