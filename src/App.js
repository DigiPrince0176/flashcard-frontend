import React, { useEffect, useState } from "react";
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

  // ================= USERS =================
  const fetchUsers = async () => {
    const res = await fetch("https://flashcard-backend-4.onrender.com/api/users");
    const data = await res.json();
    setUsers(data);
  };

  const addUser = async () => {
    await fetch("https://flashcard-backend-4.onrender.com/api/users", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
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
  console.log("LOGIN CLICKED");

  try {
    const res = await fetch(
      "https://flashcard-backend-4.onrender.com/api/auth/login",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username: loginUsername,
          password: loginPassword,
        }),
      }
    );

    const data = await res.json();
    console.log("LOGIN RESPONSE:", data);

    if (res.ok) {
      localStorage.setItem("user", JSON.stringify(data)); // ✅ THIS FIXES YOUR ISSUE
      setIsLoggedIn(true);

      if (data.role === "admin") {
        setIsAdmin(true);
      }
    } else {
      alert("Invalid credentials");
    }
  } catch (error) {
    console.error("Login error:", error);
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
        <div style={styles.mainContainer}>
          
          {isAdmin && (
  <div style={styles.header}>
    <img src={logo} alt="logo" style={styles.topLogo} />
    <h1 style={styles.mainTitle}>Admin Panel</h1>
  </div>
)}

          {/* ===== TOP CARDS (SIDE BY SIDE) ===== */}
          <div style={styles.topSection}>

            {/* ADD USER */}
            {isAdmin && (
              <div style={styles.card}>
                <h3 style={styles.cardTitle}>Add User</h3>

                <input
                  style={styles.input}
                  placeholder="Username"
                  value={newUsername}
                  onChange={(e) => setNewUsername(e.target.value)}
                />

                <input
                  style={styles.input}
                  placeholder="Password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                />

                <select
                  style={styles.select}
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                >
                  <option value="user">User</option>
                  <option value="admin">Admin</option>
                </select>

                <button style={styles.addButton} onClick={addUser}>
                  + Add User
                </button>
              </div>
            )}

            {/* USERS LIST */}
            {isAdmin && (
              <div style={styles.card}>
                <h3 style={styles.cardTitle}>All Users</h3>

                {users.map((u) => (
                  <div key={u.id} style={styles.userItem}>
                    {u.username} ({u.role})
                    <button
                      style={styles.deleteBtn}
                      onClick={() => deleteUser(u.id)}
                    >
                      Delete
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* ===== FLASHCARDS SECTION ===== */}
          <div style={styles.flashcardSection}>
  <FlashcardApp isAdmin={isAdmin} />
</div>

        </div>
      )}
    </div>
  );
}

/* ================= STYLES ================= */

const styles = {
  mainContainer: {
    background: "#38499D",
    minHeight: "100vh",
    padding: "30px 20px",
  },

  header: {
    textAlign: "center",
    marginBottom: "30px",
  },

  topLogo: {
    width: "500px",
    marginBottom: "10px",
  },

  mainTitle: {
    color: "white",
    fontSize: "28px",
  },

  topSection: {
    display: "flex",
    justifyContent: "center",
    gap: "40px",
    flexWrap: "wrap",
    marginBottom: "40px",
  },

  card: {
    background: "rgba(255,255,255,0.15)",
    padding: "25px",
    borderRadius: "15px",
    backdropFilter: "blur(10px)",
    width: "320px",
    display: "flex",
    flexDirection: "column",
    gap: "12px",
  },

  cardTitle: {
    color: "white",
    textAlign: "center",
  },

  input: {
    padding: "10px",
    borderRadius: "8px",
    border: "none",
  },

  select: {
    padding: "10px",
    borderRadius: "8px",
    border: "none",
  },

  addButton: {
    padding: "10px",
    borderRadius: "8px",
    border: "none",
    background: "#00c2ff",
    color: "black",
    cursor: "pointer",
    fontWeight: "bold",
  },

  userItem: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    background: "rgba(255,255,255,0.1)",
    padding: "8px",
    borderRadius: "8px",
    marginBottom: "8px",
    color: "white",
  },

  deleteBtn: {
    background: "#ff3b3b",
    color: "white",
    border: "none",
    padding: "5px 10px",
    borderRadius: "6px",
    cursor: "pointer",
  },

  flashcardSection: {
    marginTop: "20px",
  },

  /* LOGIN */
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

  loginButton: {
    padding: "10px",
    borderRadius: "8px",
    border: "none",
    background: "black",
    color: "white",
    cursor: "pointer",
  },

logo: {
  width: "100%",
  maxwidth:"220px", /* controls size */
  height:"auto",  /* keeps ratio */
  display: "block",
  margin:"0 auto 15px",
  objectfit: "contain",
},

};

export default App;
