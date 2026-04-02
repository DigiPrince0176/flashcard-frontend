import React, { useEffect, useState } from "react";
import axios from "axios";
import FlashcardApp from "./FlashcardApp";
import "./App.css";
import logo from "./logo.png";

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loginUsername, setLoginUsername] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [isAdmin, setIsAdmin] = useState(false);

  const [newUsername, setNewUsername] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [role, setRole] = useState("user");

  const [users, setUsers] = useState([]);

  // ❌ REMOVED unused states:
  // cards, form, editingId, addCard, updateCard

  // ================= USERS =================

  const fetchUsers = async () => {
    const res = await fetch("https://flashcard-backend-4.onrender.com/api/users");
    const data = await res.json();
    setUsers(data);
  };

  const addUser = async () => {
    await fetch("https://flashcard-backend-4.onrender.com/api/users", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        username: newUsername,
        password: newPassword,
        role
      })
    });

    alert("User Added ✅");
    setNewUsername("");
    setNewPassword("");
    fetchUsers();
  };

  const deleteUser = async (id) => {
    await fetch(`https://flashcard-backend-4.onrender.com/api/users/${id}`, {
      method: "DELETE"
    });
    fetchUsers();
  };

  // ================= LOGIN =================

 const handleLogin = async () => {
  try {
    console.log("Login clicked");

    const res = await fetch("https://flashcard-backend-4.onrender.com/api/users");
    const users = await res.json();

    console.log("Users:", users);

    const foundUser = users.find(
      (u) =>
        u.username === loginUsername &&
        u.password === loginPassword
    );

    console.log("Found user:", foundUser);

    if (foundUser) {
      setIsLoggedIn(true);
      setIsAdmin(foundUser.role.toLowerCase() === "admin");
    } else {
      alert("Invalid credentials");
    }
  } catch (error) {
    console.error(error);
    alert("Server error");
  }
};

  return (
    <div>
      {!isLoggedIn ? (
        <div style={styles.loginContainer}>
          <div style={styles.loginCard}>
            <img src={logo} alt="logo" style={styles.logo} />
            <h2 style={styles.loginTitle}>Welcome Back 👋</h2>

            <input
              style={styles.input}
              placeholder="Username"
              value={loginUsername}
              onChange={(e) => setLoginUsername(e.target.value)}
            />

            <input
              style={styles.input}
              type="password"
              placeholder="Password"
              value={loginPassword}
              onChange={(e) => setLoginPassword(e.target.value)}
            />

            <button style={styles.loginButton} onClick={handleLogin}>
              Login 🚀
            </button>
          </div>
        </div>
      ) : (
        <>
          {isAdmin && (
            <div>
              <h2>Admin Panel</h2>

              <h3>Add User</h3>

              <input
                placeholder="Username"
                value={newUsername}
                onChange={(e) => setNewUsername(e.target.value)}
              />

              <input
                placeholder="Password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
              />

              <select
                value={role}
                onChange={(e) => setRole(e.target.value)}
              >
                <option value="user">User</option>
                <option value="admin">Admin</option>
              </select>

              <button onClick={addUser}>Add User</button>

              <h3>All Users</h3>
              {users.map((u) => (
                <div key={u.id}>
                  {u.username} ({u.role})
                  <button onClick={() => deleteUser(u.id)}>
                    Delete
                  </button>
                </div>
              ))}
            </div>
          )}

          <FlashcardApp isAdmin={isAdmin} />
        </>
      )}
    </div>
  );
}

const styles = {
  loginContainer: {
    height: "100vh",
    background: "#38499D",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
  loginCard: {
    background: "rgba(255,255,255,0.15)",
    padding: "40px",
    borderRadius: "15px",
    backdropFilter: "blur(10px)",
    display: "flex",
    flexDirection: "column",
    gap: "15px",
    width: "300px",
    textAlign: "center",
  },
  loginTitle: {
    color: "white",
  },
  input: {
    padding: "10px",
    borderRadius: "8px",
    border: "none",
  },
  loginButton: {
    padding: "10px",
    borderRadius: "8px",
    border: "none",
    background: "black",
    color: "white",
    cursor: "pointer",
  },
  logo: {
  width: "120px",
  margin: "0 auto",
  marginBottom: "10px",
},

};


export default App;