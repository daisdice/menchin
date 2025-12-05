import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useGameStore } from '../../store/useGameStore';
import { useAppStore } from '../../store/useAppStore';
import { TROPHIES, generateTrophyDescription } from '../../data/trophies';
import { GameButton } from '../UI/GameButton';
import { TrophyIcon } from '../UI/TrophyIcon';
import styles from './TrophyScreen.module.css';


export const TrophyScreen: React.FC = () => {
    const navigate = useNavigate();
    const { unlockedTrophies, trophyUnlockDates } = useGameStore();
    const { uiState, setTrophyTab, setTrophyFilter } = useAppStore();
    const activeTab = uiState.trophyTab;
    const achievementFilter = uiState.trophyFilter;

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
                            onClick={() => setTrophyTab('overall')}
                        >
                            OVERALL
                        </button>
                        <button
                            className={`${styles.tab} ${activeTab === 'challenge' ? styles.tabActive : ''}`}
                            onClick={() => setTrophyTab('challenge')}
                        >
                            CHALLENGE
                        </button>
                        <button
                            className={`${styles.tab} ${activeTab === 'sprint' ? styles.tabActive : ''}`}
                            onClick={() => setTrophyTab('sprint')}
                        >
                            SPRINT
                        </button>
                        <button
                            className={`${styles.tab} ${activeTab === 'survival' ? styles.tabActive : ''}`}
                            onClick={() => setTrophyTab('survival')}
                        >
                            SURVIVAL
                        </button>
                    </div>

                    <div className={styles.tabGroup}>
                        <button
                            className={`${styles.tab} ${styles.tabSmall} ${achievementFilter === 'all' ? styles.tabActive : ''}`}
                            onClick={() => setTrophyFilter('all')}
                        >
                            ALL
                        </button>
                        <button
                            className={`${styles.tab} ${styles.tabSmall} ${achievementFilter === 'achieved' ? styles.tabActive : ''}`}
                            onClick={() => setTrophyFilter('achieved')}
                        >
                            ACHIEVED
                        </button>
                        <button
                            className={`${styles.tab} ${styles.tabSmall} ${achievementFilter === 'notAchieved' ? styles.tabActive : ''}`}
                            onClick={() => setTrophyFilter('notAchieved')}
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
                                <TrophyIcon tier={trophy.tier} />
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
