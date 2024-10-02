import React, { useState, useEffect, useRef, useCallback } from "react";
import "./App.css";
import Header from "./Header.js";
import QuizPageLanding from "./components/QuizPageLanding";
import QuizPageMain from "./components/QuizPageMain";
import { categories } from "./constants";
import { fetchQuizData } from "./services/quizService";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSpinner } from "@fortawesome/free-solid-svg-icons";

export default function App() {
  const [quizData, setQuizData] = useState([]);
  const [page, setPage] = useState("landing");
  const [selectedAnswers, setSelectedAnswers] = useState({});
  const [score, setScore] = useState(0);
  const [quizCompleted, setQuizCompleted] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [quizType, setQuizType] = useState(null);
  const [categoryId, setCategoryId] = useState(null);
  const [buttonText, setButtonText] = useState("Start the Quiz");
  const [checkBtnHighlight, setCheckBtnHighlight] = useState(false);
  const topRef = useRef(null);
  const bottomRef = useRef(null);
  const scoreCalculatedRef = useRef(false);
  const allQuestionsAnswered = quizData.every(
    (item) => selectedAnswers[item.id]
  );
  const selectedCategory = categories.find(
    (category) => category.id === categoryId
  );

  const handleFetchQuizData = useCallback(async () => {
    try {
      const data = await fetchQuizData(categoryId, quizType);

      setQuizData(data);
    } catch (error) {
      console.error("Error fetching quiz data:", error);
      // Handle error (e.g., show error message to user)
    }
  }, [quizType, categoryId]);

  const handleAnswerClick = useCallback((questionID, selectedAnswer) => {
    setSelectedAnswers((prevAnswers) => ({
      ...prevAnswers,
      [questionID]: selectedAnswer,
    }));
  }, []);

  const handleCheckAnswers = () => {
    if (allQuestionsAnswered) {
      calculateScore();
      setQuizCompleted(true);
      setShowResults(true);
      scrollToBottom();
    } else {
      const answeredCount = Object.keys(selectedAnswers).length;
      alert(
        `Please answer all questions. You've answered ${answeredCount} out of ${quizData.length} questions.`
      );
    }
  };

  const startQuiz = () => {
    if (quizType && categoryId) {
      setTimeout(() => {
        setPage("main");
        scrollToTop();
      }, 1000);
      handleFetchQuizData();
    } else {
      alert("Please select a difficulty and category to begin");
    }
  };

  const resetQuiz = (keepSettings = false) => {
    setSelectedAnswers({});
    setScore(0);
    setQuizCompleted(false);
    setShowResults(false);
    scoreCalculatedRef.current = false;
    setCheckBtnHighlight(false);
    if (!keepSettings) {
      setQuizType(null);
      setCategoryId(null);
    }
  };

  const restartCurrentGame = () => {
    resetQuiz(true);
    handleFetchQuizData();
    scrollToTop();
  };

  const handleStartQuiz = () => {
    setButtonText(
      <>
        Loading... <FontAwesomeIcon icon={faSpinner} spin />
      </>
    );
    setTimeout(() => {
      setButtonText("Start the Quiz");
    }, 1200);
    startQuiz();
  };

  const calculateScore = useCallback(() => {
    if (scoreCalculatedRef.current) return;
    let newScore = 0;
    quizData.forEach((item) => {
      if (selectedAnswers[item.id] === item.answer) {
        newScore++;
      }
    });
    setScore(newScore);
    scoreCalculatedRef.current = true;
  }, [quizData, selectedAnswers]);

  const scrollToTop = useCallback(() => {
    topRef.current?.scrollIntoView();
  }, []);

  const scrollToBottom = useCallback(() => {
    bottomRef.current?.scrollIntoView();
  }, []);

  useEffect(() => {
    if (showResults) {
      scrollToBottom();
    }
  }, [showResults, scrollToBottom]);

  return (
    <main>
      <div ref={topRef} />
      <Header
        currentPage={page}
        onBackClick={() => {
          resetQuiz();
          setPage("landing");
          setCheckBtnHighlight(false);
        }}
      />
      {page === "landing" && (
        <QuizPageLanding
          categoryId={categoryId}
          setCategoryId={setCategoryId}
          quizType={quizType}
          setQuizType={setQuizType}
          handleStartQuiz={handleStartQuiz}
          buttonText={buttonText}
          checkBtnHighlight={checkBtnHighlight}
        />
      )}
      {page === "main" && (
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
        />
      )}
      <div ref={bottomRef} />
    </main>
  );
}
