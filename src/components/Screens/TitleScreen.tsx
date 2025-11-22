import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { BrushButton } from '../UI/BrushButton';
import { useGameStore } from '../../store/useGameStore';
import type { Difficulty } from '../../store/useGameStore';
import { useAppStore } from '../../store/useAppStore';
import styles from './TitleScreen.module.css';

export const TitleScreen: React.FC = () => {
    const navigate = useNavigate();
    const startGame = useGameStore(state => state.startGame);
    const unlockedDifficulties = useAppStore(state => state.unlockedDifficulties);

    const handleStartGame = (difficulty: Difficulty) => {
        startGame(difficulty);
        navigate('/game');
    };

    const difficulties: { id: Difficulty; label: string; color: 'primary' | 'secondary' | 'accent' }[] = [
        { id: 'easy', label: '初級', color: 'secondary' },
        { id: 'normal', label: '中級', color: 'primary' },
        { id: 'hard', label: '上級', color: 'accent' },
    ];

    return (
        <div className={styles.container}>
            <motion.div
                initial={{ opacity: 0, y: -50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1 }}
                className={styles.titleContainer}
            >
                <h1 className={styles.title}>清一問</h1>
                <p className={styles.subtitle}>瞬解・多面張</p>
            </motion.div>

            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5, duration: 0.8 }}
                className={styles.menuContainer}
            >
                <div className={styles.difficultySection}>
                    <h2 className={styles.sectionTitle}>難易度選択</h2>
                    <div className={styles.buttonGroup}>
                        {difficulties.map((diff) => {
                            const isUnlocked = unlockedDifficulties.includes(diff.id);
                            return (
                                <BrushButton
                                    key={diff.id}
                                    variant={diff.color}
                                    onClick={() => isUnlocked && handleStartGame(diff.id)}
                                    disabled={!isUnlocked}
                                    className={!isUnlocked ? styles.locked : ''}
                                >
                                    {diff.label}
                                    {!isUnlocked && <span className={styles.lockIcon}>🔒</span>}
                                </BrushButton>
                            );
                        })}
                    </div>
                </div>

                <div className={styles.menuSection}>
                    <BrushButton variant="secondary" size="sm" onClick={() => navigate('/ranking')}>
                        ランキング
                    </BrushButton>
                    <BrushButton variant="secondary" size="sm" onClick={() => navigate('/stats')}>
                        プレイデータ
                    </BrushButton>
                    <BrushButton variant="secondary" size="sm" onClick={() => navigate('/trophies')}>
                        トロフィー
                    </BrushButton>
                </div>
            </motion.div>
        </div>
    );
};
