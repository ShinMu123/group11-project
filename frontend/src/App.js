import React, { useState } from "react";
import AddUser from "./components/AddUser";
import UserList from "./components/UserList";

function App() {
  const [reload, setReload] = useState(false);

  const handleAdd = () => {
    setReload(!reload);
  };

  return ;
}

export default App;
