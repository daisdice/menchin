import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { GameButton } from '../UI/GameButton';
import { useGameStore } from '../../store/useGameStore';
import type { Difficulty, GameMode } from '../../store/useGameStore';
import styles from './DifficultySelectScreen.module.css';

export const DifficultySelectScreen: React.FC = () => {
    const navigate = useNavigate();
    const { mode } = useParams<{ mode: GameMode }>();
    const startGame = useGameStore(state => state.startGame);

    const handleStart = (difficulty: Difficulty) => {
        if (mode) {
            startGame(mode, difficulty);
            navigate('/game');
        }
    };

    const difficulties: { id: Difficulty; label: string; color: 'secondary' | 'primary' | 'accent' | 'danger' | string }[] = [
        { id: 'beginner', label: 'BEGINNER', color: '#4ECDC4' }, // Teal
        { id: 'amateur', label: 'AMATEUR', color: '#45B7D1' },   // Sky Blue
        { id: 'normal', label: 'NORMAL', color: '#FFD93D' },     // Yellow
        { id: 'expert', label: 'EXPERT', color: '#FF8C42' },     // Orange
        { id: 'master', label: 'MASTER', color: '#FF6B6B' }      // Red
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
                {difficulties.map((diff, index) => (
                    <motion.div
                        key={diff.id}
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className={styles.item}
                    >
                        <GameButton
                            variant={diff.color.startsWith('#') ? 'custom' : diff.color as any}
                            customColor={diff.color.startsWith('#') ? diff.color : undefined}
                            onClick={() => handleStart(diff.id)}
                            fullWidth
                        >
                            <div className={styles.buttonContent}>
                                <span className={styles.label}>
                                    {diff.label}
                                </span>
                            </div>
                        </GameButton>
                    </motion.div>
                ))}
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
