import React, { useState, useEffect } from "react";
import QuizBox from "./QuizBox";
import Confetti from "react-confetti";

const QuizPageMain = ({
  quizData,
  selectedAnswers,
  handleAnswerClick,
  handleCheckAnswers,
  quizCompleted,
  showResults,
  score,
  selectedCategory,
  quizType,
  resetQuiz,
  restartCurrentGame,
  setPage,
  scrollToTop,
  scrollToBottom,
}) => {
  const [showConfetti, setShowConfetti] = useState(false);
  const [localCategory, setLocalCategory] = useState(
    selectedCategory?.name || ""
  );
  const [localDifficulty, setLocalDifficulty] = useState(quizType || "");

  useEffect(() => {
    setLocalCategory(selectedCategory?.name || "");
    setLocalDifficulty(quizType || "");
  }, [selectedCategory, quizType]);

  useEffect(() => {
    if (showResults && score > 4) {
      setShowConfetti(true);
    }
  }, [showResults, score]);

  return (
    <div>
      <h3 className="quiz-category-header">
        You are now playing on{" "}
        <span className="game-status">
          {localDifficulty === "hard"
            ? "Hard"
            : localDifficulty === "medium"
            ? "Medium"
            : "Easy"}
        </span>{" "}
        difficulty in the{" "}
        <span className="game-status">{localCategory || "Unknown"}</span>{" "}
        category
      </h3>
      {quizData.map((item, index) => (
        <QuizBox
          key={item.id}
          id={item.id}
          questionNumber={index + 1}
          question={item.question}
          options={[item.option1, item.option2, item.option3, item.option4]}
          selectedAnswer={selectedAnswers[item.id]}
          onAnswerClick={(selectedAnswer) =>
            handleAnswerClick(item.id, selectedAnswer)
          }
          answer={item.answer}
          isCompleted={quizCompleted}
        />
      ))}
      <div>
        <button
          onClick={() => {
            handleCheckAnswers();
            scrollToBottom();
          }}
          className="mainButton"
          disabled={quizCompleted}
        >
          Check Answers
        </button>
      </div>
      {showResults && (
        <div className="quiz-finish-box">
          <h2>Quiz Completed!</h2>
          <p className="score-reveal">
            Your final score is: {score}/{quizData.length}
          </p>
          {score > 4 ? (
            <div>
              <p>Perfect score! 💯💯💯</p>
              {showConfetti && (
                <Confetti
                  width={window.innerWidth}
                  height={window.innerHeight}
                  numberOfPieces={500}
                  recycle={false}
                  style={{ position: "fixed", top: 0, left: 0, zIndex: 9999 }}
                />
              )}
            </div>
          ) : (
            <p>Try again to get a perfect score</p>
          )}
          <div className="quiz-finish-buttons">
            <button
              className={`quizOverButton ${
                score > 4 ? "stop-retry" : "need-to-retry"
              }`}
              onClick={() => {
                resetQuiz(true);
                scrollToTop();
              }}
            >
              Retry quiz
            </button>
            <button
              className="quizOverButton small"
              onClick={restartCurrentGame}
            >
              New {selectedCategory ? selectedCategory.name : "Quiz"} Questions
            </button>
            <button
              className="quizOverButton small"
              onClick={() => {
                setPage("landing");
                resetQuiz();
                scrollToTop();
              }}
            >
              Restart Quizzmania
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default QuizPageMain;
