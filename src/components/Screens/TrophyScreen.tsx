import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useGameStore } from '../../store/useGameStore';
import { TROPHIES, generateTrophyDescription } from '../../data/trophies';
import { GameButton } from '../UI/GameButton';
import styles from './TrophyScreen.module.css';

type TabType = 'overall' | 'challenge' | 'sprint' | 'survival';
type AchievementFilterType = 'all' | 'achieved' | 'notAchieved';

export const TrophyScreen: React.FC = () => {
    const navigate = useNavigate();
    const { unlockedTrophies, trophyUnlockDates } = useGameStore();
    const [activeTab, setActiveTab] = useState<TabType>('overall');
    const [achievementFilter, setAchievementFilter] = useState<AchievementFilterType>('all');

    const formatDate = (timestamp: number) => {
        const date = new Date(timestamp);
        return date.toLocaleString('ja-JP', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const filteredTrophies = TROPHIES.filter(trophy => {
        // Mode filter
        const modeMatch = activeTab === 'overall' || trophy.category === activeTab;

        // Achievement filter
        const isUnlocked = unlockedTrophies.includes(trophy.id);
        let achievementMatch = true;
        if (achievementFilter === 'achieved') {
            achievementMatch = isUnlocked;
        } else if (achievementFilter === 'notAchieved') {
            achievementMatch = !isUnlocked;
        }

        return modeMatch && achievementMatch;
    });

    const getTierClass = (tier: string) => {
        switch (tier) {
            case 'bronze': return styles.tierBronze;
            case 'silver': return styles.tierSilver;
            case 'gold': return styles.tierGold;
            case 'platinum': return styles.tierPlatinum;
            default: return '';
        }
    };

    return (
        <div className={styles.container}>
            <div className={styles.content}>
                <div className={styles.header}>
                    <h1 className={styles.title}>TROPHIES</h1>
                    <div className={styles.subtitle}>
                        {unlockedTrophies.length} / {TROPHIES.length} ACHIEVED
                    </div>
                </div>

                <div className={styles.tabSection}>
                    <div className={styles.tabGroup}>
                        <button
                            className={`${styles.tab} ${activeTab === 'overall' ? styles.tabActive : ''}`}
                            onClick={() => setActiveTab('overall')}
                        >
                            OVERALL
                        </button>
                        <button
                            className={`${styles.tab} ${activeTab === 'challenge' ? styles.tabActive : ''}`}
                            onClick={() => setActiveTab('challenge')}
                        >
                            CHALLENGE
                        </button>
                        <button
                            className={`${styles.tab} ${activeTab === 'sprint' ? styles.tabActive : ''}`}
                            onClick={() => setActiveTab('sprint')}
                        >
                            SPRINT
                        </button>
                        <button
                            className={`${styles.tab} ${activeTab === 'survival' ? styles.tabActive : ''}`}
                            onClick={() => setActiveTab('survival')}
                        >
                            SURVIVAL
                        </button>
                    </div>

                    <div className={styles.tabGroup}>
                        <button
                            className={`${styles.tab} ${styles.tabSmall} ${achievementFilter === 'all' ? styles.tabActive : ''}`}
                            onClick={() => setAchievementFilter('all')}
                        >
                            ALL
                        </button>
                        <button
                            className={`${styles.tab} ${styles.tabSmall} ${achievementFilter === 'achieved' ? styles.tabActive : ''}`}
                            onClick={() => setAchievementFilter('achieved')}
                        >
                            ACHIEVED
                        </button>
                        <button
                            className={`${styles.tab} ${styles.tabSmall} ${achievementFilter === 'notAchieved' ? styles.tabActive : ''}`}
                            onClick={() => setAchievementFilter('notAchieved')}
                        >
                            NOT ACHIEVED
                        </button>
                    </div>
                </div>

                <div className={styles.trophyList}>
                    {filteredTrophies.map((trophy) => {
                        const isUnlocked = unlockedTrophies.includes(trophy.id);
                        const unlockDate = trophyUnlockDates[trophy.id];
                        const tierClass = isUnlocked ? getTierClass(trophy.tier) : '';

                        return (
                            <div
                                key={trophy.id}
                                className={`${styles.trophyCard} ${!isUnlocked ? styles.locked : tierClass}`}
                            >
                                <div className={styles.trophyIcon}>
                                    {trophy.tier === 'bronze' && '🥉'}
                                    {trophy.tier === 'silver' && '🥈'}
                                    {trophy.tier === 'gold' && '🥇'}
                                    {trophy.tier === 'platinum' && '🏆'}
                                </div>
                                <div className={styles.trophyInfo}>
                                    <h3 className={styles.trophyTitle}>{trophy.title}</h3>
                                    <p className={styles.trophyDescription}>
                                        {generateTrophyDescription(trophy)}
                                    </p>
                                    {isUnlocked && unlockDate && (
                                        <span className={styles.unlockDate}>
                                            ACHIEVED: {formatDate(unlockDate)}
                                        </span>
                                    )}
                                </div>
                            </div>
                        );
                    })}
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
