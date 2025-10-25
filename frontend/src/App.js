import React, { useState } from "react";
import AddUser from "./components/AddUser";
import UserList from "./components/UserList";

function App() {
  const [reload, setReload] = useState(false);

  const handleAdd = () => {
    setReload(!reload);
  };

  return (
    <div style={{ padding: "20px" }}>
      <h1>Quản lý User</h1>
      <AddUser onAdd={handleAdd} />
      <UserList key={reload} />
    </div>
  );
}

export default App;
