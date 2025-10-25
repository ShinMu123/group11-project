import React, { useState } from "react";
import UserList from "./components/UserList";
import AddUser from "./components/AddUser";

export default function App() {
  const [reload, setReload] = useState(false);

  const handleAdd = () => setReload(!reload);

  return (
    <div>
      <h1>Quản lý User</h1>
      <AddUser onAdd={handleAdd} />
      <UserList key={reload} />
    </div>
  );
}
