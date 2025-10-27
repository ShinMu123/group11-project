let users = [];

exports.getUsers = (req, res) => {
  res.json(users);
};

exports.createUser = (req, res) => {
  const newUser = { id: Date.now(), ...req.body };
  users.push(newUser);
  res.status(201).json(newUser);
};

exports.updateUser = (req, res) => {
  const { id } = req.params;
  const userIndex = users.findIndex(user => user.id == id);
  
  if (userIndex === -1) {
    return res.status(404).json({ message: 'User not found' });
  }
  
  users[userIndex] = { ...users[userIndex], ...req.body };
  res.json(users[userIndex]);
};

exports.deleteUser = (req, res) => {
  const { id } = req.params;
  users = users.filter(user => user.id != id);
  res.json({ message: 'User deleted successfully' });
};
