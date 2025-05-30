import React, { useState, useEffect, useRef, useCallback } from "react";
import "./App.css";
import Header from "./Header.js";
import QuizPageLanding from "./components/QuizPageLanding";
import QuizPageMain from "./components/QuizPageMain";
import QuizResultsPage from "./components/QuizResultsPage";
import { categories } from "./constants";
import { fetchQuizData } from "./services/quizService";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSpinner } from "@fortawesome/free-solid-svg-icons";

export default function App() {
	// --- STATE VARIABLES ---
	const [quizData, setQuizData] = useState([]);
	const [page, setPage] = useState("landing"); // 'landing', 'main', 'results'
	const [selectedAnswers, setSelectedAnswers] = useState({});
	const [score, setScore] = useState(0);
	const [quizCompleted, setQuizCompleted] = useState(false);
	const [quizType, setQuizType] = useState(null);
	const [categoryId, setCategoryId] = useState(null);
	const [buttonText, setButtonText] = useState("Start the Quiz");
	// const [checkBtnHighlight, setCheckBtnHighlight] = useState(false); // --- REMOVED STATE ---
	const [feedbackMessage, setFeedbackMessage] = useState("");

	// --- REFS ---
	const topRef = useRef(null);

	// --- SCROLL FUNCTIONS ---
	const scrollToTop = useCallback(() => {
		topRef.current?.scrollIntoView({ behavior: "smooth" });
	}, []);

	// --- DERIVED STATE ---
	const allQuestionsAnswered =
		quizData.length > 0 &&
		quizData.every((item) => selectedAnswers[item.id] !== undefined);
	const selectedCategory = categories.find(
		(category) => category.id === categoryId
	);
	const categoryName = selectedCategory?.name || "Selected";
	const difficultyName = quizType
		? quizType.charAt(0).toUpperCase() + quizType.slice(1)
		: "Chosen";

	// --- DATA FETCHING ---
	const handleFetchQuizData = useCallback(async () => {
		if (!categoryId || !quizType) {
			setFeedbackMessage("Category and difficulty are required.");
			setButtonText("Start the Quiz");
			return;
		}
		setButtonText(
			<>
				Loading... <FontAwesomeIcon icon={faSpinner} spin />
			</>
		);
		setFeedbackMessage("Fetching questions...");
		try {
			const data = await fetchQuizData(categoryId, quizType);
			if (data && data.length > 0) {
				setQuizData(data);
				setSelectedAnswers({});
				setQuizCompleted(false);
				setScore(0);
				setPage("main");
				setFeedbackMessage("");
				scrollToTop();
			} else {
				setFeedbackMessage(
					"Could not load questions for this category/difficulty. Please try different options or try again later."
				);
				setPage("landing");
			}
		} catch (error) {
			console.error("Error fetching quiz data:", error);
			setFeedbackMessage(
				`Failed to fetch quiz questions. Please check your internet connection and try again. (${error.message})`
			);
			setPage("landing");
		} finally {
			setButtonText("Start the Quiz");
		}
	}, [quizType, categoryId, scrollToTop]);

	// --- ANSWER HANDLING ---
	const handleAnswerClick = useCallback(
		(questionID, selectedAnswer) => {
			if (!quizCompleted) {
				setSelectedAnswers((prevAnswers) => ({
					...prevAnswers,
					[questionID]: selectedAnswer,
				}));
			}
		},
		[quizCompleted]
	);

	// --- CHECKING ANSWERS ---
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
			setFeedbackMessage("");
			setPage("results");
		} else {
			const answeredCount = Object.keys(selectedAnswers).length;
			const totalQuestions = quizData.length;
			setFeedbackMessage(
				`Please answer all ${totalQuestions} questions. You've answered ${answeredCount}.`
			);
		}
	};

	// --- QUIZ RESET / NAVIGATION LOGIC ---
	const resetQuiz = useCallback(
		(keepSettings = false) => {
			setSelectedAnswers({});
			setScore(0);
			setQuizCompleted(false);
			setFeedbackMessage("");
			if (!keepSettings) {
				setQuizType(null);
				setCategoryId(null);
				setQuizData([]);
				setPage("landing");
			} else {
				setPage("main");
				scrollToTop();
			}
		},
		[scrollToTop]
	);

	// --- RESTARTING WITH NEW QUESTIONS ---
	const restartCurrentGame = useCallback(() => {
		resetQuiz(true);
		handleFetchQuizData();
	}, [resetQuiz, handleFetchQuizData]);

	// --- STARTING QUIZ FROM LANDING ---
	const handleStartQuiz = () => {
		if (quizType && categoryId) {
			setFeedbackMessage("");
			handleFetchQuizData();
		} else {
			setFeedbackMessage(
				"Please select both a difficulty and a category to begin."
			);
		}
	};

	// --- REVIEW ANSWERS NAVIGATION ---
	const handleReviewAnswers = useCallback(() => {
		setPage("main");
		scrollToTop();
	}, [scrollToTop]);

	// --- MAIN RENDER LOGIC ---
	return (
		<main>
			<div ref={topRef} />
			<Header currentPage={page} onBackClick={() => resetQuiz(false)} />

			{/* Landing Page */}
			{page === "landing" && (
				<QuizPageLanding
					categoryId={categoryId}
					setCategoryId={setCategoryId}
					quizType={quizType}
					setQuizType={setQuizType}
					handleStartQuiz={handleStartQuiz}
					buttonText={buttonText}
					// checkBtnHighlight={checkBtnHighlight} // --- REMOVED PROP ---
					feedbackMessage={feedbackMessage}
				/>
			)}

			{/* Main Quiz Page */}
			{page === "main" && (
				<QuizPageMain
					quizData={quizData}
					selectedAnswers={selectedAnswers}
					handleAnswerClick={handleAnswerClick}
					handleCheckAnswers={handleCheckAnswers}
					quizCompleted={quizCompleted}
					selectedCategory={selectedCategory}
					quizType={quizType}
					feedbackMessage={feedbackMessage}
					score={score}
					totalQuestions={quizData.length}
					onRetryReview={() => resetQuiz(true)}
					onNewQuestionsReview={restartCurrentGame}
					onChooseNewReview={() => resetQuiz(false)}
				/>
			)}

			{/* Results Page */}
			{page === "results" && quizData.length > 0 && (
				<QuizResultsPage
					score={score}
					totalQuestions={quizData.length}
					categoryName={categoryName}
					difficultyName={difficultyName}
					onRetry={() => resetQuiz(true)}
					onNewQuestions={restartCurrentGame}
					onChooseNew={() => resetQuiz(false)}
					onReviewAnswers={handleReviewAnswers}
				/>
			)}

			{/* Loading/Error State */}
			{page !== "landing" && quizData.length === 0 && (
				<div
					style={{
						marginTop: "50px",
						fontSize: "1.5em",
						color: feedbackMessage.includes("Failed") ? "#ff8a8a" : "#fff",
					}}
				>
					{feedbackMessage ? (
						feedbackMessage
					) : (
						page === "main" && (
							<>
								{" "}
								<FontAwesomeIcon icon={faSpinner} spin /> Loading Questions...{" "}
							</>
						)
					)}
				</div>
			)}
		</main>
	);
}