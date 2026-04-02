import React, { useEffect, useState } from "react";
import axios from "axios";

function AdminPanel() {
  const [cards, setCards] = useState([]);
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [editId, setEditId] = useState(null);

  // 🔥 Fetch all cards
  const fetchCards = async () => {
    const res = await axios.get("https://flashcard-backend-4.onrender.com/api/flashcards");
    setCards(res.data);
  };

  useEffect(() => {
    fetchCards();
  }, []);

  // 🔥 Add or Update
  const handleSubmit = async () => {
    if (editId) {
      await axios.put(`https://flashcard-backend-4.onrender.com/api/flashcards${editId}`, {
        question,
        answer
      });
      setEditId(null);
    } else {
      await axios.post("https://flashcard-backend-4.onrender.com/api/flashcards", {
        question,
        answer
      });
    }

    setQuestion("");
    setAnswer("");
    fetchCards();
  };

  // 🔥 Delete
  const handleDelete = async (id) => {
    await axios.delete(`https://flashcard-backend-4.onrender.com/api/flashcards${id}`);
    fetchCards();
  };

  // 🔥 Edit
  const handleEdit = (card) => {
    setQuestion(card.question);
    setAnswer(card.answer);
    setEditId(card.id);
  };

  return (
    <div style={{ textAlign: "center" }}>
      <h2>Admin Panel</h2>

      <input
        placeholder="Question"
        value={question}
        onChange={(e) => setQuestion(e.target.value)}
      /><br /><br />

      <input
        placeholder="Answer"
        value={answer}
        onChange={(e) => setAnswer(e.target.value)}
      /><br /><br />

      <button onClick={handleSubmit}>
        {editId ? "Update" : "Add"}
      </button>

      <hr />

      {cards.map((card) => (
        <div key={card.id} style={{ margin: "10px" }}>
          <b>{card.question}</b> - {card.answer} <br />

          <button onClick={() => handleEdit(card)}>Edit</button>
          <button onClick={() => handleDelete(card.id)}>Delete</button>
        </div>
      ))}
    </div>
  );
}

export default AdminPanel;