import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { GameButton } from '../UI/GameButton';
import type { GameMode } from '../../store/useGameStore';
import styles from './ModeSelectScreen.module.css';

export const ModeSelectScreen: React.FC = () => {
    const navigate = useNavigate();

    const handleModeSelect = (mode: GameMode, locked?: boolean) => {
        if (locked) return; // Don't navigate if mode is locked

        // For now, all modes go to difficulty select, except maybe Practice?
        // Let's keep it consistent: Mode -> Difficulty -> Game
        // We can pass the selected mode via state or URL params, but since we use a store,
        // we might want to set the mode in the store first, or pass it as a param to the next screen.
        // However, the store's startGame takes both.
        // Let's pass the mode as a URL parameter or route state.
        navigate(`/difficulty/${mode}`);
    };

    const modes: { id: GameMode; label: string; desc: string; color: 'primary' | 'secondary' | 'accent' | 'danger'; locked?: boolean }[] = [
        { id: 'challenge', label: 'CHALLENGE', desc: 'Standard Rules. 3 Lives.', color: 'primary' },
        { id: 'sprint', label: 'SPRINT', desc: 'Clear 10 Hands. Time Attack.', color: 'accent' },
        { id: 'survival', label: 'SURVIVAL', desc: 'One Mistake = Game Over.', color: 'danger', locked: true },
        { id: 'practice', label: 'PRACTICE', desc: 'No Limits. Just Practice.', color: 'secondary', locked: true },
    ];

    return (
        <div className={styles.container}>
            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className={styles.header}
            >
                <h2 className={styles.title}>SELECT MODE</h2>
            </motion.div>

            <div className={styles.modeList}>
                {modes.map((mode, index) => (
                    <motion.div
                        key={mode.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className={styles.modeItem}
                    >
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
                    </motion.div>
                ))}
            </div>

            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
                className={styles.footer}
            >
                <GameButton variant="secondary" size="sm" onClick={() => navigate('/')}>
                    BACK
                </GameButton>
            </motion.div>
        </div>
    );
};
