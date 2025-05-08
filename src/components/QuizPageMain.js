import React from 'react';
import QuizBox from './QuizBox';

// Update props destructuring
const QuizPageMain = ({
  quizData,
  selectedAnswers,
  handleAnswerClick,
  handleCheckAnswers,
  quizCompleted,       
  selectedCategory,   
  quizType,            
  feedbackMessage,
  // Props for review action buttons
  score,
  totalQuestions,
  onRetryReview,
  onNewQuestionsReview,
  onChooseNewReview
}) => {

  const categoryName = selectedCategory ? selectedCategory.name : "Selected";
  const difficultyName = quizType ? quizType.charAt(0).toUpperCase() + quizType.slice(1) : "Chosen";
  const isPerfectScore = score === totalQuestions && totalQuestions > 0;

  return (
    <div>
      <h3 className="quiz-category-header">
        You are playing on{" "}
        <span className="game-status">{difficultyName}</span>{" "}
        difficulty in the{" "}
        <span className="game-status">{categoryName}</span>{" "}
        category
      </h3>

      {/* Map over quizData to render each question box */}
      {quizData.map((item, index) => (
        <QuizBox
          key={item.id} 
          id={item.id}
          questionNumber={index + 1}
          question={item.question}
          // --- MODIFIED LINE: Pass the options array directly ---
          options={item.options} 
          // --- END OF MODIFICATION ---
          selectedAnswer={selectedAnswers[item.id]}
          onAnswerClick={handleAnswerClick} 
          answer={item.answer}
          isCompleted={quizCompleted} 
        />
      ))}
      
      {/* Display validation feedback if present and quiz not completed */}
      {feedbackMessage && !quizCompleted && (
        <p style={{ color: '#ff8a8a', marginTop: '15px', marginBottom: '-30px', fontWeight: 'bold' }}>
          {feedbackMessage}
        </p>
      )}

      {/* --- Conditional Rendering: Show "Check Answers" OR post-review action buttons --- */}
      {!quizCompleted && ( // If quiz is NOT completed, show "Check Answers" button
        <div>
          <button
            onClick={handleCheckAnswers}
            className="mainButton"
          >
            Check Answers
          </button>
        </div>
      )}

      {quizCompleted && ( // If quiz IS completed (review mode), show the action buttons
        <div className="quiz-actions-on-review"> 
          <h4 className="sub-title" style={{marginTop: '40px', marginBottom: '20px'}}>Continue?</h4> 
          <div className="quiz-finish-buttons"> 

            {/* Button 1: Retry Same Questions */}
            {!isPerfectScore && (
              <button
                className="quizOverButton need-to-retry"
                onClick={onRetryReview}
              >
                Try again
              </button>
            )}

            {/* Button 2: New [Category] Questions */}
            <button
              className="quizOverButton small"
              onClick={onNewQuestionsReview}
            >
              New {categoryName} Questions 
            </button>

            {/* Button 3: New Quiz Category */}
            <button
              className="quizOverButton small"
              onClick={onChooseNewReview}
            >
              Select new quiz category
            </button>
          </div>
        </div>
      )}
      {/* --- END OF CONDITIONAL RENDERING --- */}

    </div>
  );
};

export default QuizPageMain;