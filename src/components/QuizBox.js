import React from "react";
import he from "he";

const QuizBox = React.memo(
  ({
    id,
    questionNumber,
    question,
    options,
    selectedAnswer,
    onAnswerClick,
    answer,
    isCompleted,
  }) => {
    const decode = (text) => {
      const decodedText = he.decode(text);
      return text !== decodedText ? decodedText : text;
    };
    const cleanedQuestion = decode(question);
    const cleanedOptions = options.map((option) => decode(option));

    return (
      <div className="quiz-box">
        <h3 className="quiz-question-header">Question {questionNumber}</h3>
        <p className="quiz-question">{cleanedQuestion}</p>
        <div className="answer-box-options">
          {cleanedOptions.map((option, index) => (
            <div
              key={index}
              onClick={() => !isCompleted && onAnswerClick(option)}
              className={`answer-option ${
                selectedAnswer === option ? "selected" : ""
              } ${isCompleted && option === answer ? "correct" : ""} ${
                isCompleted && selectedAnswer === option && option !== answer
                  ? "incorrect"
                  : ""
              }`}
            >
              {option}
            </div>
          ))}
        </div>
      </div>
    );
  }
);

export default QuizBox;
