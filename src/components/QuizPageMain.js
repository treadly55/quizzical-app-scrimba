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
  selectedCategory, // Pass the whole category object
  quizType,         // Pass difficulty string 'easy', 'medium', 'hard'
  resetQuiz,
  restartCurrentGame,
  setPage,          // Needed for restart button
  scrollToTop,      // Needed for buttons
  // scrollToBottom, // Not directly needed here anymore
  feedbackMessage,  // --- RECEIVE feedbackMessage PROP ---
}) => {
  const [showConfetti, setShowConfetti] = useState(false);
  // Removed local state for category/difficulty, use props directly

  // Effect to trigger confetti
  useEffect(() => {
    // Show confetti only when results appear AND score is perfect
    if (showResults && score === quizData.length && quizData.length > 0) { 
      setShowConfetti(true);
      // Optional: Hide confetti after some time
      // const timer = setTimeout(() => setShowConfetti(false), 5000); // Hide after 5s
      // return () => clearTimeout(timer);
    } else {
       setShowConfetti(false); // Ensure confetti is off otherwise
    }
    // Add quizData.length to deps to handle perfect score on variable length quizzes
  }, [showResults, score, quizData.length]); 


  // Get category name safely, provide fallback
  const categoryName = selectedCategory ? selectedCategory.name : "Selected";
  // Format difficulty nicely
  const difficultyName = quizType ? quizType.charAt(0).toUpperCase() + quizType.slice(1) : "Chosen";


  return (
    <div>
       {/* Display category and difficulty from props */}
      <h3 className="quiz-category-header">
        You are playing on{" "}
        <span className="game-status">
            {difficultyName}
        </span>{" "}
        difficulty in the{" "}
        <span className="game-status">{categoryName}</span>{" "}
        category
      </h3>

      {/* Render Quiz Boxes */}
      {quizData.map((item, index) => (
        <QuizBox
          // Use item.id if it's guaranteed unique from API/service prep
          key={item.id} 
          id={item.id}
          questionNumber={index + 1}
          question={item.question}
          // Assuming options are always 4 and named consistently from service
          options={[item.option1, item.option2, item.option3, item.option4]} 
          selectedAnswer={selectedAnswers[item.id]}
          onAnswerClick={handleAnswerClick} // Pass the handler down
          answer={item.answer}
          isCompleted={quizCompleted}
        />
      ))}
      
      {/* --- CONDITIONALLY RENDER THE VALIDATION FEEDBACK MESSAGE --- */}
      {feedbackMessage && !showResults && ( // Only show before results are displayed
        <p style={{ color: '#ff8a8a', marginTop: '15px', marginBottom: '-30px', fontWeight: 'bold' }}>
          {/* Adjusted margin, consider moving styling to CSS class */}
          {feedbackMessage}
        </p>
      )}
      {/* --- END OF CONDITIONAL RENDERING --- */}

      {/* "Check Answers" Button - only shown if quiz isn't completed */}
      {!quizCompleted && (
        <div>
          <button
            onClick={handleCheckAnswers} // Call the handler passed from App
            className="mainButton"
            // disabled={quizCompleted} // Redundant check as button isn't rendered when completed
          >
            Check Answers
          </button>
        </div>
      )}


      {/* --- Results section (conditionally rendered based on showResults) --- */}
      {showResults && (
        <div className="quiz-finish-box">
          {/* Conditionally render Confetti */}
           {showConfetti && (
              <Confetti
                  width={window.innerWidth}
                  height={window.innerHeight}
                  numberOfPieces={300} // Adjust amount
                  recycle={false} // Stop after animation
                  style={{ position: 'fixed', top: 0, left: 0, zIndex: 9999 }}
                  // Optional: tweenDuration={5000} // Longer fall time
              />
          )}

          <h2>Quiz Completed!</h2>
          <p className="score-reveal">
            Your final score is: {score}/{quizData.length}
          </p>

          {/* Feedback based on score */}
          {score === quizData.length && quizData.length > 0 ? ( // Perfect score
             <p>Perfect score! Well done! 💯🎉</p>
          ) : score > quizData.length / 2 ? ( // Good score
             <p>Good job! Keep practicing!</p>
          ) : ( // Low score
              <p>Try again to improve your score!</p>
          )}

          {/* Action Buttons After Quiz */}
          <div className="quiz-finish-buttons">
            {/* Button to retry the SAME questions */}
             {/* Only show "Retry" if score wasn't perfect? Or always show? */}
            {/* Logic from CSS: .stop-retry { display: none; } -> Hides if score > 4 */}
            {/* Let's control visibility directly instead of CSS class trick */}
            {score < quizData.length && ( // Show retry only if not perfect? Adjust as needed.
               <button
                  // className={`quizOverButton ${ score > 4 ? "stop-retry" : "need-to-retry" }`} // Old class logic
                  className="quizOverButton need-to-retry" // Apply style if needed
                  onClick={() => {
                      // Reset answers/completion state but keep questions/settings
                      resetQuiz(true); 
                      scrollToTop(); 
                  }}
                >
                  Retry Same Questions
                </button>
             )}

            {/* Button to get NEW questions for the SAME category/difficulty */}
            <button
              className="quizOverButton small"
              onClick={() => {
                   restartCurrentGame(); // Fetches new questions
                   // Scroll handled within App.js fetch logic
              }}
            >
              New <span style={{textTransform: 'capitalize'}}>{categoryName}</span> Questions ({difficultyName})
            </button>

            {/* Button to go back to Landing page */}
            <button
              className="quizOverButton small"
              onClick={() => {
                 // Full reset and navigate back to landing
                 resetQuiz(false); 
                 // setPage('landing') is handled within resetQuiz(false) now
                 // scrollToTop(); // Should happen automatically if landing mounts at top
              }}
            >
              Choose New Quiz
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default QuizPageMain;