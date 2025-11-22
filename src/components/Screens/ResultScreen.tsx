import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useGameStore } from '../../store/useGameStore';
import { useAppStore } from '../../store/useAppStore';
import { BrushButton } from '../UI/BrushButton';
import { Card } from '../UI/Card';
import styles from './ResultScreen.module.css';

export const ResultScreen: React.FC = () => {
    const navigate = useNavigate();
    const { score, difficulty, reset, startGame } = useGameStore();
    const { saveScore, unlockDifficulty } = useAppStore();

    const [isNewRecord, setIsNewRecord] = useState(false);
    const [unlocked, setUnlocked] = useState<string | null>(null);

    useEffect(() => {
        // Save score and check for records
        const newRecord = saveScore(difficulty, Math.floor(score));
        setIsNewRecord(newRecord);

        // Check for unlocks
        if (difficulty === 'easy' && score >= 10) {
            unlockDifficulty('normal');
            setUnlocked('中級');
        } else if (difficulty === 'normal' && score >= 15) {
            unlockDifficulty('hard');
            setUnlocked('上級');
        }
    }, [difficulty, score, saveScore, unlockDifficulty]);

    const handleRetry = () => {
        reset();
        startGame(difficulty);
        navigate('/game');
    };

    const handleTitle = () => {
        reset();
        navigate('/');
    };

    const handleShare = () => {
        const text = `清一問【${difficulty}】でスコア${Math.floor(score)}を獲得しました！ #清一問 #麻雀`;
        const url = `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}`;
        window.open(url, '_blank');
    };

    return (
        <div className={styles.container}>
            <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5 }}
                className={styles.content}
            >
                <h1 className={styles.title}>終局</h1>

                <Card className={styles.resultCard}>
                    <div className={styles.scoreContainer}>
                        <span className={styles.scoreLabel}>スコア</span>
                        <span className={styles.scoreValue}>{Math.floor(score)}</span>
                    </div>

                    {isNewRecord && (
                        <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            className={styles.newRecord}
                        >
                            新記録達成！
                        </motion.div>
                    )}

                    {unlocked && (
                        <motion.div
                            initial={{ x: -50, opacity: 0 }}
                            animate={{ x: 0, opacity: 1 }}
                            className={styles.unlockMsg}
                        >
                            🎉 {unlocked}モード 解放！
                        </motion.div>
                    )}
                </Card>

                <div className={styles.actions}>
                    <BrushButton variant="primary" onClick={handleRetry}>
                        もう一度
                    </BrushButton>
                    <BrushButton variant="secondary" onClick={handleTitle}>
                        タイトルへ
                    </BrushButton>
                    <BrushButton variant="accent" onClick={handleShare}>
                        Xで共有
                    </BrushButton>
                </div>
            </motion.div>
        </div>
    );
};
