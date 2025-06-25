import { useState } from 'react';
import styles from './Lobby.module.css';
import socket from '../../Utils/socket';

export default function Lobby({ onGameStart }) {
    const [roomCode, setRoomCode] = useState('');
    const [status, setStatus] = useState('');

    const createRoom = () => {
        socket.emit('createRoom');
    };

    const joinRoom = () => {
        if (!roomCode) return;
        socket.emit('joinRoom', { roomCode: roomCode.trim().toUpperCase() });
    };

    socket.on('roomCreated', ({ roomCode }) => {
        setStatus(`Room Created: ${roomCode}, waiting for opponent...`);
    });

    socket.on('startGame', (data) => {
        console.log("data", data)
        onGameStart(data);
    });

    socket.on('errorMessage', (msg) => {
        setStatus(msg);
    });

    return (
        <div className={styles.lobby}>
            <h2>Multiplayer Tic-Tac-Toe</h2>
            <div className={styles.buttons}>
                <button onClick={createRoom}>Create Room</button>
                <input
                    placeholder="Enter Room Code"
                    value={roomCode}
                    onChange={(e) => setRoomCode(e.target.value)}
                />
                <button onClick={joinRoom}>Join Room</button>
            </div>
            <p>{status}</p>
        </div>
    );
}
