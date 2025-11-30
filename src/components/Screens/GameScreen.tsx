import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useGameStore } from '../../store/useGameStore';
import { Tile } from '../UI/Tile';
import { GameButton } from '../UI/GameButton';
import { Card } from '../UI/Card';
import styles from './GameScreen.module.css';

export const GameScreen: React.FC = () => {
    const navigate = useNavigate();
    const {
        currentHand,
        gameEndTime,
        score,
        lives,
        isPlaying,
        selectedWaits,
        toggleWait,
        submitAnswer,
        tick,
        mode,
        difficulty,
        correctCount,
        isGameOver,
        isTimeUp,
        currentWaits,
    } = useGameStore();

    const [feedback, setFeedback] = useState<{ type: 'correct' | 'incorrect'; message: string; subMessage?: string } | null>(null);
    const [displayTime, setDisplayTime] = useState('120.00');
    const [countdown, setCountdown] = useState<number | null>(null);

    // Reset countdown when game starts
    useEffect(() => {
        if (isPlaying && gameEndTime === 0) {
            setCountdown(3);
        }
    }, [isPlaying, gameEndTime]);

    // Countdown effect
    useEffect(() => {
        if (!isPlaying || countdown === null) return;
        if (countdown > 0) {
            const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
            return () => clearTimeout(timer);
        } else {
            const timer = setTimeout(() => {
                setCountdown(null);
                // SPRINT mode: set start time for count-up timer
                if (mode === 'sprint') {
                    const startTime = Date.now();
                    useGameStore.setState({ gameEndTime: startTime, timeLeft: 0 });
                } else {
                    // CHALLENGE or SURVIVAL mode: set end time for countdown timer
                    const duration = mode === 'challenge' ? 120 : (mode === 'survival' ? 30 : 0);
                    if (duration > 0) {
                        const newEndTime = Date.now() + duration * 1000;
                        useGameStore.setState({ gameEndTime: newEndTime, timeLeft: duration });
                    }
                }
            }, 500);
            return () => clearTimeout(timer);
        }
    }, [countdown, isPlaying, mode]);

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

    // Navigation on game over / not playing
    useEffect(() => {
        if (isGameOver) {
            navigate('/result');
            return;
        }
        if (!isPlaying) {
            navigate('/');
            return;
        }
        if (countdown !== null) return;
        const interval = setInterval(() => tick(), 100);
        return () => clearInterval(interval);
    }, [isPlaying, isGameOver, navigate, tick, countdown]);

    // End condition for survival/practice
    useEffect(() => {
        if (!isPlaying) return;
        if (mode !== 'sprint' && mode !== 'challenge' && lives <= 0) {
            // Handled by store
        }
    }, [lives, isPlaying, mode]);

    // Handle Time Up
    useEffect(() => {
        if (isTimeUp && !feedback) {
            setFeedback({
                type: 'incorrect',
                message: `TIME UP... ANSWER: ${currentWaits.join(', ')}`,
            });
            setTimeout(() => {
                setFeedback(null);
                useGameStore.getState().endGame();
            }, 2000);
        }
    }, [isTimeUp, feedback, currentWaits]);

    const handleSubmit = () => {
        const result = submitAnswer();
        if (result.correct) {
            // SPRINT mode: show time spent on this question
            if (mode === 'sprint') {
                setFeedback({
                    type: 'correct',
                    message: 'CORRECT!',
                    subMessage: `${result.timeSpent!.toFixed(2)}s`,
                });
            } else if (mode === 'survival') {
                setFeedback({
                    type: 'correct',
                    message: 'CORRECT!',
                    subMessage: result.bonuses ? result.bonuses[0] : '',
                });
            } else if (mode === 'practice') {
                setFeedback({
                    type: 'correct',
                    message: 'CORRECT!',
                    subMessage: `${result.timeSpent!.toFixed(2)}s`,
                });
            } else {
                // CHALLENGE mode: show score and bonus
                const baseScore = result.points! - (result.fastBonus || 0);
                const baseScoreDisplay = `+${baseScore}`;
                const bonusDisplay = result.fastBonus ? `FAST BONUS +${result.fastBonus}` : '';
                setFeedback({
                    type: 'correct',
                    message: 'CORRECT!',
                    subMessage: bonusDisplay ? `${baseScoreDisplay}\n${bonusDisplay}` : baseScoreDisplay,
                });
            }
            setTimeout(() => {
                setFeedback(null);
                if (result.gameEnding) {
                    useGameStore.getState().endGame();
                } else if (useGameStore.getState().isPlaying) {
                    useGameStore.getState().nextHand();
                }
            }, 1000);
        } else {
            setFeedback({
                type: 'incorrect',
                message: `WRONG... ANSWER: ${result.correctWaits.join(', ')}`,
            });
            setTimeout(() => {
                setFeedback(null);
                if (result.gameEnding) {
                    useGameStore.getState().endGame();
                } else if (useGameStore.getState().isPlaying) {
                    useGameStore.getState().nextHand();
                }
            }, 2000);
        }
    };

    return (
        <div className={styles.container}>
            {/* Debug Win Button - only in development */}
            {import.meta.env.DEV && (
                <div
                    style={{ position: 'absolute', top: 0, left: 0, width: 50, height: 50, zIndex: 9999, cursor: 'pointer' }}
                    onClick={() => useGameStore.getState().endGame(true)}
                />
            )}
            {/* Header */}
            <div className={styles.header}>
                <div className={styles.modeInfo}>
                    <span className={styles.modeLabel}>{mode.toUpperCase()}</span>
                    <span className={styles.difficultyLabel}>{difficulty.toUpperCase()}</span>
                </div>
                <div className={styles.statsGroup} style={(mode === 'sprint' || mode === 'survival' || mode === 'practice') ? { justifyContent: 'center' } : {}}>
                    {mode !== 'sprint' && mode !== 'survival' && mode !== 'practice' && (
                        <div className={styles.statItem}>
                            <span className={styles.statLabel}>LIFE</span>
                            <span className={styles.lives}>{'❤️'.repeat(lives)}</span>
                        </div>
                    )}
                    {(mode === 'challenge' || mode === 'sprint' || mode === 'survival' || mode === 'practice') && (
                        <div className={styles.statItem}>
                            <span className={styles.statLabel}>PROGRESS</span>
                            <span className={styles.statValue}>
                                {(mode === 'survival' || mode === 'practice') ? correctCount : `${correctCount}/10`}
                            </span>
                        </div>
                    )}
                    {mode !== 'sprint' && mode !== 'survival' && mode !== 'practice' && (
                        <div className={styles.statItem}>
                            <span className={styles.statLabel}>SCORE</span>
                            <span className={styles.statValue}>{Math.floor(score)}</span>
                        </div>
                    )}
                </div>
            </div>
            {/* Timer */}
            {(mode === 'challenge' || mode === 'sprint' || mode === 'survival') && (
                <div className={styles.timerDisplay}>
                    <div className={styles.timerLabel}>TIME</div>
                    <div className={styles.timerValue}>{displayTime}</div>
                </div>
            )}
            {/* Game Area */}
            <div className={styles.gameArea}>
                <Card className={styles.handCard}>
                    <div className={styles.handContainer}>
                        {currentHand.map((tile, index) => (
                            <Tile key={`${tile}-${index}`} tile={tile} disabled />
                        ))}
                    </div>
                </Card>
                <div className={styles.controls}>
                    <p className={styles.instruction}>SELECT WAITS</p>
                    <div className={styles.numpad}>
                        {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((num) => (
                            <Tile key={num} tile={num} onClick={() => toggleWait(num)} selected={selectedWaits.includes(num)} />
                        ))}
                    </div>
                    <GameButton variant="primary" size="lg" onClick={handleSubmit} className={styles.submitBtn} fullWidth>
                        ANSWER
                    </GameButton>
                    {mode === 'practice' && (
                        <GameButton variant="danger" size="lg" onClick={() => useGameStore.getState().endGame()} fullWidth className={styles.submitBtn}>
                            END
                        </GameButton>
                    )}
                </div>
            </div>
            {/* Countdown Overlay */}
            {countdown !== null && (
                <div className={styles.countdownOverlay}>
                    <div className={styles.countdownContent}>
                        {countdown > 0 ? (
                            <span className={styles.countdownNumber}>{countdown}</span>
                        ) : (
                            <span className={styles.countdownStart}>START!</span>
                        )}
                    </div>
                </div>
            )}
            {/* Feedback Overlay */}
            <AnimatePresence>
                {feedback && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0 }}
                        className={`${styles.feedbackOverlay} ${styles[feedback.type]}`}
                    >
                        <div className={styles.feedbackContent}>
                            <span className={styles.feedbackIcon}>{feedback.type === 'correct' ? '⭕' : '❌'}</span>
                            <span className={styles.feedbackMessage}>{feedback.message}</span>
                            {feedback.subMessage && (
                                <span className={styles.feedbackSubMessage}>{feedback.subMessage}</span>
                            )}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};
