import React from 'react';
import he from 'he'


const QuizBox = ({ 
id, 
questionNumber, 
question, 
options, 
selectedAnswer, 
onAnswerClick, 
answer,
isCompleted 
}) => {

const decodeIfNeeded = (text) => {
    const decodedText = he.decode(text)
    return text !== decodedText ? decodedText : text
}

const cleanedQuestion = decodeIfNeeded(question)
const cleanedOptions = options.map(option => decodeIfNeeded(option))


return (
<div className="quiz-box">
    <h3 className='quiz-question-header'>Question {questionNumber}</h3>
    <p className='quiz-question'>{cleanedQuestion}</p>
    <div className="answer-box-options">
    {cleanedOptions.map((option, index) => (
        <div
        key={index}
        onClick={() => !isCompleted && onAnswerClick(option)} // CHANGED: Added condition to prevent clicks when completed
        className={`answer-option ${selectedAnswer === option ? 'selected' : ''} ${isCompleted && option === answer ? 'correct' : ''} ${isCompleted && selectedAnswer === option && option !== answer ? 'incorrect' : ''}`}
        >
        {option}
        </div>
    ))}
    </div>
</div>
);
};

export default QuizBox;