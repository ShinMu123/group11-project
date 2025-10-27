const express = require('express');
const mongoose = require('mongoose');
const User = require('./models/User');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

// 🔗 Kết nối MongoDB Atlas
mongoose.connect('mongodb+srv://admin:12345@groupdb.fppewgj.mongodb.net/groupdb?retryWrites=true&w=majority')
.then(() => console.log('✅ Kết nối MongoDB thành công!'))
.catch(err => console.error('❌ Lỗi kết nối MongoDB:', err));

// 📥 API POST: thêm người dùng
app.post('/users', async (req, res) => {
try {
const { name, email } = req.body;
const newUser = new User({ name, email });
await newUser.save();
res.status(201).json(newUser);
} catch (error) {
res.status(500).json({ message: error.message });
}
});

// 📤 API GET: lấy danh sách người dùng
app.get('/users', async (req, res) => {
try {
const users = await User.find();
res.json(users);
} catch (error) {
res.status(500).json({ message: error.message });
}
});

// � API PUT: cập nhật người dùng
app.put('/users/:id', async (req, res) => {
try {
const { id } = req.params;
const { name, email } = req.body;
const updatedUser = await User.findByIdAndUpdate(id, { name, email }, { new: true });
if (!updatedUser) {
return res.status(404).json({ message: 'User not found' });
}
res.json(updatedUser);
} catch (error) {
res.status(500).json({ message: error.message });
}
});

// 🗑️ API DELETE: xóa người dùng
app.delete('/users/:id', async (req, res) => {
try {
const { id } = req.params;
const deletedUser = await User.findByIdAndDelete(id);
if (!deletedUser) {
return res.status(404).json({ message: 'User not found' });
}
res.json({ message: 'User deleted successfully' });
} catch (error) {
res.status(500).json({ message: error.message });
}
});

// �🚀 Khởi động server
const PORT = 3000;
app.listen(PORT, () => console.log(`Server chạy tại http://localhost:${PORT}`))