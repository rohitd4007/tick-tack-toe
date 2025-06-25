import styles from './Cell.module.css';

export default function Cell({ value, onClick, disabled }) {
    return (
        <div
            className={`${styles.cell} ${disabled ? styles.disabled : ''}`}
            onClick={!disabled ? onClick : undefined}
        >
            {value}
        </div>
    );
}
