import React from 'react'; // Removed useState, useEffect
import QuizBox from './QuizBox';
// import Confetti from 'react-confetti'; // Removed Confetti import

// --- STEP 3.3: Cleaned up props ---
const QuizPageMain = ({
  quizData,
  selectedAnswers,
  handleAnswerClick,
  handleCheckAnswers, // Still needed to trigger check in App.js
  quizCompleted,      // Needed to disable answers via QuizBox
  selectedCategory,   // Needed for header display
  quizType,           // Needed for header display
  feedbackMessage     // Needed for "answer all questions" validation
}) => {

  // Removed confetti state and effect
  // Removed local state for category/difficulty - use props directly

  // Get category name safely, provide fallback
  const categoryName = selectedCategory ? selectedCategory.name : "Selected";
  // Format difficulty nicely
  const difficultyName = quizType ? quizType.charAt(0).toUpperCase() + quizType.slice(1) : "Chosen";

  return (
    <div>
      {/* Display category and difficulty from props */}
      <h3 className="quiz-category-header">
        You are playing on{" "}
        <span className="game-status">{difficultyName}</span>{" "}
        difficulty in the{" "}
        <span className="game-status">{categoryName}</span>{" "}
        category
      </h3>

      {/* Render Quiz Boxes */}
      {quizData.map((item, index) => (
        <QuizBox
          key={item.id} 
          id={item.id}
          questionNumber={index + 1}
          question={item.question}
          options={[item.option1, item.option2, item.option3, item.option4]} 
          selectedAnswer={selectedAnswers[item.id]}
          onAnswerClick={handleAnswerClick} // Pass down click handler
          answer={item.answer}
          isCompleted={quizCompleted} // Pass down completion status
        />
      ))}
      
      {/* Display validation feedback (e.g., "Please answer all questions") */}
      {/* This feedback now comes from App.js when handleCheckAnswers fails */}
      {feedbackMessage && !quizCompleted && ( // Show only if quiz not completed
        <p style={{ color: '#ff8a8a', marginTop: '15px', marginBottom: '-30px', fontWeight: 'bold' }}>
          {feedbackMessage}
        </p>
      )}

      {/* "Check Answers" Button - only shown if quiz isn't completed */}
      {!quizCompleted && (
        <div>
          <button
            onClick={handleCheckAnswers} // Call the handler passed from App
            className="mainButton"
          >
            Check Answers
          </button>
        </div>
      )}

      {/* --- RESULTS SECTION ENTIRELY REMOVED --- */}

    </div>
  );
};

export default QuizPageMain;