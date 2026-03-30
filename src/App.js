import React, { useEffect, useState } from "react";
import axios from "axios";
import Flashcard from "./Flashcard";
import "./App.css";
import Particles from "react-tsparticles";
import Confetti from "react-confetti";
import { useWindowSize } from "react-use";


function App() {
  const [cards, setCards] = useState([]);
  const [index, setIndex] = useState(0);
  const [direction, setDirection] = useState("next");
  const [animating, setAnimating] = useState(false);
  const [completed, setCompleted] = useState(false);

  useEffect(() => {
    axios.get("https://flashcard-backend-2-oozm.onrender.com/api/flashcards")
      .then(res => setCards(res.data))
      .catch(err => console.error(err));
      }, []);

useEffect(() => {
  const handleKey = (e) => {
    if (e.key === "ArrowRight") nextCard();
    if (e.key === "ArrowLeft") prevCard();
  };

  window.addEventListener("keydown", handleKey);
  return () => window.removeEventListener("keydown", handleKey);
}, [cards, nextCard, prevCard]);

const nextCard = () => {
  if (animating) return;

  // ✅ LAST CARD → COMPLETE
  if (index === cards.length - 1) {
    setCompleted(true);
    return;
  }

  setDirection("next");
  setAnimating(true);

  setTimeout(() => {
    setIndex((prev) => (prev + 1) % cards.length);
    setAnimating(false);
  }, 250);
};

const prevCard = () => {
  if (animating) return;

  setDirection("prev");
  setAnimating(true);

  setTimeout(() => {
    setIndex((prev) => (prev - 1 + cards.length) % cards.length);
    setAnimating(false);
  }, 250);
};
  
const goToFirst = () => {
  if (animating) return;

  setDirection("prev");
  setAnimating(true);

  setTimeout(() => {
    setIndex(0);
    setAnimating(false);
  }, 300);
};

const goToLast = () => {
  if (animating) return;

  setDirection("next");
  setAnimating(true);

  setTimeout(() => {
    setIndex(cards.length - 1);
    setAnimating(false);
  }, 300);
};

  if (cards.length === 0) return <p>Loading...</p>;


if (completed) {
  return (
    <div className="app">
      <div className="complete-screen">
        <h1>🎉 Congratulations!</h1>
        <p>You completed all flashcards 🚀</p>

         <button onClick={() => {
           setCompleted(false);
           setIndex(0);
           setDirection("next");
          setAnimating(false);
        }}>
            Restart 🔄
          </button>
      </div>
    </div>
  );
}

return (
  <div className="app">

    {completed && (
      <Confetti
        width={window.innerWidth}
        height={window.innerHeight}
      />
    )}

    <Particles
      className="particles"
      style={{
        position: "fixed",
        zIndex: 0,
        pointerEvents: "none"
      }}
      options={{
        particles: {
          number: { value: 60 },
          size: { value: 3 },
          move: { speed: 0.5 },
          opacity: { value: 0.2 },
          links: {
            enable: true,
            color: "#ffffff",
            opacity: 0.2
          }
        }
      }}
    />

    <div className="top-section">
      <h1>Flashcards</h1>

      <div className="progress-bar">
        <div
          className="progress-fill"
          style={{
            width: cards.length
              ? `${((index + 1) / cards.length) * 100}%`
              : "0%"
          }}
        ></div>
      </div>
    </div>

    <div className="card-container">

      {/* ✅ FIX: Prevent crash when data not loaded */}
      {cards.length > 0 && (
        <>
          <div className={`card-wrapper ${direction} ${animating ? "animate" : ""}`}>
            <Flashcard
              key={cards[index]?.id}
              question={cards[index]?.question}
              answer={cards[index]?.answer}
              direction={direction}
              onRate={nextCard}
            />
          </div>

          <div className="buttons">
            <button onClick={goToFirst} disabled={index === 0}>⏮ First</button>

            <button onClick={prevCard} disabled={index === 0}>← Prev</button>

            <button
              onClick={() => {
                if (index === cards.length - 1) {
                  setCompleted(true);
                } else {
                  nextCard();
                }
              }}
            >
              {index === cards.length - 1 ? "Complete ✅" : "Next →"}
            </button>

            <button
              onClick={goToLast}
              disabled={index === cards.length - 1}
            >
              Last ⏭
            </button>
          </div>
        </>
      )}

      {/* ✅ Optional loading state */}
      {cards.length === 0 && (
        <p style={{ color: "white" }}>Loading flashcards...</p>
      )}

    </div>

  </div>
);
}

export default App;