// Danh sách user mặc định
let users = [
  { id: 1, name: "Vinh", email: "vinh@gmail.com" },
  { id: 2, name: "Toan", email: "toan@gmail.com" }
];

// GET: lấy tất cả user
exports.getUsers = (req, res) => {
  res.json(users);
};

// POST: thêm user mới
exports.createUser = (req, res) => {
  const newUser = { id: Date.now(), ...req.body };
  users.push(newUser);
  res.status(201).json(newUser); // dùng status 201 theo chuẩn HTTP
};

// PUT: cập nhật user
exports.updateUser = (req, res) => {
  const { id } = req.params;
  const userIndex = users.findIndex(user => user.id == id);

  if (userIndex === -1) {
    return res.status(404).json({ message: 'User not found' });
  }

  users[userIndex] = { ...users[userIndex], ...req.body };
  res.json(users[userIndex]);
};

// DELETE: xóa user
exports.deleteUser = (req, res) => {
  const { id } = req.params;
  users = users.filter(user => user.id != id);
  res.json({ message: 'User deleted successfully' });
};
