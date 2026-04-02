import React, { useEffect, useState } from "react";
import axios from "axios";
import FlashcardApp from "./FlashcardApp";
import "./App.css";

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loginUsername, setLoginUsername] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [isAdmin, setIsAdmin] = useState(false);

  // 👉 Separate user form state (IMPORTANT FIX)
  const [newUsername, setNewUsername] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [role, setRole] = useState("user");

  const [users, setUsers] = useState([]);

  // Flashcards
  const [cards, setCards] = useState([]);
  const [form, setForm] = useState({ question: "", answer: "" });
  const [editingId, setEditingId] = useState(null);

  // ================= USERS =================

  const fetchUsers = async () => {
    const res = await fetch("https://flashcard-backend-4.onrender.com/api/flashcards")
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

  // ================= FLASHCARDS =================

  useEffect(() => {
    axios
      .get("https://flashcard-backend-4.onrender.com/api/flashcards")
      .then((res) => setCards(res.data))
      .catch((err) => console.error(err));
  }, []);

  const addCard = async () => {
    const res = await axios.post(
      "https://flashcard-backend-4.onrender.com/api/flashcards",
      form
    );
    setCards([...cards, res.data]);
    setForm({ question: "", answer: "" });
  };

  const deleteCard = async (id) => {
    await axios.delete(`https://flashcard-backend-4.onrender.com/api/flashcards${id}`)
    setCards(cards.filter((c) => c.id !== id));
  };

  const startEdit = (card) => {
    setForm({ question: card.question, answer: card.answer });
    setEditingId(card.id);
  };

  const updateCard = async () => {
    const res = await axios.put(
      `https://flashcard-backend-4.onrender.com/api/flashcards${editingId}`,
      form
    );
    setCards(cards.map((c) => (c.id === editingId ? res.data : c)));
    setEditingId(null);
    setForm({ question: "", answer: "" });
  };

  // ================= LOGIN =================

  const handleLogin = async () => {
  try {
    const res = await fetch("https://flashcard-backend-4.onrender.com/api/users");
    const users = await res.json();

    const foundUser = users.find(
      (u) =>
        u.username === loginUsername &&
        u.password === loginPassword
    );

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
  // ================= UI =================

  if (cards.length === 0) return <h2>Loading...</h2>;

  return (
    <div>
      {!isLoggedIn ? (
  <div style={styles.loginContainer}>
    <div style={styles.loginCard}>
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
          {/* ================= ADMIN PANEL ================= */}
          {isAdmin && (
            <div>
              <h2>Admin Panel</h2>

              {/* ADD USER */}
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

              {/* USER LIST */}
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

          {/* ================= FLASHCARDS ================= */}
          <FlashcardApp
            isAdmin={isAdmin}
            startEdit={startEdit}
            deleteCard={deleteCard}
          />
          
        </>
        
      )}
    </div>
         

  );
}

const styles = {
  loginContainer: {
    height: "100vh",
    background: "linear-gradient(135deg, #4b2cbf, #7a1fd1)",
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
    marginBottom: "10px",
  },
  input: {
    padding: "10px",
    borderRadius: "8px",
    border: "none",
    outline: "none",
  },
  loginButton: {
    padding: "10px",
    borderRadius: "8px",
    border: "none",
    background: "black",
    color: "white",
    cursor: "pointer",
    fontWeight: "bold",
  },
};

export default App;