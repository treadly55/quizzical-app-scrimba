import React, { useState, useEffect, useRef, useCallback } from 'react'
import './App.css';
import Header from './Header.js'
import QuizBox from './Quiz.js'
import { nanoid } from 'nanoid'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSpinner } from '@fortawesome/free-solid-svg-icons'; 


const categories = [
  { id: 9, name: "General Knowledge" },
  { id: 10, name: "Literature" },
  { id: 11, name: "Film" },
  { id: 12, name: "Music" },
  { id: 14, name: "Television" },
  { id: 15, name: "Video Games" },
]
export default function App() {
  const [quizData, setQuizData] = useState([])
  const [unfilteredData, setUnfilteredData] = useState([])
  const [page, setPage] = useState('landing')
  const [selectedAnswers, setSelectedAnswers] = useState({})
  const [score, setScore] = useState(0)
  const [quizCompleted, setQuizCompleted] = useState(false)
  const [showResults, setShowResults] = useState(false)
  const [quizType, setQuizType] = useState(null)
  const [categoryId, setCategoryId] = useState(null)
  const [buttonText, setButtonText] = useState('Start the Quiz')
  const [checkBtnHighlight, setCheckBtnHighlight] = useState(false)


  const scoreCalculatedRef = useRef(false)
  const bottomRef = useRef(null)
  const allQuestionsAnswered = quizData.every(item => selectedAnswers[item.id])
  const showAnswerButtonCondStyle = quizData.length > 0 && quizData.every(item => selectedAnswers[item.id])


  const fetchQuizData = useCallback(async () => {
    console.log('calling API')
    try {
      const response = await fetch(`https://opentdb.com/api.php?amount=5&category=${categoryId}&difficulty=${quizType}&type=multiple`)
      const data = await response.json()
      console.log(data)
      setUnfilteredData(data)
      const mappedData = data.results.map((item) => {
        const shuffledOptions = [...item.incorrect_answers, item.correct_answer].sort(() => Math.random() - 0.5);
        return {
          id: nanoid(),
          option1: shuffledOptions[0],
          option2: shuffledOptions[1],
          option3: shuffledOptions[2],
          option4: shuffledOptions[3],
          question: item.question,
          answer: item.correct_answer
        };
      });
      setQuizData(mappedData)
      console.log('Data logged', mappedData)
    } catch (error) {
      console.log('Error fetching data:', error)
    }
  }, [quizType, categoryId])

  const handleAnswerClick = useCallback((questionID, selectedAnswer) => {
    setSelectedAnswers(prevAnswers => ({
      ...prevAnswers,
      [questionID]: selectedAnswer
    }))
  }, [])

  const calculateScore = useCallback(() => {
    if (scoreCalculatedRef.current) return;
    let newScore = 0;
    quizData.forEach(item => {
      if (selectedAnswers[item.id] === item.answer) {
        newScore++;
      }
    })
    setScore(newScore)
    scoreCalculatedRef.current = true
  }, [quizData, selectedAnswers])

  const handleCheckAnswers = () => {
    if (allQuestionsAnswered) {
      calculateScore()
      setQuizCompleted(true)
      setShowResults(true)
    } else {
      const answeredCount = Object.keys(selectedAnswers).length
      alert(`Please answer all questions. You've answered ${answeredCount} out of ${quizData.length} questions.`)
    }
  }

  const resetQuiz = () => {
    setSelectedAnswers({})
    setScore(0)
    setQuizCompleted(false)
    setShowResults(false)
    scoreCalculatedRef.current = false
    setQuizType(null)
    setCategoryId(null)
    setCheckBtnHighlight(false)
  }

  const quickFixResetQuiz = () => {
    setSelectedAnswers({})
    setScore(0)
    setQuizCompleted(false)
    setShowResults(false)
    scoreCalculatedRef.current = false
    setQuizType(null)
    setCheckBtnHighlight(false)
  }

  const restartCurrentGame = () => {
    resetQuiz()
    fetchQuizData()
    scrollToTop()
  }

  const startQuiz = () => {
    if (quizType && categoryId) {
      setTimeout(() => {
        setPage('main')
        scrollToTopFast()
      }, 1000)
      fetchQuizData()
    } else {
      alert("Please select a difficulty and category to begin")
    }
  }


  const scrollToTop = useCallback(() => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  }, []);
  
  const scrollToTopFast = useCallback(() => {
    window.scrollTo({
      top: 0,
      behavior: 'auto'
    });
  }, []);

  const scrollToBottom = useCallback(() => {
    if(bottomRef.current) {
      bottomRef.current.scrollIntoView({behavior: 'smooth'})
    }
  }, [])

  const handleStartQuiz = () => {
    setButtonText(
      <>
        Loading... <FontAwesomeIcon icon={faSpinner} spin /> 
      </>
    )
    setTimeout(() => {
      setButtonText('Start the Quiz')
    }, 1200)
    startQuiz()
  }

  useEffect(() => {
    if(showResults) {
      scrollToBottom()
    }
  }, [showResults, scrollToBottom])


  const selectedCategory = categories.find(category => category.id === categoryId);
  const selectedCategorySaved = "fixed bleh"



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

  const QuizPageMain = () => (
    <div>
      <h3 className='quiz-category-header'>You are playing on <span className='game-status'>{quizType === 'hard' ? "Hard" : quizType === 'medium' ? "Medium" : "Easy"}</span> difficulty in the <span className='game-status'>{selectedCategory ? selectedCategory.name : selectedCategorySaved}</span> category</h3>
            
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
          {score > 4 ? <p>Perfect score! 💯💯💯</p> : <p>Try again to get a perfect score?</p>}
          <div className="quiz-finish-buttons">
            
            <button className={`quizOverButton ${score > 4 ? "stop-retry" : "need-to-retry"}`} 
              onClick={() => {
              quickFixResetQuiz()
              scrollToTop()
            }}>Retry quiz</button>

            <button className="quizOverButton small" onClick={restartCurrentGame}>New {selectedCategory ? selectedCategory.name : ''} Questions</button>

            <button className="quizOverButton small" onClick={() => {
              setPage('landing')
              resetQuiz()
              scrollToTopFast()
            }}>Restart Quizzmania</button>
          </div>
        </div>
      )}


    </div>
  )

  return (
    <main>
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
    </main>
  )
}