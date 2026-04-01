import React, { useState } from "react";
import axios from "axios";

function AdminPanel() {
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");

  const addFlashcard = async () => {
    try {
      await axios.post("http://localhost:8080/api/flashcards", {
        question,
        answer
      });

      alert("Flashcard added!");
      setQuestion("");
      setAnswer("");
    } catch {
      alert("Error adding flashcard");
    }
  };

  return (
    <div style={{ textAlign: "center", marginTop: "50px" }}>
      <h2>Admin Panel</h2>

      <input
        placeholder="Enter question"
        value={question}
        onChange={(e) => setQuestion(e.target.value)}
      /><br /><br />

      <input
        placeholder="Enter answer"
        value={answer}
        onChange={(e) => setAnswer(e.target.value)}
      /><br /><br />

      <button onClick={addFlashcard}>Add Flashcard</button>
    </div>
  );
}

export default AdminPanel;