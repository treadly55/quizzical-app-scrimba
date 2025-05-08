import React, { useState, useEffect } from 'react';
import Confetti from 'react-confetti'; // Make sure you have react-confetti installed

// Removed constants for automatic looping confetti

function QuizResultsPage({
  score,            
  totalQuestions,   
  categoryName,     
  difficultyName,   
  onRetry,          
  onNewQuestions,   
  onChooseNew,
  onReviewAnswers
}) {

  // --- State for button-triggered confetti ---
  const [showCelebrateConfetti, setShowCelebrateConfetti] = useState(false);
  const [celebrateConfettiKey, setCelebrateConfettiKey] = useState(0); // To ensure a fresh burst
  // --- End of new confetti state ---

  const isPerfectScore = score === totalQuestions && totalQuestions > 0;

  const scoreFeedbackMessages = {
    0: "Oh dear! Better luck next time. Keep learning! 📚",
    1: "You got one! A good start, keep going! 👍",
    2: "Not bad! You're getting the hang of it! 😊",
    3: "Well done! Over half way there! 🎉",
    4: "Great job! So close to perfect! ✨",
    5: "Amazing! A perfect score! You're a quiz master! 🏆🥳"
  };

  // --- NEW: useEffect FOR AUTOMATIC CONFETTI ON PERFECT SCORE ---
  useEffect(() => {
    // This effect runs when the component mounts or when score/totalQuestions change
    if (isPerfectScore) {
      // If the score is perfect when this component loads, trigger confetti once automatically
      console.log("Perfect score detected on load! Triggering automatic confetti burst.");
      setShowCelebrateConfetti(true);
      setCelebrateConfettiKey(prevKey => prevKey + 1); // Use the same mechanism as the button click
    }
    // Dependencies ensure this runs if the score props change, calculating isPerfectScore correctly.
  }, [isPerfectScore, score, totalQuestions]); 
  // --- END OF NEW useEffect ---


  const currentScoreMessage = scoreFeedbackMessages[score] || "Good effort!";

  // --- Handler for the Celebrate button (remains the same) ---
  const handleCelebrateClick = () => {
    console.log("Celebrate button clicked!");
    setShowCelebrateConfetti(true); // Show confetti
    setCelebrateConfettiKey(prevKey => prevKey + 1); // Change key to ensure a fresh animation
  };
  // --- End of handler ---

  return (
    <div className="quiz-finish-box"> 
      
      {/* Confetti rendering logic remains the same, triggered by either auto or manual */}
      {showCelebrateConfetti && (
        <Confetti
          key={celebrateConfettiKey} // Use the key for re-triggering
          width={window.innerWidth}
          height={window.innerHeight}
          numberOfPieces={300}     // Adjust amount as desired
          recycle={false}          // Single burst
          onConfettiComplete={(confettiInstance) => {
            // Optional: confettiInstance.reset(); 
            setShowCelebrateConfetti(false); // Hide after animation is done
            console.log("Confetti complete, hiding.");
          }}
          style={{ position: 'fixed', top: 0, left: 0, zIndex: 9999 }}
        />
      )}

      <h2>Quiz Completed!</h2>
      <div className="score-reveal-container"> 
        <div className="score-intro-text">Your final score is:</div>
        <div className="score-result-value"> 
          {score} out of {totalQuestions}
        </div>
        <div className="score-message">
          {currentScoreMessage}
        </div>
      </div>

      {/* Action Buttons After Quiz (structure preserved) */}
      <div className="quiz-finish-buttons">
        
        {isPerfectScore ? (
          <button
            className="quizOverButton celebrate-button" 
            onClick={handleCelebrateClick}
          >
            🎉 Celebrate! 🎉
          </button>
        ) : (
          <button
            className="quizOverButton need-to-retry" 
            onClick={onRetry} 
          >
            Retry Same Questions? 
          </button>
        )}

        <button
          className="quizOverButton" 
          onClick={onReviewAnswers}  
        >
          Review My Answers
        </button>
        
        <button
          className="quizOverButton small new-cat-button" 
          onClick={onNewQuestions} 
        >
          Change questions 
        </button>

        <button
          className="quizOverButton small"
          onClick={onChooseNew} 
        >
          Start new quiz 
        </button>
      </div>
    </div>
  );
}

export default QuizResultsPage;