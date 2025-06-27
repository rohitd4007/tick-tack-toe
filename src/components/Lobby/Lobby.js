import { useState, useEffect, useRef } from 'react';
import styles from './Lobby.module.css';
import socket from '../../Utils/socket';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default function Lobby({ onGameStart }) {
    const [roomCode, setRoomCode] = useState('');
    const [status, setStatus] = useState('');
    const [createdRoom, setCreatedRoom] = useState(null);
    const inputRef = useRef();

    // On mount, check for ?room= param and auto-populate
    useEffect(() => {
        const params = new URLSearchParams(window.location.search);
        const code = params.get('room');
        if (code) {
            setRoomCode(code);
            setTimeout(() => {
                if (inputRef.current) inputRef.current.focus();
            }, 100);
        }
    }, []);

    useEffect(() => {
        // Clean up listeners on unmount
        return () => {
            socket.off('roomCreated');
            socket.off('startGame');
            socket.off('errorMessage');
        };
    }, []);

    useEffect(() => {
        socket.on('roomCreated', ({ roomCode }) => {
            setCreatedRoom(roomCode);
            setStatus('🎉 Room Created, waiting for opponent...');
            toast.info('🎉 Room created! Share the code or link with your friend.');
        });
        socket.on('startGame', (data) => {
            onGameStart(data);
        });
        socket.on('errorMessage', (msg) => {
            toast.error('❗ ' + msg);
            setStatus('❗ ' + msg);
        });
    }, [onGameStart]);

    const createRoom = () => {
        socket.emit('createRoom');
    };

    const joinRoom = () => {
        if (!roomCode) return;
        socket.emit('joinRoom', { roomCode: roomCode.trim().toUpperCase() });
    };

    const handleCopyRoomCode = () => {
        if (createdRoom) {
            navigator.clipboard.writeText(createdRoom);
            toast.success('📋 Room code copied!');
        }
    };

    const handleShare = () => {
        if (createdRoom) {
            const shareUrl = `${window.location.origin}?room=${createdRoom}`;
            navigator.clipboard.writeText(shareUrl);
            toast.success('📤 Shareable link copied!');
        }
    };

    return (
        <div className={styles.lobby} aria-label="Lobby area">
            <h2 className={styles.lobbyTitle}><span className="emoji" role="img" aria-label="lobby">💬</span> Multiplayer Tic-Tac-Toe</h2>
            <div className={styles.buttons}>
                <button className={styles.create} onClick={createRoom} aria-label="Create a new room">Create Room</button>
                <input
                    ref={inputRef}
                    placeholder="Enter Room Code"
                    value={roomCode}
                    onChange={(e) => setRoomCode(e.target.value)}
                    className={styles.input}
                    aria-label="Room code input"
                />
                <button className={styles.join} onClick={joinRoom} disabled={!roomCode.trim()} aria-label="Join room">Join Room</button>
            </div>
            {createdRoom && (
                <div className={styles.roomInfo}>
                    <span className={styles.roomCode} onClick={handleCopyRoomCode} title="Click to copy room code" tabIndex={0} role="button" aria-label="Copy room code">{createdRoom}</span>
                    <button className={styles.shareBtn} onClick={handleShare} aria-label="Share room link">📤 Share</button>
                </div>
            )}
            <p className={styles.status}>{status ? `👤 ${status}` : ''}</p>
        </div>
    );
}
