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
        isGameOver
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
            const timer = setTimeout(() => {
                setCountdown(countdown - 1);
            }, 1000);
            return () => clearTimeout(timer);
        } else {
            // Countdown finished, start the game timer
            const timer = setTimeout(() => {
                setCountdown(null);
                // Initialize game timer after countdown
                const duration = mode === 'challenge' ? 120 : mode === 'sprint' ? 60 : 0;
                if (duration > 0) {
                    const newEndTime = Date.now() + duration * 1000;
                    useGameStore.setState({ gameEndTime: newEndTime, timeLeft: duration });
                }
            }, 500);
            return () => clearTimeout(timer);
        }
    }, [countdown, isPlaying, mode]);

    // High precision timer
    useEffect(() => {
        // Don't run during countdown
        if (countdown !== null) {
            setDisplayTime('120.00');
            return;
        }

        if (!isPlaying || gameEndTime === 0) return;

        let animationFrameId: number;

        const updateTimer = () => {
            const now = Date.now();
            const remaining = Math.max(0, gameEndTime - now);
            const seconds = Math.floor(remaining / 1000);
            const centiseconds = Math.floor((remaining % 1000) / 10);
            setDisplayTime(`${seconds}.${centiseconds.toString().padStart(2, '0')}`);

            if (remaining > 0) {
                animationFrameId = requestAnimationFrame(updateTimer);
            }
        };

        updateTimer();

        return () => {
            if (animationFrameId) cancelAnimationFrame(animationFrameId);
        };
    }, [isPlaying, gameEndTime, countdown]);

    useEffect(() => {
        // If game is over, go to result
        if (isGameOver) {
            navigate('/result');
            return;
        }

        // If not playing and not game over, go to title (prevent direct access)
        if (!isPlaying) {
            navigate('/');
            return;
        }

        // Don't tick during countdown
        if (countdown !== null) return;

        const interval = setInterval(() => {
            tick();
        }, 100); // Check tick more frequently for end condition

        return () => clearInterval(interval);
    }, [isPlaying, isGameOver, navigate, tick, countdown]);

    useEffect(() => {
        if (!isPlaying) return;

        // Check end conditions based on mode
        if (mode === 'sprint' || mode === 'challenge') {
            // Time check handled by tick/gameEndTime
        } else {
            // SURVIVAL, PRACTICE: End when lives run out (except practice has infinite lives)
            if (lives <= 0) {
                // Handled by store submitAnswer/endGame now
            }
        }
    }, [lives, navigate, isPlaying, mode]);

    const handleSubmit = () => {
        const result = submitAnswer();

        if (result.correct) {
            const bonusText = result.bonuses?.join(' & ') || '';
            const baseScoreDisplay = `+${result.points! - (bonusText.includes('FAST') ? 300 : 0)}`;
            const bonusDisplay = bonusText ? `FAST BONUS +300` : '';

            setFeedback({
                type: 'correct',
                message: 'CORRECT!',
                subMessage: bonusDisplay ? `${baseScoreDisplay}  ${bonusDisplay}` : baseScoreDisplay
            });
            setTimeout(() => {
                setFeedback(null);
                // Only next hand if game is still playing (store might have ended it)
                if (useGameStore.getState().isPlaying) {
                    useGameStore.getState().nextHand();
                } else {
                    // If game ended (e.g. cleared), store sets isGameOver=true, useEffect handles nav
                }
            }, 1000);
        } else {
            setFeedback({ type: 'incorrect', message: `WRONG... ANSWER: ${result.correctWaits.join(', ')}` });
            setTimeout(() => {
                setFeedback(null);
                if (useGameStore.getState().isPlaying) {
                    useGameStore.getState().nextHand();
                } else {
                    // If game ended (lives=0), store sets isGameOver=true, useEffect handles nav
                }
            }, 2000);
        }
    };

    return (
        <div className={styles.container}>
            {/* Debug Win Button (Top Left) */}
            <div
                style={{ position: 'absolute', top: 0, left: 0, width: 50, height: 50, zIndex: 9999, cursor: 'pointer' }}
                onClick={() => {
                    useGameStore.getState().endGame(true); // Force clear
                }}
            />
            {/* Header */}
            <div className={styles.header}>
                <div className={styles.modeInfo}>
                    <span className={styles.modeLabel}>{mode.toUpperCase()}</span>
                    <span className={styles.difficultyLabel}>{difficulty.toUpperCase()}</span>
                </div>

                <div className={styles.statsGroup}>
                    {/* Time removed from here, moved to prominent display */}
                    <div className={styles.statItem}>
                        <span className={styles.statLabel}>LIFE</span>
                        <span className={styles.lives}>{'❤️'.repeat(lives)}</span>
                    </div>
                    {mode === 'challenge' && (
                        <div className={styles.statItem}>
                            <span className={styles.statLabel}>PROGRESS</span>
                            <span className={styles.statValue}>{correctCount}/10</span>
                        </div>
                    )}
                    <div className={styles.statItem}>
                        <span className={styles.statLabel}>SCORE</span>
                        <span className={styles.statValue}>{Math.floor(score)}</span>
                    </div>
                </div>
            </div>

            {/* Prominent Time Display */}
            {(mode === 'challenge' || mode === 'sprint') && (
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
                            <Tile
                                key={num}
                                tile={num}
                                onClick={() => toggleWait(num)}
                                selected={selectedWaits.includes(num)}
                            />
                        ))}
                    </div>

                    <GameButton
                        variant="primary"
                        size="lg"
                        onClick={handleSubmit}
                        className={styles.submitBtn}
                        fullWidth
                    >
                        ANSWER
                    </GameButton>
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
                            <span className={styles.feedbackIcon}>
                                {feedback.type === 'correct' ? '⭕' : '❌'}
                            </span>
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
