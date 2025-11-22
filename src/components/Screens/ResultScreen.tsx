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
    const { score, difficulty, resetGame } = useGameStore();
    const { saveScore, unlockDifficulty, unlockedDifficulties } = useAppStore();

    const isNewRecord = React.useMemo(() => {
        const currentScores = useAppStore.getState().highScores[difficulty] || [];
        const currentHigh = currentScores.length > 0 ? currentScores[0].score : 0;
        return score > currentHigh;
    }, [score, difficulty]);

    useEffect(() => {
        saveScore(difficulty, score);

        // Unlock logic
        if (difficulty === 'easy' && score >= 10) {
            unlockDifficulty('normal');
        } else if (difficulty === 'normal' && score >= 15) {
            unlockDifficulty('hard');
        }
    }, [score, difficulty, saveScore, unlockDifficulty]);

    const handleRetry = () => {
        resetGame();
        useGameStore.getState().startGame(difficulty);
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
                    <span className={styles.scoreLabel}>SCORE</span>
                    <span className={styles.scoreValue}>{Math.floor(score)}</span>
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
                {difficulty === 'easy' && score >= 10 && !unlockedDifficulties.includes('normal') && (
                    <div className={styles.unlockMessage}>NORMAL UNLOCKED!</div>
                )}
                {difficulty === 'normal' && score >= 15 && !unlockedDifficulties.includes('hard') && (
                    <div className={styles.unlockMessage}>HARD UNLOCKED!</div>
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
