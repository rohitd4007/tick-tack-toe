'use client'
import { useState, useEffect } from 'react';

// Weighted: 1,2,3 are much more likely; 4 and 8 are rare
const weightedNumbers = [1, 2, 3, 1, 2, 3, 1, 2, 3, 4, 8];

export default function DicePage() {
    const [number, setNumber] = useState(null);
    const [rolling, setRolling] = useState(false);

    // Register service worker for PWA
    useEffect(() => {
        if (typeof window !== 'undefined' && 'serviceWorker' in navigator) {
            navigator.serviceWorker.register('/sw.js');
        }
    }, []);

    const rollDice = () => {
        setRolling(true);
        setTimeout(() => {
            const n = weightedNumbers[Math.floor(Math.random() * weightedNumbers.length)];
            setNumber(n);
            setRolling(false);
        }, 500);
    };

    return (
        <div style={{
            minHeight: '100vh',
            background: 'linear-gradient(135deg, #181c24 0%, #a18fff 100%)',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            fontFamily: 'Poppins, Arial, sans-serif',
            color: '#fff',
            position: 'relative',
        }}>
            <head>
                <title>Dice Roller</title>
                <link rel="manifest" href="/manifest.json" />
                <meta name="theme-color" content="#a18fff" />
                <link rel="icon" href="/favicon.ico" />
            </head>
            {/* <h1 style={{
                fontSize: '2.5rem',
                fontWeight: 900,
                marginBottom: '4rem',
                letterSpacing: 1,
                background: 'linear-gradient(90deg, #a18fff 0%, #ff6bcb 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
            }}>
                🎲Roll Dice
            </h1> */}
            <button
                onClick={rollDice}
                disabled={rolling}
                style={{
                    width: 140,
                    height: 140,
                    borderRadius: 32,
                    background: 'rgba(24,28,36,0.92)',
                    border: '4px solid #a18fff',
                    boxShadow: '0 8px 32px #a18fff33, 0 1.5px 6px #ff6bcb22',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '3.5rem',
                    fontWeight: 900,
                    color: '#ff6bcb',
                    cursor: rolling ? 'not-allowed' : 'pointer',
                    marginBottom: 32,
                    transition: 'transform 0.18s',
                    transform: rolling ? 'scale(0.95) rotate(-8deg)' : 'scale(1)',
                    outline: 'none',
                }}
                aria-label="Roll the dice"
            >
                {rolling ? '...' : (number !== null ? number : '🎲')}
            </button>
            <div style={{ marginTop: 16 }}>
                <a href="https://tiik-tak-to.netlify.app/" style={{
                    color: '#a18fff',
                    fontWeight: 700,
                    textDecoration: 'none',
                    fontSize: '1.1rem',
                    borderRadius: '999px',
                    padding: '8px 22px',
                    background: 'rgba(24,28,36,0.7)',
                    border: '2px solid #a18fff',
                    boxShadow: '0 2px 8px #a18fff33',
                }}>
                    ⬅️ Play Tic-Tac-Toe
                </a>
            </div>
        </div>
    );
} 