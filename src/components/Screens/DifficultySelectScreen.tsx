import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { GameButton } from '../UI/GameButton';
import { useGameStore } from '../../store/useGameStore';
import type { Difficulty, GameMode } from '../../store/useGameStore';
import { useAppStore } from '../../store/useAppStore';
import styles from './DifficultySelectScreen.module.css';

export const DifficultySelectScreen: React.FC = () => {
    const navigate = useNavigate();
    const { mode } = useParams<{ mode: GameMode }>();
    const startGame = useGameStore(state => state.startGame);
    const unlockedDifficulties = useAppStore(state => state.unlockedDifficulties);

    const handleStart = (difficulty: Difficulty) => {
        if (mode) {
            startGame(mode, difficulty);
            navigate('/game');
        }
    };

    const difficulties: { id: Difficulty; label: string; waits: string; color: 'secondary' | 'primary' | 'accent' | 'danger' }[] = [
        { id: 'beginner', label: 'BEGINNER', waits: '1-5 Waits', color: 'secondary' },
        { id: 'amateur', label: 'AMATEUR', waits: '1-5 Waits', color: 'primary' },
        { id: 'normal', label: 'NORMAL', waits: '1-5 Waits', color: 'primary' },
        { id: 'expert', label: 'EXPERT', waits: '3-7 Waits', color: 'accent' },
        { id: 'master', label: 'MASTER', waits: '5-9 Waits', color: 'danger' },
    ];

    return (
        <div className={styles.container}>
            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className={styles.header}
            >
                <h2 className={styles.title}>SELECT LEVEL</h2>
                <p className={styles.subtitle}>{mode?.toUpperCase()} MODE</p>
            </motion.div>

            <div className={styles.list}>
                {difficulties.map((diff, index) => {
                    const isUnlocked = unlockedDifficulties.includes(diff.id);
                    return (
                        <motion.div
                            key={diff.id}
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: index * 0.1 }}
                            className={styles.item}
                        >
                            <GameButton
                                variant={diff.color}
                                onClick={() => isUnlocked && handleStart(diff.id)}
                                disabled={!isUnlocked}
                                className={!isUnlocked ? styles.locked : ''}
                                fullWidth
                            >
                                <div className={styles.buttonContent}>
                                    <span className={styles.label}>
                                        {diff.label}
                                        {!isUnlocked && <span className={styles.lockIcon}>🔒</span>}
                                    </span>
                                    <span className={styles.waits}>{diff.waits}</span>
                                </div>
                            </GameButton>
                        </motion.div>
                    );
                })}
            </div>

            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
                className={styles.footer}
            >
                <GameButton variant="secondary" size="sm" onClick={() => navigate('/mode')}>
                    BACK
                </GameButton>
            </motion.div>
        </div>
    );
};
