"use client"
import { useEffect, useState } from 'react';
import Lobby from '../components/Lobby/Lobby';
import Board from '../components/Board/Board';
import socket from '../Utils/socket';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default function Home() {
  const [roomData, setRoomData] = useState(null);
  const [board, setBoard] = useState([]);
  const [myTurn, setMyTurn] = useState(false);
  const [gameOver, setGameOver] = useState(false);
  const [symbol, setSymbol] = useState('X');
  const [status, setStatus] = useState('');
  const [winner, setWinner] = useState(null);

  useEffect(() => {
    socket.on('updateBoard', ({ board, currentTurn }) => {
      setBoard(board);
      setMyTurn(currentTurn === socket.id);
      setStatus(currentTurn === socket.id ? '🟢 Your Turn' : "🕒 Opponent's Turn");
    });

    socket.on('gameOver', ({ board, winner }) => {
      setBoard(board);
      setGameOver(true);
      setWinner(winner);
      let msg = '';
      if (winner === 'Draw') {
        msg = '🤝 It\'s a Draw!';
      } else if (winner === symbol) {
        msg = '🏆 You Win!';
      } else {
        msg = '😢 You Lose!';
      }
      setStatus(msg);
      toast.info(msg);
    });

    socket.on('playerLeft', (msg) => {
      toast.error('👋 ' + msg);
      setRoomData(null);
      setBoard([]);
      setGameOver(false);
      setStatus('');
      setWinner(null);
    });

    return () => socket.removeAllListeners();
  }, [symbol]);

  const handleGameStart = ({ roomCode, board, currentTurn, players }) => {
    setRoomData({ roomCode, players });
    setBoard(board);
    setSymbol(socket.id === players[0] ? 'X' : 'O');
    setMyTurn(currentTurn === socket.id);
    setStatus(currentTurn === socket.id ? '🟢 Your Turn' : "🕒 Opponent's Turn");
    setWinner(null);
    setGameOver(false);
  };

  const handleMove = (index) => {
    if (!gameOver) {
      socket.emit('makeMove', { roomCode: roomData.roomCode, index });
    }
  };

  const handlePlayAgain = () => {
    window.location.reload();
  };

  return (
    <div className="main-bg">
      <header className="ttt-header">
        <h1><span role="img" aria-label="game">🎮</span> Tic-Tac-Toe Online</h1>
      </header>
      <div className="ttt-container">
        {!roomData ? (
          <Lobby onGameStart={handleGameStart} />
        ) : (
          <>
            <div className="ttt-status-bar">
              <span className="ttt-symbol">{symbol === 'X' ? '❌' : '⭕'} You are <b>{symbol}</b></span>
              <span className={`ttt-status ${gameOver ? 'ttt-over' : myTurn ? 'ttt-turn' : 'ttt-wait'}`}>{status}</span>
            </div>
            <Board board={board} myTurn={myTurn} onMove={handleMove} gameOver={gameOver} />
            {gameOver && (
              <div style={{ marginTop: 24, textAlign: 'center' }}>
                <button onClick={handlePlayAgain} style={{
                  padding: '12px 28px',
                  fontSize: '1.1rem',
                  borderRadius: '999px',
                  border: 'none',
                  background: 'linear-gradient(90deg, #a18fff 0%, #ff6bcb 100%)',
                  color: '#181c24',
                  fontWeight: 800,
                  cursor: 'pointer',
                  boxShadow: '0 2px 8px #a18fff33',
                  transition: 'background 0.2s, transform 0.1s',
                }}>
                  🔄 Play Again
                </button>
              </div>
            )}
          </>
        )}
      </div>
      <ToastContainer position="top-center" autoClose={1800} hideProgressBar={false} newestOnTop closeOnClick pauseOnFocusLoss draggable pauseOnHover theme="colored" />
    </div>
  );
}
