import React, { useState } from "react";
import axios from "axios";

function Login({ setUser }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  

const handleLogin = async () => {
  console.log("LOGIN BUTTON CLICKED"); // ✅ ADD THIS

  try {
    const res = await fetch(
      "https://flashcard-backend-4.onrender.com/api/auth/login",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username: username,
          password: password,
        }),
      }
    );

    console.log("RESPONSE STATUS:", res.status); // ✅ ADD
    const data = await res.json();
    console.log("LOGIN RESPONSE:", data); // ✅ ADD

    if (res.ok) {
      localStorage.setItem("user", JSON.stringify(data));
      window.location.href = "/flashcards";
    }
  } catch (error) {
    console.error("ERROR:", error); // ✅ ADD
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
