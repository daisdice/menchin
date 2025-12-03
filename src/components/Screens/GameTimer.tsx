import React, { useEffect, useState } from 'react';
import type { GameMode } from '../../store/useGameStore';
import styles from './GameScreen.module.css';

interface GameTimerProps {
    gameEndTime: number;
    mode: GameMode;
    isPlaying: boolean;
    countdown: number | null;
}

export const GameTimer: React.FC<GameTimerProps> = ({ gameEndTime, mode, isPlaying, countdown }) => {
    const [displayTime, setDisplayTime] = useState('0.00');

    // High precision timer
    useEffect(() => {
        if (countdown !== null) {
            setDisplayTime('0.00');
            return;
        }
        if (!isPlaying || gameEndTime === 0) return;

        let animationFrameId: number;
        const updateTimer = () => {
            const now = Date.now();
            // SPRINT mode: count up from start time
            if (mode === 'sprint') {
                const elapsed = now - gameEndTime;
                const seconds = Math.floor(elapsed / 1000);
                const centiseconds = Math.floor((elapsed % 1000) / 10);
                setDisplayTime(`${seconds}.${centiseconds.toString().padStart(2, '0')}`);
                animationFrameId = requestAnimationFrame(updateTimer);
            } else {
                // CHALLENGE or SURVIVAL mode: count down to end time
                const remaining = Math.max(0, gameEndTime - now);
                const seconds = Math.floor(remaining / 1000);
                const centiseconds = Math.floor((remaining % 1000) / 10);
                setDisplayTime(`${seconds}.${centiseconds.toString().padStart(2, '0')}`);
                if (remaining > 0) animationFrameId = requestAnimationFrame(updateTimer);
            }
        };
        updateTimer();
        return () => {
            if (animationFrameId) cancelAnimationFrame(animationFrameId);
        };
    }, [isPlaying, gameEndTime, countdown, mode]);

    if (mode !== 'challenge' && mode !== 'sprint' && mode !== 'survival') {
        return null;
    }

    return (
        <div className={styles.timerDisplay}>
            <div className={styles.timerLabel}>TIME</div>
            <div className={styles.timerValue}>{displayTime}</div>
        </div>
    );
};
