import React, { useState } from "react";
import axios from "axios";

function Login({ setUser }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async () => {
  try {
    const res = await axios.post(
      "https://flashcard-backend-4.onrender.com/api/auth/login",
      { username, password }
    );
    

    setUser(res.data); // 🔥 store full user object
    setIsAdmin(user.role === "admin");
  } catch {
    alert("Invalid login");
  }
};

  return (
    <div style={{ textAlign: "center", marginTop: "100px" }}>
      <h2>Login</h2>

      <input
        placeholder="Username"
        onChange={(e) => setUsername(e.target.value)}
      /><br /><br />

      <input
        type="password"
        placeholder="Password"
        onChange={(e) => setPassword(e.target.value)}
      /><br /><br />

      <button onClick={handleLogin}>Login</button>
    </div>
  );
}

export default Login;