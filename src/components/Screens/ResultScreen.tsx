import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useGameStore } from '../../store/useGameStore';
import { GameButton } from '../UI/GameButton';
import { Card } from '../UI/Card';
import { TrophyToastContainer } from '../UI/TrophyToastContainer';
import { Toast } from '../UI/Toast';
import styles from './ResultScreen.module.css';

export const ResultScreen: React.FC = () => {
    const navigate = useNavigate();
    const { mode, difficulty, score, isClear, lastScoreBreakdown, isNewRecord, newlyUnlockedTrophies, previousBestScore, clearNewlyUnlockedTrophies, resetGame } = useGameStore();

    const handleRetry = () => {
        clearNewlyUnlockedTrophies();
        resetGame();
        useGameStore.getState().startGame(mode, difficulty);
        navigate('/game');
    };

    const handleTitle = () => {
        clearNewlyUnlockedTrophies();
        resetGame();
        navigate('/');
    };

    const [showToast, setShowToast] = React.useState(false);

    const handleShare = async () => {
        const status = isClear ? 'CLEARED! 🎉' : 'FAILED... 😢';
        let text = `🀄 CHIN'IT (${mode.toUpperCase()} - ${difficulty.toUpperCase()}) ${status}\n\n`;

        if (mode === 'sprint') {
            text += `⏱️ CLEAR TIME: ${score.toFixed(2)}s\n`;
        } else if (mode === 'survival') {
            text += `🔥 SURVIVED: ${score} Hands\n`;
        } else {
            text += `🏆 TOTAL SCORE: ${Math.floor(score)} pts\n`;
            if (lastScoreBreakdown) {
                text += `(Base: ${lastScoreBreakdown.baseScore}, Life: ${lastScoreBreakdown.lifeBonus}, Time: ${lastScoreBreakdown.timeBonus})\n`;
            }
        }

        text += `\nhttps://daisdice.github.io/menchin/\n#CHINIT #麻雀`;

        if (navigator.share) {
            try {
                await navigator.share({
                    title: "CHIN'IT",
                    text: text,
                });
            } catch (err) {
                console.error('Error sharing:', err);
            }
        } else {
            try {
                await navigator.clipboard.writeText(text);
                setShowToast(true);
                setTimeout(() => setShowToast(false), 2000);
            } catch (err) {
                console.error('Failed to copy:', err);
                // Fallback to Twitter intent if clipboard fails or as a secondary option?
                // For now, let's keep the original Twitter behavior as a last resort or just rely on clipboard.
                // The original code opened a Twitter URL. Let's keep that logic if share/clipboard fails?
                // Actually, the requirement says "PCではクリップボードコピー".
                // Let's stick to clipboard for now.
                const url = `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}`;
                window.open(url, '_blank');
            }
        }
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
        const timers: number[] = [];

        if (lastScoreBreakdown) {
            setDisplayScore(0); // Reset to 0 before animation
            const sequence = [
                { val: lastScoreBreakdown.baseScore, delay: 0 },
                { val: lastScoreBreakdown.lifeBonus, delay: 500 },
                { val: lastScoreBreakdown.timeBonus, delay: 1000 }
            ];

            sequence.forEach((item) => {
                const timer = setTimeout(() => {
                    setDisplayScore(prev => prev + item.val);
                }, item.delay);
                timers.push(timer);
            });
        } else {
            setDisplayScore(score);
        }

        return () => {
            timers.forEach(timer => clearTimeout(timer));
        };
    }, [lastScoreBreakdown]);

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
                {mode !== 'practice' && (
                    <div className={styles.statusSection}>
                        {isClear ? (
                            <h1 className={styles.statusClear}>CLEAR!!</h1>
                        ) : (
                            <h1 className={styles.statusFailed}>FAILED...</h1>
                        )}
                    </div>
                )}

                {/* Score List (Vertical) */}
                {/* Score List (Vertical) */}
                <div className={styles.scoreList}>
                    {/* SPRINT mode: show clear time */}
                    {mode === 'sprint' ? (
                        <>
                            <div className={styles.sprintGrid}>
                                {lastScoreBreakdown?.sprintTimes?.map((time, index) => (
                                    <motion.div
                                        key={index}
                                        className={styles.sprintRow}
                                        variants={itemVariants}
                                        initial="hidden"
                                        animate="visible"
                                        custom={index * 0.1}
                                    >
                                        <span className={styles.label}>HAND {index + 1}</span>
                                        <span className={styles.value}>{time.toFixed(2)}s</span>
                                    </motion.div>
                                ))}
                            </div>

                            <div className={styles.divider} />

                            <motion.div
                                className={styles.scoreRow}
                                variants={itemVariants}
                                initial="hidden"
                                animate="visible"
                                custom={1.2}
                            >
                                <span className={styles.label}>PREVIOUS BEST</span>
                                <span className={styles.value}>
                                    {previousBestScore === undefined || previousBestScore === null || previousBestScore === Infinity ? '---' : `${previousBestScore.toFixed(2)}s`}
                                </span>
                            </motion.div>

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
                        <>
                            <motion.div
                                className={styles.scoreRow}
                                variants={itemVariants}
                                initial="hidden"
                                animate="visible"
                                custom={-0.5}
                            >
                                <span className={styles.label}>PREVIOUS BEST</span>
                                <span className={styles.value}>
                                    {previousBestScore === undefined || previousBestScore === null || previousBestScore === 0 ? '---' : `${previousBestScore} Hands`}
                                </span>
                            </motion.div>
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
                        </>

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
                                <span className={styles.value}>{lastScoreBreakdown?.totalScore}</span>
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

                            <motion.div
                                className={styles.scoreRow}
                                variants={itemVariants}
                                initial="hidden"
                                animate="visible"
                                custom={3.5}
                            >
                                <span className={styles.label}>PREVIOUS BEST</span>
                                <span className={styles.value}>
                                    {previousBestScore === undefined || previousBestScore === null || previousBestScore === 0 ? '---' : Math.floor(previousBestScore)}
                                </span>
                            </motion.div>

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
            </Card>

            {/* Trophy Toast Notifications */}
            {newlyUnlockedTrophies.length > 0 && (
                <TrophyToastContainer trophyIds={newlyUnlockedTrophies} />
            )}

            <Toast
                message="Copied to clipboard!"
                isVisible={showToast}
                icon="📋"
            />
        </div>
    );
};
