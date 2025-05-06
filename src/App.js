import React, { useState, useEffect, useRef, useCallback } from "react";
import "./App.css";
import Header from "./Header.js"; // Assuming Header.js is in the same directory
import QuizPageLanding from "./components/QuizPageLanding";
import QuizPageMain from "./components/QuizPageMain";
import { categories } from "./constants"; // Assuming constants.js is in the same directory
import { fetchQuizData } from "./services/quizService"; // Assuming quizService.js is in services/
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSpinner } from "@fortawesome/free-solid-svg-icons";

export default function App() {
    const [quizData, setQuizData] = useState([]);
    const [page, setPage] = useState("landing"); // 'landing' or 'main'
    const [selectedAnswers, setSelectedAnswers] = useState({});
    const [score, setScore] = useState(0);
    const [quizCompleted, setQuizCompleted] = useState(false);
    const [showResults, setShowResults] = useState(false);
    const [quizType, setQuizType] = useState(null); // 'easy', 'medium', 'hard'
    const [categoryId, setCategoryId] = useState(null); // e.g., 9, 10, etc.
    const [buttonText, setButtonText] = useState("Start the Quiz");
    const [checkBtnHighlight, setCheckBtnHighlight] = useState(false); // Seems unused? Review later.
    const [feedbackMessage, setFeedbackMessage] = useState("");

    const topRef = useRef(null);
    const bottomRef = useRef(null);

    // Scroll functions (defined before usage in other useCallback/useEffect deps)
    const scrollToTop = useCallback(() => {
      topRef.current?.scrollIntoView({ behavior: 'smooth' }); 
    }, []);

    const scrollToBottom = useCallback(() => {
      bottomRef.current?.scrollIntoView({ behavior: 'smooth', block: 'end' }); 
    }, []);

    // Derived state: Check if all questions have been answered
    const allQuestionsAnswered = quizData.length > 0 && quizData.every(
        (item) => selectedAnswers[item.id] !== undefined 
    );

    // Derived state: Find the category object based on ID
    const selectedCategory = categories.find(
        (category) => category.id === categoryId
    );

    // Memoized function to fetch quiz data
    const handleFetchQuizData = useCallback(async () => {
        if (!categoryId || !quizType) {
             setFeedbackMessage("Category and difficulty are required."); 
             setButtonText("Start the Quiz"); 
             return;
        }
        setButtonText(<>Loading... <FontAwesomeIcon icon={faSpinner} spin /></>);
        setFeedbackMessage("Fetching questions..."); 
        try {
            const data = await fetchQuizData(categoryId, quizType);
            if (data && data.length > 0) {
                setQuizData(data);
                setSelectedAnswers({}); 
                setQuizCompleted(false); 
                setShowResults(false);   
                setScore(0);             
                setPage("main");         
                setFeedbackMessage("");  
                scrollToTop();           
            } else {
                setFeedbackMessage("Could not load questions for this category/difficulty. Please try different options or try again later.");
                setPage("landing"); 
            }
        } catch (error) {
            console.error("Error fetching quiz data:", error);
            setFeedbackMessage(`Failed to fetch quiz questions. Please check your internet connection and try again. (${error.message})`);
            setPage("landing"); 
        } finally {
             setButtonText("Start the Quiz"); 
        }
    }, [quizType, categoryId, scrollToTop]); 

    // Memoized function to handle selecting an answer
    const handleAnswerClick = useCallback((questionID, selectedAnswer) => {
      // --- ADDED LOG 1: Function Entry ---
      console.log(`App handleAnswerClick: Received click for questionID="${questionID}", answer="${selectedAnswer}", quizCompleted state is ${quizCompleted}`);
      // --- END LOG 1 ---

      if (!quizCompleted) {
        // --- ADDED LOG 2: Condition Met ---
        console.log('App handleAnswerClick: Processing selection because quizCompleted is false.');
        // --- END LOG 2 ---

        // Modify the state updater slightly to add logging inside it
        setSelectedAnswers((prevAnswers) => {
          const newAnswers = {
            ...prevAnswers,
            [questionID]: selectedAnswer,
          };
          // --- ADDED LOG 3: State Update Function ---
          console.log('App handleAnswerClick: Running setSelectedAnswers. New answers object will be:', newAnswers);
          // --- END LOG 3 ---
          return newAnswers; // Return the updated state
        });

      } else {
        // --- ADDED LOG 4: Condition NOT Met ---
         console.log('App handleAnswerClick: Selection ignored because quizCompleted is true.');
        // --- END LOG 4 ---
      }
    }, [quizCompleted]); // Keep dependency array simple

    // Function to check answers
    const handleCheckAnswers = () => {
        if (allQuestionsAnswered) {
            let newScore = 0;
            quizData.forEach((item) => {
                if (selectedAnswers[item.id] === item.answer) { 
                    newScore++;
                }
            });
            setScore(newScore);
            setQuizCompleted(true); 
            setShowResults(true);   
            setFeedbackMessage(""); 
        } else {
            const answeredCount = Object.keys(selectedAnswers).length;
            const totalQuestions = quizData.length;
            // Add console logs here later if needed for the count issue
            setFeedbackMessage(
                `Please answer all ${totalQuestions} questions. You've answered ${answeredCount}.`
            );
        }
    };

    // Function to reset quiz state
    const resetQuiz = (keepSettings = false) => {
        setSelectedAnswers({});
        setScore(0);
        setQuizCompleted(false);
        setShowResults(false);
        setFeedbackMessage(""); 
        if (!keepSettings) {
            setQuizType(null);
            setCategoryId(null);
            setQuizData([]); 
            setPage('landing'); 
        }
    };

    // Function to fetch new questions for the same category/difficulty
    const restartCurrentGame = () => {
        resetQuiz(true); 
        setFeedbackMessage("Loading new questions..."); 
        handleFetchQuizData(); 
    };

    // Handler for the "Start Quiz" button click
    const handleStartQuiz = () => {
        if (quizType && categoryId) {
            setFeedbackMessage("");
            handleFetchQuizData();
        } else {
            setFeedbackMessage("Please select both a difficulty and a category to begin.");
        }
    };

    // Effect to scroll to results when they are shown
    useEffect(() => {
        if (showResults) {
            const timer = setTimeout(() => {
                scrollToBottom();
            }, 100); 
            return () => clearTimeout(timer); 
        }
    }, [showResults, scrollToBottom]); 

    // Main render logic
    return (
        <main>
            <div ref={topRef} />             
            <Header
                currentPage={page}
                onBackClick={() => { resetQuiz(false); }}
            />

            {/* Landing Page */}
            {page === "landing" && (
                <QuizPageLanding
                    categoryId={categoryId}
                    setCategoryId={setCategoryId}
                    quizType={quizType}
                    setQuizType={setQuizType}
                    handleStartQuiz={handleStartQuiz}
                    buttonText={buttonText}
                    checkBtnHighlight={checkBtnHighlight} 
                    feedbackMessage={feedbackMessage}
                />
            )}

            {/* Main Quiz Page */}
            {page === "main" && quizData.length > 0 && (
                <QuizPageMain
                    quizData={quizData}
                    selectedAnswers={selectedAnswers}
                    handleAnswerClick={handleAnswerClick}
                    handleCheckAnswers={handleCheckAnswers}
                    quizCompleted={quizCompleted}
                    showResults={showResults}
                    score={score}
                    selectedCategory={selectedCategory}
                    quizType={quizType}
                    resetQuiz={resetQuiz} 
                    restartCurrentGame={restartCurrentGame} 
                    setPage={setPage} 
                    scrollToTop={scrollToTop} 
                    scrollToBottom={scrollToBottom} 
                    feedbackMessage={feedbackMessage}
                />
            )}

            {/* Loading/Error State for Main Page */}
            {page === 'main' && quizData.length === 0 && (
                 <div style={{ marginTop: '50px', fontSize: '1.5em', color: feedbackMessage ? '#ff8a8a' : '#fff' }}>
                     {feedbackMessage ? (
                         feedbackMessage 
                     ) : (
                         <> <FontAwesomeIcon icon={faSpinner} spin /> Loading Questions... </> 
                     )}
                 </div>
             )}

            <div ref={bottomRef} style={{ height: '1px' }} /> 
        </main>
    );
}