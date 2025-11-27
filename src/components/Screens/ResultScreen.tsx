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
    const { saveScore } = useAppStore();

    const isNewRecord = React.useMemo(() => {
        const currentScores = useAppStore.getState().highScores[difficulty] || [];
        const currentHigh = currentScores.length > 0 ? currentScores[0].score : 0;
        return score > currentHigh;
    }, [score, difficulty]);

    useEffect(() => {
        saveScore(difficulty, score);
    }, [score, difficulty, saveScore]);

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
        const status = isClear ? 'CLEARED! 🎉' : 'FAILED... 😢';
        let text = `🀄 CHIN'IT (${mode.toUpperCase()} - ${difficulty.toUpperCase()}) ${status}\n\n`;

        if (mode === 'sprint') {
            text += `⏱️ CLEAR TIME: ${score.toFixed(2)}s\n`;
        } else if (mode === 'survival') {
            text += `🔥 SURVIVED: ${score} Hands\n`;
        } else {
            text += `🏆 TOTAL SCORE: ${Math.floor(score)} pts\n`;
            if (lastScoreBreakdown) {
                text += `(Base: ${lastScoreBreakdown.baseScore}, Clear: ${lastScoreBreakdown.clearBonus}, Life: ${lastScoreBreakdown.lifeBonus}, Time: ${lastScoreBreakdown.timeBonus})\n`;
            }
        }

        text += `\nhttps://daisdice.github.io/menchin/\n#CHINIT #Mahjong`;
        const url = `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}`;
        window.open(url, '_blank');
    };

    // Animation variants
    const itemVariants = {
        hidden: { opacity: 0, x: -20 },
        visible: (i: number) => ({
            opacity: 1,
            x: 0,
            transition: { delay: i * 0.5 }
        })
    };

    const [displayScore, setDisplayScore] = React.useState(0);

    useEffect(() => {
        if (lastScoreBreakdown) {
            const sequence = [
                { val: lastScoreBreakdown.baseScore, delay: 0 },
                { val: lastScoreBreakdown.clearBonus, delay: 500 },
                { val: lastScoreBreakdown.lifeBonus, delay: 1000 },
                { val: lastScoreBreakdown.timeBonus, delay: 1500 }
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
                {/* Score List (Vertical) */}
                <div className={styles.scoreList}>
                    {/* SPRINT mode: show clear time */}
                    {mode === 'sprint' ? (
                        <>
                            {lastScoreBreakdown?.sprintTimes?.map((time, index) => (
                                <motion.div
                                    key={index}
                                    className={styles.scoreRow}
                                    variants={itemVariants}
                                    initial="hidden"
                                    animate="visible"
                                    custom={index * 0.1}
                                >
                                    <span className={styles.label}>HAND {index + 1}</span>
                                    <span className={styles.value}>{time.toFixed(2)}s</span>
                                </motion.div>
                            ))}

                            <div className={styles.divider} />

                            <motion.div
                                className={`${styles.scoreRow} ${styles.totalRow}`}
                                variants={itemVariants}
                                initial="hidden"
                                animate="visible"
                                custom={1.5}
                            >
                                <div className={styles.totalScoreContainer}>
                                    <span className={styles.totalLabel}>CLEAR TIME</span>
                                    <div className={styles.totalValueContainer}>
                                        <motion.span
                                            className={styles.totalValue}
                                            initial={{ scale: 1.1 }}
                                            animate={{ scale: 1 }}
                                            transition={{ duration: 0.1 }}
                                        >
                                            {score.toFixed(2)}s
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
                                </div>
                            </motion.div>
                        </>
                    ) : mode === 'survival' ? (
                        <motion.div
                            className={`${styles.scoreRow} ${styles.totalRow}`}
                            variants={itemVariants}
                            initial="hidden"
                            animate="visible"
                            custom={0}
                        >
                            <div className={styles.totalScoreContainer}>
                                <span className={styles.totalLabel}>CLEARED</span>
                                <div className={styles.totalValueContainer}>
                                    <motion.span
                                        className={styles.totalValue}
                                        initial={{ scale: 1.1 }}
                                        animate={{ scale: 1 }}
                                        transition={{ duration: 0.1 }}
                                    >
                                        {score} Hands
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
                            </div>
                        </motion.div>

                    ) : mode === 'practice' ? (
                        <>
                            <motion.div
                                className={styles.scoreRow}
                                variants={itemVariants}
                                initial="hidden"
                                animate="visible"
                                custom={0}
                            >
                                <span className={styles.label}>CORRECT</span>
                                <span className={styles.value}>{lastScoreBreakdown?.baseScore}</span>
                            </motion.div>
                            <motion.div
                                className={styles.scoreRow}
                                variants={itemVariants}
                                initial="hidden"
                                animate="visible"
                                custom={0.1}
                            >
                                <span className={styles.label}>INCORRECT</span>
                                <span className={styles.value}>{lastScoreBreakdown?.incorrectCount}</span>
                            </motion.div>
                            <div className={styles.divider} />
                            <motion.div
                                className={`${styles.scoreRow} ${styles.totalRow}`}
                                variants={itemVariants}
                                initial="hidden"
                                animate="visible"
                                custom={0.2}
                            >
                                <div className={styles.totalScoreContainer}>
                                    <span className={styles.totalLabel}>TOTAL</span>
                                    <div className={styles.totalValueContainer}>
                                        <span className={styles.totalValue}>{lastScoreBreakdown?.totalQuestions}</span>
                                    </div>
                                </div>
                            </motion.div>
                        </>
                    ) : (
                        <>
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

                            {/* Bonuses (Only if breakdown exists and not SPRINT) */}
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

                                    {lastScoreBreakdown.lives > 0 && (
                                        <motion.div
                                            className={styles.scoreRow}
                                            variants={itemVariants}
                                            initial="hidden"
                                            animate="visible"
                                            custom={1.5}
                                        >
                                            <span className={styles.label}>LIVES LEFT</span>
                                            <span className={styles.value}>{lastScoreBreakdown.lives}</span>
                                        </motion.div>
                                    )}

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

                                    {lastScoreBreakdown.timeLeft > 0 && (
                                        <motion.div
                                            className={styles.scoreRow}
                                            variants={itemVariants}
                                            initial="hidden"
                                            animate="visible"
                                            custom={2.5}
                                        >
                                            <span className={styles.label}>TIME LEFT</span>
                                            <span className={styles.value}>{lastScoreBreakdown.timeLeft}s</span>
                                        </motion.div>
                                    )}

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
                                <div className={styles.totalScoreContainer}>
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
                                </div>
                            </motion.div>
                        </>
                    )}
                </div>

                <div className={styles.actions}>
                    <GameButton variant="primary" onClick={handleRetry} fullWidth>
                        RETRY
                    </GameButton>
                    <GameButton variant="secondary" onClick={handleTitle} fullWidth>
                        TITLE
                    </GameButton>
                    {mode !== 'practice' && (
                        <GameButton variant="accent" onClick={handleShare} fullWidth>
                            SHARE
                        </GameButton>
                    )}
                </div>
            </Card >
        </div >
    );
};
