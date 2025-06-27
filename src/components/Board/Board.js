import Cell from '../Cell/Cell';
import styles from './Board.module.css';

export default function Board({ board, myTurn, onMove, gameOver }) {
    return (
        <div className={styles.boardWrapper}>
            <div className={styles.board}>
                {board.map((val, idx) => (
                    <Cell
                        key={idx}
                        value={val}
                        index={idx}
                        onClick={() => onMove(idx)}
                        disabled={!!val || !myTurn || gameOver}
                    />
                ))}
            </div>
        </div>
    );
}
