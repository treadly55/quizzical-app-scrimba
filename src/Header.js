import React from 'react'

export default function Header({ currentPage, onBackClick }) {
function BackIcon() {
return (
    <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="#fff"
    viewBox="-5 0 32 32"
    stroke="currentColor"
    width="32"
    height="32"
    onClick={onBackClick}
    style={{ cursor: 'pointer' }}
    >
    <path
        fill="#c1c1c1"
        d="M21.531 19.156v-6.719c0-0.813-0.594-1.406-1.406-1.406h-7.813v-5.313c0-0.5-0.25-0.844-0.688-1.063-0.156-0.031-0.313-0.063-0.438-0.063-0.313 0-0.563 0.094-0.75 0.313l-10.125 10.125c-0.438 0.375-0.406 1.125 0 1.563l10.125 10.125c0.625 0.688 1.875 0.219 1.875-0.813v-5.375h7.813c0.813 0 1.406-0.563 1.406-1.375z"
    />
    </svg>
);
}

return (
<header className="header grid-container ">
    <div className="left-col">{currentPage !== 'landing' && <BackIcon />}</div>
    <div className="middle-col"> 
        <h2>Quizzmania Deluxe</h2>
    </div>
    <div className='right-col'>
    </div>
</header>
);
}