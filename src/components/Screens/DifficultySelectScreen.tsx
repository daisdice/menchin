import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';
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
        { id: 'beginner', label: 'BEGINNER', color: '#4ECDC4' },
        { id: 'amateur', label: 'AMATEUR', color: '#45B7D1' },
        { id: 'normal', label: 'NORMAL', color: '#FFD93D' },
        { id: 'expert', label: 'EXPERT', color: '#FF8C42' },
        { id: 'master', label: 'MASTER', color: '#FF6B6B' }
    ];

    return (
        <div className={styles.container}>
            <div className={styles.content}>
                <div className={styles.header}>
                    <h1 className={styles.title}>SELECT LEVEL</h1>
                    <p className={styles.subtitle}>{mode?.toUpperCase()} MODE</p>
                </div>

                <div className={styles.list}>
                    {difficulties.map((diff) => (
                        <div key={diff.id} className={styles.item}>
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
                        </div>
                    ))}
                </div>

                <div className={styles.actions}>
                    <GameButton variant="secondary" onClick={() => navigate('/mode')} fullWidth>
                        BACK
                    </GameButton>
                </div>
            </div>
        </div>
    );
};
