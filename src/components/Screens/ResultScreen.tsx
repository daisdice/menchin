import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useGameStore } from '../../store/useGameStore';
import { useAppStore } from '../../store/useAppStore';
import { GameButton } from '../UI/GameButton';
import { Card } from '../UI/Card';
import styles from './ResultScreen.module.css';

export const ResultScreen: React.FC = () => {
    const navigate = useNavigate();
    const { score, difficulty, mode, resetGame, lastScoreBreakdown } = useGameStore();
    const { saveScore, unlockDifficulty, unlockedDifficulties } = useAppStore();

    const isNewRecord = React.useMemo(() => {
        const currentScores = useAppStore.getState().highScores[difficulty] || [];
        const currentHigh = currentScores.length > 0 ? currentScores[0].score : 0;
        return score > currentHigh;
    }, [score, difficulty]);

    useEffect(() => {
        saveScore(difficulty, score);

        // Unlock logic
        if (difficulty === 'beginner' && score >= 10) {
            unlockDifficulty('normal');
        } else if (difficulty === 'normal' && score >= 15) {
            unlockDifficulty('advanced');
        } else if (difficulty === 'advanced' && score >= 20) {
            unlockDifficulty('expert');
        } else if (difficulty === 'expert' && score >= 25) {
            unlockDifficulty('master');
        }
    }, [score, difficulty, saveScore, unlockDifficulty]);

    const handleRetry = () => {
        resetGame();
        useGameStore.getState().startGame(mode, difficulty);
        navigate('/game');
    };

    const handleTitle = () => {
        resetGame();
        navigate('/');
    };

    const handleShare = () => {
        const text = `CHIN'IT (${difficulty.toUpperCase()}) SCORE: ${Math.floor(score)} pts! #CHINIT #Mahjong`;
        const url = `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}`;
        window.open(url, '_blank');
    };

    return (
        <div className={styles.container}>
            <Card className={styles.resultCard}>
                <h2 className={styles.title}>RESULT</h2>

                <div className={styles.scoreContainer}>
                    {lastScoreBreakdown ? (
                        <div className={styles.breakdown}>
                            <div className={styles.breakdownItem}>
                                <span>BASE SCORE</span>
                                <span>{Math.floor(lastScoreBreakdown.baseScore)}</span>
                            </div>
                            <div className={styles.breakdownItem}>
                                <span>TIME BONUS</span>
                                <span>+{Math.floor(lastScoreBreakdown.timeBonus)}</span>
                            </div>
                            <div className={styles.breakdownItem}>
                                <span>LIFE BONUS</span>
                                <span>+{Math.floor(lastScoreBreakdown.lifeBonus)}</span>
                            </div>
                            <div className={styles.breakdownItem}>
                                <span>CLEAR BONUS</span>
                                <span>+{Math.floor(lastScoreBreakdown.clearBonus)}</span>
                            </div>
                            <div className={styles.totalScore}>
                                <span>TOTAL</span>
                                <span className={styles.scoreValue}>{Math.floor(score)}</span>
                            </div>
                        </div>
                    ) : (
                        <>
                            <span className={styles.scoreLabel}>SCORE</span>
                            <span className={styles.scoreValue}>{Math.floor(score)}</span>
                        </>
                    )}
                </div>

                {isNewRecord && (
                    <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        className={styles.newRecord}
                    >
                        NEW RECORD!
                    </motion.div>
                )}

                {/* Unlock Notification */}
                {difficulty === 'beginner' && score >= 10 && !unlockedDifficulties.includes('normal') && (
                    <div className={styles.unlockMessage}>NORMAL UNLOCKED!</div>
                )}
                {difficulty === 'normal' && score >= 15 && !unlockedDifficulties.includes('advanced') && (
                    <div className={styles.unlockMessage}>ADVANCED UNLOCKED!</div>
                )}
                {difficulty === 'advanced' && score >= 20 && !unlockedDifficulties.includes('expert') && (
                    <div className={styles.unlockMessage}>EXPERT UNLOCKED!</div>
                )}
                {difficulty === 'expert' && score >= 25 && !unlockedDifficulties.includes('master') && (
                    <div className={styles.unlockMessage}>MASTER UNLOCKED!</div>
                )}

                <div className={styles.actions}>
                    <GameButton variant="primary" onClick={handleRetry} fullWidth>
                        RETRY
                    </GameButton>
                    <GameButton variant="secondary" onClick={handleTitle} fullWidth>
                        TITLE
                    </GameButton>
                    <GameButton variant="accent" onClick={handleShare} fullWidth>
                        SHARE
                    </GameButton>
                </div>
            </Card>
        </div>
    );
};
