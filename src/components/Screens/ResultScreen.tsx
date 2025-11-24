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
    const { score, difficulty, mode, resetGame, lastScoreBreakdown, isClear } = useGameStore();
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
            unlockDifficulty('amateur');
        } else if (difficulty === 'amateur' && score >= 15) {
            unlockDifficulty('normal');
        } else if (difficulty === 'normal' && score >= 20) {
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

    // Animation variants
    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.15,
                delayChildren: 0.3
            }
        }
    };

    const itemVariants = {
        hidden: { opacity: 0, x: -20 },
        visible: { opacity: 1, x: 0 }
    };

    const [displayScore, setDisplayScore] = React.useState(0);

    useEffect(() => {
        if (lastScoreBreakdown) {
            let current = 0;
            const sequence = [
                { val: lastScoreBreakdown.baseScore, delay: 500 },
                { val: lastScoreBreakdown.clearBonus, delay: 1000 },
                { val: lastScoreBreakdown.lifeBonus, delay: 1500 },
                { val: lastScoreBreakdown.timeBonus, delay: 2000 }
            ];

            sequence.forEach((item) => {
                setTimeout(() => {
                    setDisplayScore(prev => prev + item.val);
                }, item.delay);
            });
        } else {
            setDisplayScore(score);
        }
    }, [lastScoreBreakdown, score]);

    return (
        <div className={styles.container}>
            <Card className={styles.resultCard}>
                {/* Header Section */}
                <div className={styles.headerSection}>
                    <h2 className={styles.title}>RESULT</h2>
                    <div className={styles.badges}>
                        <span className={styles.modeBadge}>{mode.toUpperCase()}</span>
                        <span className={styles.difficultyBadge}>{difficulty.toUpperCase()}</span>
                    </div>
                </div>

                {/* Status Section */}
                <div className={styles.statusSection}>
                    {isClear ? (
                        <h1 className={styles.statusClear}>CLEAR!!</h1>
                    ) : (
                        <h1 className={styles.statusFailed}>FAILED...</h1>
                    )}
                </div>

                {/* Score List (Vertical) */}
                <div className={styles.scoreList}>
                    {/* Base Score */}
                    <motion.div
                        className={styles.scoreRow}
                        variants={itemVariants}
                        initial="hidden"
                        animate="visible"
                        custom={0}
                    >
                        <span className={styles.label}>SCORE</span>
                        <span className={styles.value}>{Math.floor(lastScoreBreakdown ? lastScoreBreakdown.baseScore : score)}</span>
                    </motion.div>

                    {/* Bonuses (Only if breakdown exists) */}
                    {lastScoreBreakdown && (
                        <>
                            <motion.div
                                className={styles.scoreRow}
                                variants={itemVariants}
                                initial="hidden"
                                animate="visible"
                                custom={1}
                            >
                                <span className={styles.label}>CLEAR BONUS</span>
                                <span className={styles.value}>+{Math.floor(lastScoreBreakdown.clearBonus)}</span>
                            </motion.div>

                            <motion.div
                                className={styles.scoreRow}
                                variants={itemVariants}
                                initial="hidden"
                                animate="visible"
                                custom={2}
                            >
                                <span className={styles.label}>LIFE BONUS</span>
                                <span className={styles.value}>+{Math.floor(lastScoreBreakdown.lifeBonus)}</span>
                            </motion.div>

                            <motion.div
                                className={styles.scoreRow}
                                variants={itemVariants}
                                initial="hidden"
                                animate="visible"
                                custom={3}
                            >
                                <span className={styles.label}>TIME BONUS</span>
                                <span className={styles.value}>+{Math.floor(lastScoreBreakdown.timeBonus)}</span>
                            </motion.div>
                        </>
                    )}

                    {/* Divider */}
                    <div className={styles.divider} />

                    {/* Total Score */}
                    <motion.div
                        className={`${styles.scoreRow} ${styles.totalRow}`}
                        variants={itemVariants}
                        initial="hidden"
                        animate="visible"
                        custom={4}
                    >
                        <span className={styles.totalLabel}>TOTAL SCORE</span>
                        <div className={styles.totalValueContainer}>
                            <motion.span
                                className={styles.totalValue}
                                key={displayScore}
                                initial={{ scale: 1.1 }}
                                animate={{ scale: 1 }}
                                transition={{ duration: 0.1 }}
                            >
                                {Math.floor(displayScore)}
                            </motion.span>
                            {isNewRecord && (
                                <motion.span
                                    initial={{ scale: 0, opacity: 0 }}
                                    animate={{ scale: 1, opacity: 1 }}
                                    className={styles.newRecordBadge}
                                >
                                    NEW RECORD!
                                </motion.span>
                            )}
                        </div>
                    </motion.div>
                </div>

                {/* Unlock Notification */}
                {difficulty === 'beginner' && score >= 10 && !unlockedDifficulties.includes('amateur') && (
                    <div className={styles.unlockMessage}>AMATEUR UNLOCKED!</div>
                )}
                {difficulty === 'amateur' && score >= 15 && !unlockedDifficulties.includes('normal') && (
                    <div className={styles.unlockMessage}>NORMAL UNLOCKED!</div>
                )}
                {difficulty === 'normal' && score >= 20 && !unlockedDifficulties.includes('expert') && (
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
