import React, { useEffect, useState } from "react";
import Flashcard from "./Flashcard";
import "./App.css";
import Particles from "react-tsparticles";
import Confetti from "react-confetti";
import logo from "./logo.png";

function FlashcardApp({ isAdmin }) {
  const [cards, setCards] = useState([]);
  const [index, setIndex] = useState(0);
  const [direction, setDirection] = useState("next");
  const [animating, setAnimating] = useState(false);
  const [completed, setCompleted] = useState(false);
  const [editingCard, setEditingCard] = useState(null);
  const [newQuestion, setNewQuestion] = useState("");
  const [newAnswer, setNewAnswer] = useState("");
  const [loading, setLoading] = useState(true);

  // ✅ FETCH CARDS
  const fetchCards = async () => {
    try {
      const res = await fetch("https://flashcard-backend-4.onrender.com")
      const data = await res.json();
      setCards(data);
    } catch (error) {
      console.error("Error fetching cards:", error);
    } finally {
      setLoading(false);
    }
  };

  // ✅ ADD CARD
  const addCard = async () => {
    if (!newQuestion || !newAnswer) return;

    await fetch("https://flashcard-backend-4.onrender.com", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        question: newQuestion,
        answer: newAnswer,
      }),
    });

    setNewQuestion("");
    setNewAnswer("");
    fetchCards();
  };

  // ✅ DELETE CARD
  const handleDelete = async (id) => {
    await fetch(`https://flashcard-backend-4.onrender.com${id}`, {
      method: "DELETE",
    });
    fetchCards();
  };

  // ✅ UPDATE CARD
  const updateCard = async () => {
    await fetch(`https://flashcard-backend-4.onrender.com${editingCard.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        question: newQuestion,
        answer: newAnswer,
      }),
    });

    setEditingCard(null);
    setNewQuestion("");
    setNewAnswer("");
    fetchCards();
  };

  // ✅ LOAD DATA
  useEffect(() => {
    fetchCards();
  }, []);

  const nextCard = () => {
    if (animating) return;

    if (index === cards.length - 1) {
      setCompleted(true);
      return;
    }

    setDirection("next");
    setAnimating(true);

    setTimeout(() => {
      setIndex((prev) => prev + 1);
      setAnimating(false);
    }, 250);
  };

  const prevCard = () => {
    if (animating) return;

    setDirection("prev");
    setAnimating(true);

    setTimeout(() => {
      setIndex((prev) => prev - 1);
      setAnimating(false);
    }, 250);
  };

  const goToFirst = () => setIndex(0);
  const goToLast = () => setIndex(cards.length - 1);

  // ✅ RESTART FUNCTION (FIXED)
  const restart = () => {
    setIndex(0);
    setCompleted(false);
  };

  if (loading) return <h2>Loading...</h2>;
  if (cards.length === 0) return <h2>No flashcards found</h2>;

  // ✅ COMPLETED SCREEN (FIXED)
  if (completed) {
    return (
      <div style={styles.container}>
        <Confetti />
        <h1 style={styles.title}>Flashcards</h1>

        <div style={styles.progressBar}>
          <div style={{ ...styles.progress, width: "100%" }}></div>
        </div>

        <div style={styles.card}>
          <h2 style={{ color: "white" }}>🎉 Completed!</h2>
          <button style={styles.button} onClick={restart}>
            Restart 🔁
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="app">
      <Particles
        options={{
          particles: {
            number: { value: 60 },
            size: { value: 3 },
          },
        }}
      />

      <div style={styles.header}>
  <img src={logo} alt="logo" style={styles.logo} />
  <h1>Flashcards</h1>
</div>

      <div className="progress-bar">
        <div
          className="progress-fill"
          style={{
            width: `${((index + 1) / cards.length) * 100}%`,
          }}
        ></div>
      </div>

      {/* ADMIN PANEL */}
      {isAdmin && (
  <div style={styles.adminContainer}>
    <h2 style={styles.adminTitle}>Admin Panel</h2>

    <div style={styles.adminCard}>
      <h3>Add Flashcard</h3>

      <div style={styles.row}>
        <input
          placeholder="Question"
          value={newQuestion}
          onChange={(e) => setNewQuestion(e.target.value)}
          style={styles.input}
        />

        <input
          placeholder="Answer"
          value={newAnswer}
          onChange={(e) => setNewAnswer(e.target.value)}
          style={styles.input}
        />

        <button onClick={addCard} style={styles.primaryButton}>
          + Add Card
        </button>
      </div>
    </div>
  </div>
)}

      <div className="card-container">
        <Flashcard
          key={cards[index]?.id}
          question={cards[index]?.question}
          answer={cards[index]?.answer}
        />

        {isAdmin && (
          <div style={{ marginTop: "15px" }}>
            <button
              onClick={() => {
                setEditingCard(cards[index]);
                setNewQuestion(cards[index].question);
                setNewAnswer(cards[index].answer);
              }}
            >
              Edit
            </button>

            {editingCard && <button onClick={updateCard}>Update</button>}

            <button onClick={() => handleDelete(cards[index].id)}>
              Delete
            </button>
          </div>
        )}

        <div className="buttons">
          <button onClick={goToFirst} disabled={index === 0}>
            ⏮ First
          </button>

          <button onClick={prevCard} disabled={index === 0}>
            ← Prev
          </button>

          <button onClick={nextCard}>
            {index === cards.length - 1 ? "Complete ✅" : "Next →"}
          </button>

          <button onClick={goToLast} disabled={index === cards.length - 1}>
            Last ⏭
          </button>
        </div>
      </div>
    </div>
  );
}

// ✅ STYLES (ADDED)
const styles = {
  container: {
    height: "100vh",
    background: "linear-gradient(135deg, #4b2cbf, #7a1fd1)",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
  },
  title: {
    color: "white",
    marginBottom: "10px",
  },
  progressBar: {
    width: "60%",
    height: "6px",
    background: "#ccc",
    borderRadius: "10px",
    marginBottom: "30px",
  },
  progress: {
    height: "100%",
    background: "#00e0ff",
    borderRadius: "10px",
  },
  card: {
    background: "rgba(255,255,255,0.2)",
    padding: "40px",
    borderRadius: "15px",
    textAlign: "center",
  },
  button: {
    marginTop: "20px",
    padding: "10px 20px",
    background: "black",
    color: "white",
    border: "none",
    borderRadius: "8px",
    cursor: "pointer",
  },
  adminContainer: {
  padding: "20px",
},

adminTitle: {
  color: "white",
  marginBottom: "15px",
},

adminCard: {
  background: "rgba(255,255,255,0.15)",
  padding: "20px",
  borderRadius: "12px",
  marginBottom: "15px",
  backdropFilter: "blur(10px)",
},

row: {
  display: "flex",
  gap: "10px",
  flexWrap: "wrap",
},

input: {
  padding: "10px",
  borderRadius: "8px",
  border: "none",
  outline: "none",
  minWidth: "150px",
},

primaryButton: {
  padding: "10px 15px",
  borderRadius: "8px",
  border: "none",
  background: "#00d4ff",
  color: "#000",
  cursor: "pointer",
  fontWeight: "bold",
},
header: {
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  gap: "15px",
},

logo: {
  width: "500px",
  height:"200px",
  objectFit: "contain",
},
};


export default FlashcardApp;