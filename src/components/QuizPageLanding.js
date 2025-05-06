import React from "react";
import { categories } from "../constants"; // Assuming constants.js is in src/

const QuizPageLanding = ({
  categoryId,
  setCategoryId,
  quizType,
  setQuizType,
  handleStartQuiz,
  buttonText,
  checkBtnHighlight, // Prop received but usage unclear in original code
  feedbackMessage, // --- RECEIVE feedbackMessage PROP ---
}) => (
  <div>
    <div className="MegaIcon">🤯</div>
    <h1 className="MegaHeader">Welcome to Quizzmania</h1>
    <form className="quizSelectForm quiz-form">
      <h4 className="sub-title">Choose a subject</h4>
      <div className="radio-group">
        <fieldset>
          {categories.map((category) => (
            <div key={category.id} className="question">
              <input
                type="radio"
                id={`category-${category.id}`}
                name="quizCategory"
                value={category.id}
                checked={categoryId === category.id}
                // Convert value back to number for state
                onChange={(e) => setCategoryId(Number(e.target.value))} 
              />
              <label htmlFor={`category-${category.id}`}>{category.name}</label>
            </div>
          ))}
        </fieldset>
      </div>
      <h4 className="sub-title">Choose a difficulty level</h4>
      <div className="radio-group">
        <fieldset>
          {["easy", "medium", "hard"].map((difficulty) => (
            <div key={difficulty} className="question">
              <input
                type="radio"
                id={difficulty}
                name="quizType"
                value={difficulty}
                checked={quizType === difficulty}
                onChange={(e) => setQuizType(e.target.value)}
              />
              <label htmlFor={difficulty}>
                {difficulty === "easy"
                  ? "🎈 Easy"
                  : difficulty === "medium"
                  ? "💪 Medium"
                  : "💀 Hard"}
              </label>
            </div>
          ))}
        </fieldset>
      </div>
    </form>

    {/* --- CONDITIONALLY RENDER THE FEEDBACK MESSAGE --- */}
    {feedbackMessage && (
      <p style={{ color: '#ff8a8a', marginTop: '15px', marginBottom: '-30px', fontWeight: 'bold' }}> 
        {/* Adjusted margin, consider moving styling to CSS class */}
        {feedbackMessage}
      </p>
    )}
    {/* --- END OF CONDITIONAL RENDERING --- */}

    <button
      onClick={handleStartQuiz}
      // Apply visual cue if needed, checkBtnHighlight usage was unclear
      className={`mainButton ${checkBtnHighlight ? "mainButtonclicked" : ""}`} 
      // Disable button if it's currently showing "Loading..." text/icon
      disabled={typeof buttonText !== 'string' || buttonText !== "Start the Quiz"} 
    >
      {buttonText}
    </button>
  </div>
);

export default QuizPageLanding;