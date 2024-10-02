import React from "react";
import { categories } from "../constants";


const QuizPageLanding = ({
  categoryId,
  setCategoryId,
  quizType,
  setQuizType,
  handleStartQuiz,
  buttonText,
  checkBtnHighlight,
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
    <button
      onClick={handleStartQuiz}
      className={`mainButton ${checkBtnHighlight ? "mainButtonclicked" : ""}`}
    >
      {buttonText}
    </button>
  </div>
);

export default QuizPageLanding;
