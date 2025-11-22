import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { GameButton } from '../UI/GameButton';
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

    const difficulties: { id: Difficulty; label: string; color: 'secondary' | 'primary' | 'danger' }[] = [
        { id: 'easy', label: 'EASY', color: 'secondary' },
        { id: 'normal', label: 'NORMAL', color: 'primary' },
        { id: 'hard', label: 'HARD', color: 'danger' },
    ];

    return (
        <div className={styles.container}>
            <motion.div
                initial={{ opacity: 0, scale: 0.5 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ type: "spring", stiffness: 200, damping: 15 }}
                className={styles.titleContainer}
            >
                <h1 className={styles.title}>CHIN'IT</h1>
                <p className={styles.subtitle}>チンイット</p>
            </motion.div>

            <motion.div
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className={styles.menuContainer}
            >
                <div className={styles.difficultySection}>
                    <h2 className={styles.sectionTitle}>TIME ATTACK</h2>
                    <div className={styles.buttonGroup}>
                        {difficulties.map((diff) => {
                            const isUnlocked = unlockedDifficulties.includes(diff.id);
                            return (
                                <GameButton
                                    key={diff.id}
                                    variant={diff.color}
                                    onClick={() => isUnlocked && handleStartGame(diff.id)}
                                    disabled={!isUnlocked}
                                    className={!isUnlocked ? styles.locked : ''}
                                    fullWidth
                                >
                                    {diff.label}
                                    {!isUnlocked && <span className={styles.lockIcon}>🔒</span>}
                                </GameButton>
                            );
                        })}
                    </div>
                </div>

                <div className={styles.menuSection}>
                    <GameButton variant="accent" size="sm" onClick={() => navigate('/ranking')}>
                        RANKING
                    </GameButton>
                    <GameButton variant="accent" size="sm" onClick={() => navigate('/stats')}>
                        RECORD
                    </GameButton>
                    <GameButton variant="accent" size="sm" onClick={() => navigate('/trophies')}>
                        COLLECTION
                    </GameButton>
                </div>
            </motion.div>
        </div>
    );
};
