import React, { useState, useEffect } from "react";
import "./Flashcard.css";

const Flashcard = ({ question, answer, direction }) => {
  const [flipped, setFlipped] = useState(false);

  // 🔥 Reset flip when question changes
  useEffect(() => {
    setFlipped(false);
  }, [question]);

  return (
    <div className={`card-slide ${direction}`}>
      <div className={`card ${flipped ? "flipped" : ""}`}>
        <div className="card-inner">

          <div className="card-front">
            <p>{question}</p>
            <button onClick={() => setFlipped(true)}>
              Show Answer
            </button>
          </div>

          <div
  className="card-back"
  style={{
    maxHeight: "500px",
    overflowY: "auto",
    padding: "20px",
    display: "flex",
    alignItems: "flex-start"
  }}
>

           <p
            style={{
              wordWrap: "break-word",
             overflowWrap: "break-word",
              whiteSpace: "pre-wrap",
              lineHeight: "1.6"
             }}
            >
              {answer}
             </p>
            <button onClick={() => setFlipped(false)}>
              Back
            </button>
          </div>

        </div>
      </div>
    </div>
  );
};

export default Flashcard;