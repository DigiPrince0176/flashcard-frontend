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
    display: "block",
  }}
>

          <div
              style={{
                   display: "flex",
                   flexDirection: "column",
                   height: "100%",   // important
                  }}
              >
          <div
            style={{
                 wordWrap: "break-word",
                 overflowWrap: "break-word",
                 lineHeight: "1.6",
                 marginTop: "10px",
                 fontSize: "22px",
                 color: "white",
                flexGrow: 1   // 👈 pushes button down
                }}
         dangerouslySetInnerHTML={{ __html: answer || "" }}
          />

          <button
             onClick={() => setFlipped(false)}
               style={{
                        marginTop: "auto",   // 👈 key line
                       alignSelf: "center", // optional (center button)
                    }}
                >
                Back
              </button>
                </div>
        </div>
      </div>
    </div>
  );
};

export default Flashcard;
