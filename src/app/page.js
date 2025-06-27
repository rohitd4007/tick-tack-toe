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

  useEffect(() => {
    socket.on('updateBoard', ({ board, currentTurn }) => {
      setBoard(board);
      setMyTurn(currentTurn === socket.id);
      setStatus(currentTurn === socket.id ? 'Your Turn' : "Opponent's Turn");
    });

    socket.on('gameOver', ({ board, winner }) => {
      setBoard(board);
      setGameOver(true);
      setStatus(winner === 'Draw' ? 'It\'s a Draw!' : `Winner: ${winner}`);
      toast.info(winner === 'Draw' ? 'It\'s a Draw!' : `Winner: ${winner}`);
    });

    socket.on('playerLeft', (msg) => {
      toast.error(msg);
      setRoomData(null);
      setBoard([]);
      setGameOver(false);
      setStatus('');
    });

    return () => socket.removeAllListeners();
  }, []);

  const handleGameStart = ({ roomCode, board, currentTurn, players }) => {
    setRoomData({ roomCode, players });
    setBoard(board);
    setSymbol(socket.id === players[0] ? 'X' : 'O');
    setMyTurn(currentTurn === socket.id);
    setStatus(currentTurn === socket.id ? 'Your Turn' : "Opponent's Turn");
  };

  const handleMove = (index) => {
    if (!gameOver) {
      socket.emit('makeMove', { roomCode: roomData.roomCode, index });
    }
  };

  return (
    <div className="main-bg">
      <header className="ttt-header">
        <h1>Tic-Tac-Toe Online</h1>
      </header>
      <div className="ttt-container">
        {!roomData ? (
          <Lobby onGameStart={handleGameStart} />
        ) : (
          <>
            <div className="ttt-status-bar">
              <span className="ttt-symbol">You are <b>{symbol}</b></span>
              <span className={`ttt-status ${gameOver ? 'ttt-over' : myTurn ? 'ttt-turn' : 'ttt-wait'}`}>{status}</span>
            </div>
            <Board board={board} myTurn={myTurn} onMove={handleMove} gameOver={gameOver} />
          </>
        )}
      </div>
      <ToastContainer position="top-center" autoClose={1800} hideProgressBar={false} newestOnTop closeOnClick pauseOnFocusLoss draggable pauseOnHover theme="colored" />
    </div>
  );
}
