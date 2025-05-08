import React from "react";
import he from "he"; // Library to decode HTML entities

// --- Decode function moved outside the component ---
// This prevents the function from being recreated on every render.
const decode = (text) => {
  const decodedText = he.decode(text);
  return text !== decodedText ? decodedText : text; 
};
// --- End of moved function ---

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

    // decode function is now defined outside, no need to define it here

    const cleanedQuestion = decode(question); // Use the outer decode function
    const cleanedOptions = options.map((option) => decode(option)); // Use the outer decode function

    const getOptionClassName = (option) => {
      let baseClass = 'answer-option'; 
      if (isCompleted) {
        if (option === answer) {
          return `${baseClass} correct`; 
        } else if (option === selectedAnswer) {
          return `${baseClass} incorrect`; 
        } else {
          return `${baseClass} unselected-wrong`; 
        }
      } else {
        if (selectedAnswer === option) {
          return `${baseClass} selected`; 
        } else {
          return baseClass; 
        }
      }
    };

    return (
      <div className="quiz-box">
         <h3 className="quiz-question-header">
           Question {questionNumber}
           {isCompleted && ( 
             <span className="question-feedback-inline"> 
               {' - '} 
               {selectedAnswer !== undefined ? ( 
                 selectedAnswer === answer ? (
                   <span className="correct-feedback">✅ Correct</span> 
                 ) : (
                   <span className="incorrect-feedback">❌ Incorrect</span> 
                 )
               ) : (
                 <span className="not-answered-feedback">Not Answered</span>
               )}
             </span> 
           )} 
         </h3> 
         <p className="quiz-question">{cleanedQuestion}</p>
         <div className="answer-box-options">
           {cleanedOptions.map((option) => ( 
             <div
               key={option}               
               onClick={() => {
                 if (!isCompleted) {
                   onAnswerClick(id, option); 
                 }
               }} 
               className={getOptionClassName(option)} 
             >
               {option} 
               {isCompleted && option === selectedAnswer && (
                 <span className="selected-indicator"> (Selected)</span>
               )}
             </div>
           ))}
         </div>
       </div>
    );
  }
); 

export default QuizBox;