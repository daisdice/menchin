import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { GameButton } from '../UI/GameButton';
import { Card } from '../UI/Card';
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
            <Card className={styles.recordCard}>
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={styles.header}
                >
                    <h2 className={styles.title}>RECORD</h2>
                </motion.div>

                {/* Mode Selector */}
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

                {/* Difficulty Selector */}
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

                {/* Records List */}
                <div className={styles.recordList}>
                    {records.length === 0 ? (
                        <div className={styles.noRecords}>
                            <p>No records yet</p>
                            <p className={styles.noRecordsHint}>Play a game to set a record!</p>
                        </div>
                    ) : (
                        records.map((record, index) => (
                            <motion.div
                                key={`${record.date}-${index}`}
                                className={styles.recordItem}
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: index * 0.05 }}
                            >
                                <span className={styles.rank}>#{index + 1}</span>
                                <span className={styles.score}>{formatScore(record)}</span>
                                <span className={styles.date}>{formatDate(record.date)}</span>
                            </motion.div>
                        ))
                    )}
                </div>

                {/* Actions */}
                <div className={styles.actions}>
                    <GameButton variant="secondary" onClick={() => navigate('/')} fullWidth>
                        BACK
                    </GameButton>
                </div>
            </Card>
        </div>
    );
};
