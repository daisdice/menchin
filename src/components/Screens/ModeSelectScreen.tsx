import React from 'react';
import { useNavigate } from 'react-router-dom';
import { GameButton } from '../UI/GameButton';
import type { GameMode } from '../../store/useGameStore';
import styles from './ModeSelectScreen.module.css';

export const ModeSelectScreen: React.FC = () => {
    const navigate = useNavigate();

    const handleModeSelect = (mode: GameMode, locked?: boolean) => {
        if (locked) return;
        navigate(`/difficulty/${mode}`);
    };

    const modes: { id: GameMode; label: string; desc: string; color: 'primary' | 'secondary' | 'accent' | 'danger'; locked?: boolean }[] = [
        { id: 'challenge', label: 'CHALLENGE', desc: 'Standard Rules. 3 Lives.', color: 'primary' },
        { id: 'sprint', label: 'SPRINT', desc: 'Clear 10 Hands. Time Attack.', color: 'accent' },
        { id: 'survival', label: 'SURVIVAL', desc: 'One Mistake = Game Over.', color: 'danger' },
        { id: 'practice', label: 'PRACTICE', desc: 'No Limits. Just Practice.', color: 'secondary' },
    ];

    return (
        <div className={styles.container}>
            <div className={styles.content}>
                <div className={styles.header}>
                    <h1 className={styles.title}>SELECT MODE</h1>
                </div>

                <div className={styles.modeList}>
                    {modes.map((mode) => (
                        <div key={mode.id} className={styles.modeItem}>
                            <GameButton
                                variant={mode.color}
                                onClick={() => handleModeSelect(mode.id, mode.locked)}
                                disabled={mode.locked}
                                fullWidth
                                className={styles.modeButton}
                            >
                                <div className={styles.buttonContent}>
                                    <span className={styles.modeLabel}>
                                        {mode.label}
                                        {mode.locked && <span style={{ marginLeft: '8px' }}>🔒</span>}
                                    </span>
                                    <span className={styles.modeDesc}>{mode.desc}</span>
                                </div>
                            </GameButton>
                        </div>
                    ))}
                </div>

                <div className={styles.actions}>
                    <GameButton variant="secondary" onClick={() => navigate('/')} fullWidth>
                        BACK
                    </GameButton>
                </div>
            </div>
        </div>
    );
};
