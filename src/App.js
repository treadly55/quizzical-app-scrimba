import React, { useState, useEffect, useRef, useCallback } from 'react'
import './App.css';
import Header from './Header.js'
import QuizBox from './Quiz.js'
import { nanoid } from 'nanoid'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSpinner } from '@fortawesome/free-solid-svg-icons'; 
import Confetti from 'react-confetti';

// Categories list
const categories = [
  { id: 9, name: "General Knowledge" },
  { id: 10, name: "Literature" },
  { id: 11, name: "Film" },
  { id: 12, name: "Music" },
  { id: 14, name: "Television" },
  { id: 15, name: "Video Games" },
]

// Start App Function
export default function App() {
  const [quizData, setQuizData] = useState([])
  const [page, setPage] = useState('landing')
  const [selectedAnswers, setSelectedAnswers] = useState({})
  const [score, setScore] = useState(0)
  const [quizCompleted, setQuizCompleted] = useState(false)
  const [showResults, setShowResults] = useState(false)
  const [quizType, setQuizType] = useState(null)
  const [categoryId, setCategoryId] = useState(null)
  const [buttonText, setButtonText] = useState('Start the Quiz')
  const [checkBtnHighlight, setCheckBtnHighlight] = useState(false)
  const topRef = useRef(null)
  const bottomRef = useRef(null)
  const scoreCalculatedRef = useRef(false)
  const allQuestionsAnswered = quizData.every(item => selectedAnswers[item.id])
  const selectedCategory = categories.find(category => category.id === categoryId)

  //API Call for Quiz Data
  const fetchQuizData = useCallback(async () => {
    try {
      const response = await fetch(`https://opentdb.com/api.php?amount=5&category=${categoryId}&difficulty=${quizType}&type=multiple`)
      const data = await response.json()
      setQuizData(prevData => data.results.map((item) => {
        const shuffledOptions = [...item.incorrect_answers, item.correct_answer].sort(() => Math.random() - 0.5)
        return {
          id: nanoid(),
          option1: shuffledOptions[0],
          option2: shuffledOptions[1],
          option3: shuffledOptions[2],
          option4: shuffledOptions[3],
          question: item.question,
          answer: item.correct_answer
        };
      }));
    } catch (error) {
      console.error('Error fetching data:', error)
    }
  }, [quizType, categoryId])

//Select answer
  const handleAnswerClick = useCallback((questionID, selectedAnswer) => {
    setSelectedAnswers(prevAnswers => ({
      ...prevAnswers,
      [questionID]: selectedAnswer
    }))
  }, [])

  //Check answers
  const handleCheckAnswers = () => {
    if (allQuestionsAnswered) {
      calculateScore()
      setQuizCompleted(true)
      setShowResults(true)
      scrollToBottom()
    } else {
      const answeredCount = Object.keys(selectedAnswers).length
      alert(`Please answer all questions. You've answered ${answeredCount} out of ${quizData.length} questions.`)
    }
  }
  
  //Begin quiz
  const startQuiz = () => {
    if (quizType && categoryId) {
      setTimeout(() => {
        setPage('main')
        scrollToTop()
      }, 1000)
      fetchQuizData()
    } else {
      alert("Please select a difficulty and category to begin")
    }
  }

  //Reset quiz with new questions
  const resetQuiz = (keepSettings = false) => {
    setSelectedAnswers({})
    setScore(0)
    setQuizCompleted(false)
    setShowResults(false)
    scoreCalculatedRef.current = false
    setCheckBtnHighlight(false)
    if (!keepSettings) {
      setQuizType(null)
      setCategoryId(null)
    }
  }  
  
  //Retry quiz with current settings
  const restartCurrentGame = () => {
    resetQuiz(true)
    fetchQuizData()
    scrollToTop()
  }
  
  //Start quiz
  const handleStartQuiz = () => {
    setButtonText(
      <>
        Loading... <FontAwesomeIcon icon={faSpinner} spin /> 
      </>
    )
    //Loading spinner for UX
    setTimeout(() => {
      setButtonText('Start the Quiz')
    }, 1200)
    startQuiz()
  }

  //Score 
  const calculateScore = useCallback(() => {
    if (scoreCalculatedRef.current) return
    let newScore = 0
    quizData.forEach(item => {
      if (selectedAnswers[item.id] === item.answer) {
        newScore++
      }
    })
    setScore(newScore)
    scoreCalculatedRef.current = true
  }, [quizData, selectedAnswers])
  
  //Move into view on quiz state change
  const scrollToTop = useCallback(() => {
    topRef.current?.scrollIntoView()
  }, [])
  const scrollToBottom = useCallback(() => {
    bottomRef.current?.scrollIntoView()
  }, [])

  useEffect(() => {
    if(showResults) {
      scrollToBottom()
    }
    }, [showResults])

  //Quiz Landing
  const QuizPageLanding = () => (  
    <div>
      <div className="MegaIcon">🤯</div>
      <h1 className="MegaHeader">Welcome to Quizzmania</h1>
      <form className="quizSelectForm quiz-form">
        <h4 className="sub-title">Choose a subject</h4>
        <div className="radio-group">
        <fieldset>    
          {categories.map((category) => (
            <div key={category.id} className="question">
              <input
                type="radio"
                id={`category-${category.id}`}
                name="quizCategory"
                value={category.id}
                checked={categoryId === category.id}
                onChange={(e) => setCategoryId(Number(e.target.value))}
              />
              <label htmlFor={`category-${category.id}`}>{category.name}</label>
            </div>
          ))}
        </fieldset>
        </div>
        <h4 className="sub-title">Choose a difficulty level</h4>
        <div className="radio-group">
          <fieldset>
            <div className="question">
              <input
                type="radio"
                id="easy"
                name="quizType"
                value="easy"
                checked={quizType === 'easy'}
                onChange={(e) => setQuizType(e.target.value)}
              />
              <label htmlFor="easy">🎈 Easy</label>
            </div>
            <div className="question">
              <input
                type="radio"
                id="medium"
                name="quizType"
                value="medium"
                checked={quizType === 'medium'}
                onChange={(e) => setQuizType(e.target.value)}
              />
              <label htmlFor="medium">💪 Medium</label>
            </div>
            <div className="question">
              <input
                type="radio"
                id="hard"
                name="quizType"
                value="hard"
                checked={quizType === 'hard'}
                onChange={(e) => setQuizType(e.target.value)}
              />
              <label htmlFor="hard">💀 Hard</label>
            </div>
          </fieldset>
        </div>
      </form>
      <button 
        onClick={() => {
        handleStartQuiz()
        setCheckBtnHighlight(true)
      }}
      className={`mainButton ${checkBtnHighlight ? 'mainButtonclicked' : ''}`} 
      >
      {buttonText}
      </button>
    </div>
  )

  //Quiz Page
  const QuizPageMain = () => {
    const [showConfetti, setShowConfetti] = useState(false)
    const [localCategory, setLocalCategory] = useState(selectedCategory?.name || '')
    const [localDifficulty, setLocalDifficulty] = useState(quizType || '')

    useEffect(() => {
      setLocalCategory(selectedCategory?.name || '')
      setLocalDifficulty(quizType || '')
    }, [selectedCategory, quizType])

    useEffect(() => {
      if (showResults && score > 4) {
        setShowConfetti(true)
      }
    }, [showResults, score])

    return (
      <div>
        <h3 className='quiz-category-header'>
          You are now playing on <span className='game-status'>
            {localDifficulty === 'hard' ? "Hard" : localDifficulty === 'medium' ? "Medium" : "Easy"}
          </span> difficulty in the <span className='game-status'>
            {localCategory || 'Unknown'}
          </span> category
        </h3>
        {quizData.map((item, index) => (
          <QuizBox 
            key={item.id}
            id={item.id}
            questionNumber={index + 1}
            question={item.question}
            options={[item.option1, item.option2, item.option3, item.option4]}
            selectedAnswer={selectedAnswers[item.id]}
            onAnswerClick={(selectedAnswer) => handleAnswerClick(item.id, selectedAnswer)}
            answer={item.answer}
            isCompleted={quizCompleted} 
          />
        ))}
        <div>
          <button 
            onClick={() => {
              handleCheckAnswers()
              scrollToBottom()
            }}
            className='mainButton'
            disabled={quizCompleted}
          >Check Answers
          </button>
        </div>
        {showResults && (
          <div ref={bottomRef} className="quiz-finish-box">
            <h2>Quiz Completed!</h2>
            <p className='score-reveal'>Your final score is: {score}/{quizData.length}</p>
            {score > 4 ? 
              <div>
                <p>Perfect score! 💯💯💯</p>
                {showConfetti && (
                  <Confetti
                    width={window.innerWidth}
                    height={window.innerHeight}
                    numberOfPieces={500}
                    recycle={false}
                    style={{position: 'fixed', top: 0, left: 0, zIndex: 9999}}
                  />
                )}
              </div> : <p>Try again to get a perfect score</p>
            }
            <div className="quiz-finish-buttons">
              <button className={`quizOverButton ${score > 4 ? "stop-retry" : "need-to-retry"}`} 
                onClick={() => {
                resetQuiz(true)
                scrollToTop()
              }}>Retry quiz</button>
              <button className="quizOverButton small" onClick={restartCurrentGame}>
                New {selectedCategory ? selectedCategory.name : 'Quiz'} Questions
              </button>
              <button className="quizOverButton small" onClick={() => {
                setPage('landing')
                resetQuiz()
                scrollToTop()
              }}>Restart Quizzmania</button>
            </div>
          </div>
        )}
    </div>
  )
  }
  return (
    <main>
      <div ref={topRef} />
      <Header 
        currentPage={page} 
        onBackClick={() => {
          resetQuiz()
          setPage('landing')
          setCheckBtnHighlight(false)
        }}
      />
      {page === 'landing' && <QuizPageLanding />}
      {page === 'main' && <QuizPageMain />}
      <div ref={bottomRef} />
    </main>
  )
}