import React from "react";
import he from "he"; // Library to decode HTML entities

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
                  // Keep the correct click handler logic from previous fix
                  // (It should call onAnswerClick only if !isCompleted)
                  if (!isCompleted) {
                     // console.log(`QuizBox onClick: Option="${option}", isCompleted=${isCompleted}, questionId=${id}`);
                     onAnswerClick(id, option); 
                  }
               }} 
               className={getOptionClassName(option)} 
             >
               {/* --- CONTENT MODIFICATION IS HERE --- */}
               {option} {/* Always render the option text */}
               {isCompleted && option === selectedAnswer && (
                 // Conditionally add "(Selected)" if quiz done and this option matches selected answer
                 <span className="selected-indicator"> (Selected)</span>
               )}
               {/* --- END OF CONTENT MODIFICATION --- */}
             </div>
           ))}
         </div>
       </div>
    );
  }
); 

export default QuizBox;