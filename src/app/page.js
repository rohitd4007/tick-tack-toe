"use client"
import { useEffect, useState } from 'react';
import Lobby from '../components/Lobby/Lobby';
import Board from '../components/Board/Board';
import socket from '../Utils/socket';

export default function Home() {
  const [roomData, setRoomData] = useState(null);
  const [board, setBoard] = useState([]);
  const [myTurn, setMyTurn] = useState(false);
  const [gameOver, setGameOver] = useState(false);
  const [symbol, setSymbol] = useState('X');

  useEffect(() => {
    socket.on('updateBoard', ({ board, currentTurn }) => {
      setBoard(board);
      setMyTurn(currentTurn === socket.id);
    });

    socket.on('gameOver', ({ board, winner }) => {
      setBoard(board);
      setGameOver(true);
      setTimeout(() => alert(winner === 'Draw' ? 'It\'s a Draw!' : `Winner: ${winner}`), 100);
    });

    socket.on('playerLeft', (msg) => {
      alert(msg);
      setRoomData(null);
      setBoard([]);
      setGameOver(false);
    });

    return () => socket.removeAllListeners();
  }, []);

  const handleGameStart = ({ roomCode, board, currentTurn, players }) => {
    console.log('game started', board, players, currentTurn)
    setRoomData({ roomCode, players });
    setBoard(board);
    setSymbol(socket.id === players[0] ? 'X' : 'O');
    setMyTurn(currentTurn === socket.id);
  };

  const handleMove = (index) => {
    if (!gameOver) {
      socket.emit('makeMove', { roomCode: roomData.roomCode, index });
    }
  };

  return (
    <div style={{ textAlign: 'center' }}>
      {!roomData ? (
        <Lobby onGameStart={handleGameStart} />
      ) : (
        <>
          <h2>You are {symbol}</h2>
          <h3>{gameOver ? 'Game Over' : myTurn ? 'Your Turn' : "Opponent's Turn"}</h3>
          <Board board={board} myTurn={myTurn} onMove={handleMove} gameOver={gameOver} />
        </>
      )}
    </div>
  );
}
