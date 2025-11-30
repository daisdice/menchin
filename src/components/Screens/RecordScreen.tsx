import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { GameButton } from '../UI/GameButton';
import { getRecords, type GameRecord } from '../../store/useGameStore';
import type { Difficulty } from '../../store/useGameStore';
import styles from './RecordScreen.module.css';

type RecordMode = 'challenge' | 'sprint' | 'survival';

export const RecordScreen: React.FC = () => {
    const navigate = useNavigate();
    const [selectedMode, setSelectedMode] = useState<RecordMode>('challenge');
    const [selectedDifficulty, setSelectedDifficulty] = useState<Difficulty>('normal');

    const modes: { id: RecordMode; label: string }[] = [
        { id: 'challenge', label: 'CHALLENGE' },
        { id: 'sprint', label: 'SPRINT' },
        { id: 'survival', label: 'SURVIVAL' },
    ];

    const difficulties: { id: Difficulty; label: string }[] = [
        { id: 'beginner', label: 'BEGINNER' },
        { id: 'amateur', label: 'AMATEUR' },
        { id: 'normal', label: 'NORMAL' },
        { id: 'expert', label: 'EXPERT' },
        { id: 'master', label: 'MASTER' },
    ];

    const records = getRecords(selectedMode, selectedDifficulty);

    const formatScore = (record: GameRecord): string => {
        if (record.mode === 'sprint') {
            return `${record.score.toFixed(2)}s`;
        } else if (record.mode === 'survival') {
            return `${record.score} Hands`;
        } else {
            return `${Math.floor(record.score)} pts`;
        }
    };

    const formatDate = (timestamp: number): string => {
        const date = new Date(timestamp);
        return `${date.getFullYear()}/${(date.getMonth() + 1).toString().padStart(2, '0')}/${date.getDate().toString().padStart(2, '0')} ${date.getHours().toString().padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')}`;
    };

    return (
        <div className={styles.container}>
            <div className={styles.content}>
                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={styles.header}
                >
                    <h2 className={styles.title}>RECORD</h2>
                </motion.div>

                {/* Mode Tabs */}
                <div className={styles.tabSection}>
                    <div className={styles.tabGroup}>
                        {modes.map((mode) => (
                            <button
                                key={mode.id}
                                className={`${styles.tab} ${selectedMode === mode.id ? styles.tabActive : ''}`}
                                onClick={() => setSelectedMode(mode.id)}
                            >
                                {mode.label}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Difficulty Tabs */}
                <div className={styles.tabSection}>
                    <div className={styles.tabGroup}>
                        {difficulties.map((difficulty) => (
                            <button
                                key={difficulty.id}
                                className={`${styles.tab} ${styles.tabSmall} ${selectedDifficulty === difficulty.id ? styles.tabActive : ''}`}
                                onClick={() => setSelectedDifficulty(difficulty.id)}
                            >
                                {difficulty.label}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Records Container */}
                <div className={styles.recordsContainer}>
                    {records.length === 0 ? (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className={styles.noRecords}
                        >
                            <div className={styles.noRecordsIcon}>📊</div>
                            <p className={styles.noRecordsTitle}>No records yet</p>
                            <p className={styles.noRecordsHint}>Play a game to set a record!</p>
                        </motion.div>
                    ) : (
                        <div className={styles.recordList}>
                            {records.map((record, index) => (
                                <motion.div
                                    key={`${record.date}-${index}`}
                                    className={`${styles.recordCard} ${index === 0 ? styles.recordCardFirst : ''}`}
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: index * 0.05 }}
                                >
                                    <div className={styles.recordRank}>
                                        {index === 0 && <span className={styles.crownIcon}>👑</span>}
                                        <span className={styles.rankNumber}>#{index + 1}</span>
                                    </div>
                                    <div className={styles.recordMain}>
                                        <div className={styles.recordScore}>{formatScore(record)}</div>
                                        <div className={styles.recordDate}>{formatDate(record.date)}</div>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    )}
                </div>

                {/* Actions */}
                <div className={styles.actions}>
                    <GameButton variant="secondary" onClick={() => navigate('/')} fullWidth>
                        BACK
                    </GameButton>
                </div>
            </div>
        </div>
    );
};
