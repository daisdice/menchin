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
        tick
    } = useGameStore();

    const [feedback, setFeedback] = useState<{ type: 'correct' | 'incorrect'; message: string } | null>(null);

    useEffect(() => {
        if (!isPlaying) {
            navigate('/');
        }

        const interval = setInterval(() => {
            tick();
        }, 1000);

        return () => clearInterval(interval);
    }, [isPlaying, navigate, tick]);

    useEffect(() => {
        if (timeLeft <= 0 || lives <= 0) {
            navigate('/result');
        }
    }, [timeLeft, lives, navigate]);

    const handleSubmit = () => {
        const result = submitAnswer();

        if (result.correct) {
            setFeedback({ type: 'correct', message: 'CORRECT!' });
            setTimeout(() => {
                setFeedback(null);
                useGameStore.getState().nextHand();
            }, 500);
        } else {
            setFeedback({ type: 'incorrect', message: `WRONG... ANSWER: ${result.correctWaits.join(', ')}` });
            setTimeout(() => {
                setFeedback(null);
                useGameStore.getState().nextHand();
            }, 2000);
        }
    };

    return (
        <div className={styles.container}>
            {/* Header */}
            <div className={styles.header}>
                <div className={styles.statItem}>
                    <span className={styles.statLabel}>TIME</span>
                    <span className={styles.statValue}>{timeLeft}</span>
                </div>
                <div className={styles.statItem}>
                    <span className={styles.statLabel}>SCORE</span>
                    <span className={styles.statValue}>{Math.floor(score)}</span>
                </div>
                <div className={styles.statItem}>
                    <span className={styles.statLabel}>LIFE</span>
                    <span className={styles.lives}>{'❤️'.repeat(lives)}</span>
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
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};
