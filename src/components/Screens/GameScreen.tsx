import React, { useEffect, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useGameStore } from '../../store/useGameStore';
import { Tile } from '../UI/Tile';
import { GameButton } from '../UI/GameButton';
import { Card } from '../UI/Card';
import { GameTimer } from './GameTimer';
import { DURATION } from '../../utils/constants';
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
    const [countdown, setCountdown] = useState<number | null>(null);
    const [showQuitConfirm, setShowQuitConfirm] = useState(false);

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
                const now = Date.now();
                // SPRINT mode: set start time for count-up timer
                if (mode === 'sprint') {
                    useGameStore.setState({ gameEndTime: now, timeLeft: 0, questionStartTime: now });
                } else {
                    // CHALLENGE or SURVIVAL mode: set end time for countdown timer
                    let duration = 0;
                    if (mode === 'challenge') {
                        switch (difficulty) {
                            case 'beginner': duration = DURATION.CHALLENGE.BEGINNER; break;
                            case 'amateur': duration = DURATION.CHALLENGE.AMATEUR; break;
                            case 'normal': duration = DURATION.CHALLENGE.NORMAL; break;
                            case 'expert': duration = DURATION.CHALLENGE.EXPERT; break;
                            case 'master': duration = DURATION.CHALLENGE.MASTER; break;
                        }
                    } else if (mode === 'survival') {
                        switch (difficulty) {
                            case 'beginner': duration = DURATION.SURVIVAL.BEGINNER; break;
                            case 'amateur': duration = DURATION.SURVIVAL.AMATEUR; break;
                            case 'normal': duration = DURATION.SURVIVAL.NORMAL; break;
                            case 'expert': duration = DURATION.SURVIVAL.EXPERT; break;
                            case 'master': duration = DURATION.SURVIVAL.MASTER; break;
                        }
                    }

                    if (duration > 0) {
                        const newEndTime = now + duration * 1000;
                        useGameStore.setState({ gameEndTime: newEndTime, timeLeft: duration, questionStartTime: now });
                    }
                }
            }, 500);
            return () => clearTimeout(timer);
        }
    }, [countdown, isPlaying, mode]);



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

    // Helper function to generate correct answer feedback
    const getCorrectFeedback = useCallback((result: ReturnType<typeof submitAnswer>) => {
        if (mode === 'sprint' || mode === 'practice') {
            return {
                type: 'correct' as const,
                message: 'CORRECT!',
                subMessage: `${result.timeSpent!.toFixed(2)}s`,
            };
        } else if (mode === 'survival') {
            return {
                type: 'correct' as const,
                message: 'CORRECT!',
                subMessage: result.bonuses ? result.bonuses[0] : '',
            };
        } else {
            // CHALLENGE mode: show score and bonus
            const baseScore = result.points! - (result.fastBonus || 0);
            const baseScoreDisplay = `+${baseScore}`;
            const bonusDisplay = result.fastBonus ? `FAST BONUS +${result.fastBonus}` : '';
            return {
                type: 'correct' as const,
                message: 'CORRECT!',
                subMessage: bonusDisplay ? `${baseScoreDisplay}\n${bonusDisplay}` : baseScoreDisplay,
            };
        }
    }, [mode]);

    // Helper function to handle post-feedback game progression
    const handleFeedbackComplete = useCallback((gameEnding: boolean) => {
        setFeedback(null);
        if (gameEnding) {
            useGameStore.getState().endGame();
        } else if (useGameStore.getState().isPlaying) {
            useGameStore.getState().nextHand();
        }
    }, []);

    // Handle quit button click
    const handleQuitClick = useCallback(() => {
        setShowQuitConfirm(true);
    }, []);

    // Handle quit confirmation
    const handleQuitConfirm = useCallback(() => {
        setShowQuitConfirm(false);
        useGameStore.getState().endGame(false, true);
    }, []);

    // Handle quit cancel
    const handleQuitCancel = useCallback(() => {
        setShowQuitConfirm(false);
    }, []);

    const handleSubmit = useCallback(() => {
        const result = submitAnswer();
        if (result.correct) {
            setFeedback(getCorrectFeedback(result));
            setTimeout(() => handleFeedbackComplete(result.gameEnding || false), 1000);
        } else {
            setFeedback({
                type: 'incorrect',
                message: `WRONG... ANSWER: ${result.correctWaits.join(', ')}`,
            });
            setTimeout(() => handleFeedbackComplete(result.gameEnding || false), 2000);
        }
    }, [submitAnswer, getCorrectFeedback, handleFeedbackComplete]);

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
                    <div>
                        <span className={styles.modeLabel}>{mode.toUpperCase()}</span>
                        <span className={styles.difficultyLabel}>{difficulty.toUpperCase()}</span>
                    </div>
                    <button className={styles.quitButton} onClick={handleQuitClick} aria-label="Quit game">
                        🏳️
                    </button>
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
            <GameTimer gameEndTime={gameEndTime} mode={mode} isPlaying={isPlaying} countdown={countdown} />
            {/* Game Area */}
            <div className={styles.gameArea}>
                <div className={styles.contentWrapper}>
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
                                <Tile key={num} tile={num} onToggle={toggleWait} selected={selectedWaits.includes(num)} />
                            ))}
                        </div>
                    </div>
                </div>
                <GameButton variant="primary" size="lg" onClick={handleSubmit} className={styles.submitBtn} fullWidth>
                    ANSWER
                </GameButton>
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
            {/* Quit Confirmation Dialog */}
            <AnimatePresence>
                {showQuitConfirm && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className={styles.quitOverlay}
                    >
                        <motion.div
                            initial={{ scale: 0.8, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.8, opacity: 0 }}
                            className={styles.quitDialog}
                        >
                            <p className={styles.quitMessage}>GIVE UP?</p>
                            <div className={styles.quitButtons}>
                                <GameButton variant="secondary" size="md" onClick={handleQuitCancel}>
                                    NO
                                </GameButton>
                                <GameButton variant="danger" size="md" onClick={handleQuitConfirm}>
                                    YES
                                </GameButton>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
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
