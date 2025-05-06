import React, { useState, useEffect } from 'react';
import Confetti from 'react-confetti'; // Make sure you have react-confetti installed

// This component displays the final quiz results and action buttons.
// It receives all necessary data and functions as props from App.js.
function QuizResultsPage({
  score,            // The user's final score (number)
  totalQuestions,   // Total number of questions (number)
  categoryName,     // Name of the category (string)
  difficultyName,   // Formatted difficulty name (string)
  onRetry,          // Function to call for "Retry Same Questions" button
  onNewQuestions,   // Function to call for "New [Category] Questions" button
  onChooseNew       // Function to call for "Choose New Quiz" button
}) {

  // State specifically for the confetti effect on this page
  const [showConfetti, setShowConfetti] = useState(false);

  // Effect to trigger confetti when the results page mounts with a perfect score
  useEffect(() => {
    // Show confetti only if score is perfect (and totalQuestions > 0 to avoid issues)
    if (score === totalQuestions && totalQuestions > 0) {
      setShowConfetti(true);
      // Optional: You could add a timer here to turn confetti off after a few seconds
      // const timer = setTimeout(() => setShowConfetti(false), 6000); // e.g., hide after 6s
      // return () => clearTimeout(timer); // Cleanup timer
    } else {
      setShowConfetti(false); // Ensure it's off if not a perfect score
    }
  }, [score, totalQuestions]); // Re-run effect if score or totalQuestions changes

  // Determine if the score is perfect for button visibility logic
  const isPerfectScore = score === totalQuestions && totalQuestions > 0;

  return (
    <div className="quiz-finish-box"> {/* Use the existing CSS class */}
      
      {/* Conditionally render Confetti based on local state */}
      {showConfetti && (
        <Confetti
          width={window.innerWidth}
          height={window.innerHeight}
          numberOfPieces={300}
          recycle={false}
          style={{ position: 'fixed', top: 0, left: 0, zIndex: 9999 }}
        />
      )}

      <h2>Quiz Completed!</h2>
      <p className="score-reveal">
        Your final score is: {score}/{totalQuestions}
      </p>

      {/* Feedback message based on score */}
      {isPerfectScore ? (
        <p>Perfect score! Well done! 💯🎉</p>
      ) : score > totalQuestions / 2 ? (
        <p>Good job! Keep practicing!</p>
      ) : (
        <p>Try again to improve your score!</p>
      )}

      {/* Action Buttons After Quiz */}
      <div className="quiz-finish-buttons">
        
        {/* Button to retry the SAME questions */}
        {/* Show retry button only if score wasn't perfect */}
        {!isPerfectScore && ( 
          <button
            className="quizOverButton need-to-retry" 
            // Call the onRetry function passed via props
            // NO scrolling logic here
            onClick={onRetry} 
          >
            Retry Same Questions
          </button>
        )}

        {/* Button to get NEW questions for the SAME category/difficulty */}
        <button
          className="quizOverButton small"
          // Call the onNewQuestions function passed via props
          // NO scrolling logic here
          onClick={onNewQuestions} 
        >
          New <span style={{ textTransform: 'capitalize' }}>{categoryName}</span> Questions ({difficultyName})
        </button>

        {/* Button to go back to Landing page */}
        <button
          className="quizOverButton small"
          // Call the onChooseNew function passed via props
          // NO scrolling logic here
          onClick={onChooseNew} 
        >
          Choose New Quiz
        </button>
      </div>
    </div>
  );
}

export default QuizResultsPage;