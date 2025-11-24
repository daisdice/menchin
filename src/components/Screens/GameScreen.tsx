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
        timeLeft,
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

        const interval = setInterval(() => {
            tick();
        }, 1000);

        return () => clearInterval(interval);
    }, [isPlaying, isGameOver, navigate, tick]);

    useEffect(() => {
        if (!isPlaying) return;

        // Check end conditions based on mode
        if (mode === 'sprint') {
            // SPRINT: End when time runs out
            if (timeLeft <= 0) {
                // Handled by store tick/endGame now
            }
        } else if (mode === 'classic') {
            // CLASSIC: End handled in store (10 wins) or lives run out
            if (lives <= 0) {
                // Handled by store submitAnswer/endGame now
            }
        } else {
            // SURVIVAL, PRACTICE: End when lives run out (except practice has infinite lives)
            if (lives <= 0) {
                // Handled by store submitAnswer/endGame now
            }
        }
    }, [timeLeft, lives, navigate, isPlaying, mode]);

    const handleSubmit = () => {
        const result = submitAnswer();

        if (result.correct) {
            const bonusText = result.bonuses?.join(' & ') || '';
            setFeedback({
                type: 'correct',
                message: 'CORRECT!',
                subMessage: bonusText ? `${bonusText} BONUS! +${result.points}` : `+${result.points}`
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
            {/* Header */}
            <div className={styles.header}>
                <div className={styles.modeInfo}>
                    <span className={styles.modeLabel}>{mode.toUpperCase()}</span>
                    <span className={styles.difficultyLabel}>{difficulty.toUpperCase()}</span>
                </div>

                <div className={styles.statsGroup}>
                    <div className={styles.statItem}>
                        <span className={styles.statLabel}>TIME</span>
                        <span className={styles.statValue}>{timeLeft}</span>
                    </div>
                    <div className={styles.statItem}>
                        <span className={styles.statLabel}>SCORE</span>
                        <span className={styles.statValue}>{Math.floor(score)}</span>
                    </div>
                    {mode === 'classic' ? (
                        <div className={styles.statItem}>
                            <span className={styles.statLabel}>PROGRESS</span>
                            <span className={styles.statValue}>{correctCount}/10</span>
                        </div>
                    ) : (
                        <div className={styles.statItem}>
                            <span className={styles.statLabel}>LIFE</span>
                            <span className={styles.lives}>{'❤️'.repeat(lives)}</span>
                        </div>
                    )}
                </div>
            </div>

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
