import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useGameStore } from '../../store/useGameStore';
import { TROPHIES } from '../../data/trophies';
import { GameButton } from '../UI/GameButton';
import { Card } from '../UI/Card';
import styles from './TrophyScreen.module.css';

export const TrophyScreen: React.FC = () => {
    const navigate = useNavigate();
    const { unlockedTrophies } = useGameStore();

    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <h1 className={styles.title}>TROPHIES</h1>
                <p className={styles.subtitle}>
                    {unlockedTrophies.length} / {TROPHIES.length} UNLOCKED
                </p>
            </div>

            <div className={styles.trophyGrid}>
                {TROPHIES.map((trophy) => {
                    const isUnlocked = unlockedTrophies.includes(trophy.id);
                    return (
                        <Card
                            key={trophy.id}
                            className={`${styles.trophyCard} ${!isUnlocked ? styles.locked : ''}`}
                        >
                            <div className={styles.trophyIcon}>{trophy.icon}</div>
                            <div className={styles.trophyInfo}>
                                <h3 className={styles.trophyTitle}>{trophy.title}</h3>
                                <p className={styles.trophyDescription}>
                                    {isUnlocked || !trophy.hidden ? trophy.description : '???'}
                                </p>
                            </div>
                            {isUnlocked && <div className={styles.unlockedBadge}>UNLOCKED</div>}
                        </Card>
                    );
                })}
            </div>

            <div className={styles.actions}>
                <GameButton variant="secondary" onClick={() => navigate('/')} fullWidth>
                    BACK
                </GameButton>
            </div>
        </div>
    );
};
