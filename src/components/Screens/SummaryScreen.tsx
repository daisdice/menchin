import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { GameButton } from '../UI/GameButton';
import type {
    Difficulty,
    QuestionResult
} from '../../store/useGameStore';
import {
    getQuestionResults,
    getModeStats,
    getTrophyStats,
    getDifficultyStats,
    getStatsByMode
} from '../../store/useGameStore';
import { useAppStore } from '../../store/useAppStore';
import styles from './SummaryScreen.module.css';

type Tab = 'overall' | 'challenge' | 'sprint' | 'survival';

export const SummaryScreen: React.FC = () => {
    const navigate = useNavigate();
    const { uiState, setSummaryTab } = useAppStore();
    const activeTab = uiState.summaryTab;
    const [activeDifficulty, setActiveDifficulty] = useState<Difficulty>('normal');
    const [questionResults, setQuestionResults] = useState<QuestionResult[]>([]);

    useEffect(() => {
        setQuestionResults(getQuestionResults());
    }, []);

    const overallStats = useMemo(() => {
        if (questionResults.length === 0) return null;

        const totalQuestions = questionResults.length;
        const correctAnswers = questionResults.filter(r => r.correct).length;
        const totalTime = questionResults.reduce((acc, r) => acc + r.responseTime, 0);

        // Wait count stats
        const waitStats: Record<number, { total: number; correct: number; time: number }> = {};

        questionResults.forEach(r => {
            if (!waitStats[r.waitCount]) {
                waitStats[r.waitCount] = { total: 0, correct: 0, time: 0 };
            }
            waitStats[r.waitCount].total++;
            waitStats[r.waitCount].time += r.responseTime;
            if (r.correct) {
                waitStats[r.waitCount].correct++;
            }
        });

        return {
            accuracy: (correctAnswers / totalQuestions) * 100,
            avgTime: totalTime / totalQuestions,
            waitStats,
            correctAnswers,
            totalQuestions
        };
    }, [questionResults]);

    const modeStats = useMemo(() => {
        if (activeTab === 'overall') return null;
        return getModeStats(activeTab, activeDifficulty);
    }, [activeTab, activeDifficulty]);

    const renderOverallStats = () => {
        const stats = overallStats || {
            accuracy: 0,
            avgTime: 0,
            waitStats: {},
            correctAnswers: 0,
            totalQuestions: 0
        };

        return (
            <div className={styles.statsContainer}>
                <div className={styles.sectionHeader}>
                    <h3 className={styles.sectionTitle}>BASE</h3>
                </div>
                <div className={styles.statsGrid}>
                    <div className={`${styles.statCard} ${styles.cardAccuracy}`}>
                        <span className={styles.statLabel}>ACCURACY</span>
                        <span className={styles.statValue}>
                            {stats.accuracy.toFixed(1)}<span className={styles.statUnit}>%</span>
                        </span>
                        <span className={styles.statSubValue}>
                            ({stats.correctAnswers}/{stats.totalQuestions})
                        </span>
                    </div>
                    <div className={`${styles.statCard} ${styles.cardTime}`}>
                        <span className={styles.statLabel}>AVG TIME</span>
                        <span className={styles.statValue}>
                            {stats.avgTime.toFixed(2)}<span className={styles.statUnit}>s</span>
                        </span>
                    </div>
                </div>

                <div className={styles.sectionHeader}>
                    <h3 className={styles.sectionTitle}>TROPHY</h3>
                </div>
                <div className={styles.trophyContainer}>
                    {(() => {
                        const trophyStats = getTrophyStats();
                        const rate = trophyStats.total > 0 ? (trophyStats.unlocked / trophyStats.total * 100) : 0;
                        return (
                            <>
                                <div className={`${styles.statCard} ${styles.cardScore}`}>
                                    <span className={styles.statLabel}>OVERALL RATE</span>
                                    <span className={styles.statValue}>
                                        {rate.toFixed(1)}<span className={styles.statUnit}>%</span>
                                    </span>
                                    <span className={styles.statSubValue}>
                                        ({trophyStats.unlocked}/{trophyStats.total})
                                    </span>
                                </div>
                                <div className={styles.tierGrid}>
                                    {(['bronze', 'silver', 'gold', 'platinum'] as const).map(tier => {
                                        const tierStats = trophyStats.byTier[tier];
                                        const tierRate = tierStats.total > 0 ? (tierStats.unlocked / tierStats.total * 100) : 0;
                                        return (
                                            <div key={tier} className={`${styles.tierCard} ${styles[`tier${tier.charAt(0).toUpperCase() + tier.slice(1)}`]}`}>
                                                <span className={styles.tierLabel}>{tier.toUpperCase()}</span>
                                                <span className={styles.tierValue}>
                                                    {tierRate.toFixed(0)}%
                                                </span>
                                                <span className={styles.tierSubValue}>
                                                    ({tierStats.unlocked}/{tierStats.total})
                                                </span>
                                            </div>
                                        );
                                    })}
                                </div>
                            </>
                        );
                    })()}
                </div>


                <div className={styles.sectionHeader}>
                    <h3 className={styles.sectionTitle}>STATS BY WAIT COUNT</h3>
                </div>
                <div className={styles.tableContainer}>
                    <table className={styles.statsTable}>
                        <thead>
                            <tr>
                                <th>WAITS</th>
                                <th>ACCURACY</th>
                                <th>AVG TIME</th>
                            </tr>
                        </thead>
                        <tbody>
                            {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((waitCount) => {
                                const s = stats.waitStats[waitCount] || { total: 0, correct: 0, time: 0 };
                                return (
                                    <tr key={waitCount}>
                                        <td>{waitCount}</td>
                                        <td>
                                            <div>{s.total > 0 ? ((s.correct / s.total) * 100).toFixed(1) : '0.0'}%</div>
                                            <div className={styles.tableSubValue}>({s.correct}/{s.total})</div>
                                        </td>
                                        <td>{s.total > 0 ? (s.time / s.total).toFixed(2) : '0.00'}s</td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>

                <div className={styles.sectionHeader}>
                    <h3 className={styles.sectionTitle}>STATS BY LEVEL</h3>
                </div>
                <div className={styles.tableContainer}>
                    <table className={styles.statsTable}>
                        <thead>
                            <tr>
                                <th>LEVEL</th>
                                <th>ACCURACY</th>
                                <th>AVG TIME</th>
                            </tr>
                        </thead>
                        <tbody>
                            {(() => {
                                const diffStats = getDifficultyStats();
                                const difficulties: { id: Difficulty; label: string }[] = [
                                    { id: 'beginner', label: 'BEGINNER' },
                                    { id: 'amateur', label: 'AMATEUR' },
                                    { id: 'normal', label: 'NORMAL' },
                                    { id: 'expert', label: 'EXPERT' },
                                    { id: 'master', label: 'MASTER' }
                                ];
                                return difficulties.map(diff => {
                                    const s = diffStats[diff.id];
                                    const accuracy = s.total > 0 ? (s.correct / s.total * 100) : 0;
                                    const avgTime = s.total > 0 ? (s.totalTime / s.total) : 0;
                                    return (
                                        <tr key={diff.id}>
                                            <td>{diff.label}</td>
                                            <td>
                                                <div>{accuracy.toFixed(1)}%</div>
                                                <div className={styles.tableSubValue}>({s.correct}/{s.total})</div>
                                            </td>
                                            <td>{avgTime.toFixed(2)}s</td>
                                        </tr>
                                    );
                                });
                            })()}
                        </tbody>
                    </table>
                </div>

                <div className={styles.sectionHeader}>
                    <h3 className={styles.sectionTitle}>STATS BY MODE</h3>
                </div>
                <div className={styles.tableContainer}>
                    <table className={styles.statsTable}>
                        <thead>
                            <tr>
                                <th>MODE</th>
                                <th>ACCURACY</th>
                                <th>AVG TIME</th>
                            </tr>
                        </thead>
                        <tbody>
                            {(() => {
                                const modeStats = getStatsByMode();
                                const modes: { id: 'challenge' | 'sprint' | 'survival' | 'practice'; label: string }[] = [
                                    { id: 'challenge', label: 'CHALLENGE' },
                                    { id: 'sprint', label: 'SPRINT' },
                                    { id: 'survival', label: 'SURVIVAL' },
                                    { id: 'practice', label: 'PRACTICE' }
                                ];
                                return modes.map(mode => {
                                    const s = modeStats[mode.id];
                                    const accuracy = s.total > 0 ? (s.correct / s.total * 100) : 0;
                                    const avgTime = s.total > 0 ? (s.totalTime / s.total) : 0;
                                    return (
                                        <tr key={mode.id}>
                                            <td>{mode.label}</td>
                                            <td>
                                                <div>{accuracy.toFixed(1)}%</div>
                                                <div className={styles.tableSubValue}>({s.correct}/{s.total})</div>
                                            </td>
                                            <td>{avgTime.toFixed(2)}s</td>
                                        </tr>
                                    );
                                });
                            })()}
                        </tbody>
                    </table>
                </div>
            </div>
        );
    };

    const renderModeStats = () => {
        const stats = modeStats || {
            attempts: 0,
            clears: 0,
            totalQuestions: 0,
            correctAnswers: 0,
            fastBonuses: 0,
            totalResponseTime: 0,
            bestScore: undefined
        };

        const accuracy = stats.totalQuestions > 0
            ? (stats.correctAnswers / stats.totalQuestions) * 100
            : 0;

        const avgTime = stats.totalQuestions > 0
            ? stats.totalResponseTime / stats.totalQuestions
            : 0;

        return (
            <div className={styles.statsContainer}>
                <div className={styles.statsGrid}>
                    <div className={`${styles.statCard} ${styles.cardCount}`}>
                        <span className={styles.statLabel}>ATTEMPTS</span>
                        <span className={styles.statValue}>{stats.attempts}</span>
                    </div>

                    {activeTab === 'challenge' && (
                        <div className={`${styles.statCard} ${styles.cardCount}`}>
                            <span className={styles.statLabel}>CLEARS</span>
                            <span className={styles.statValue}>
                                {stats.clears || 0}
                            </span>
                            <span className={styles.statSubValue}>
                                ({stats.attempts > 0 ? ((stats.clears || 0) / stats.attempts * 100).toFixed(0) : 0}%)
                            </span>
                        </div>
                    )}

                    <div className={`${styles.statCard} ${styles.cardAccuracy}`}>
                        <span className={styles.statLabel}>ACCURACY</span>
                        <span className={styles.statValue}>
                            {accuracy.toFixed(1)}<span className={styles.statUnit}>%</span>
                        </span>
                        <span className={styles.statSubValue}>
                            ({stats.correctAnswers}/{stats.totalQuestions})
                        </span>
                    </div>

                    <div className={`${styles.statCard} ${styles.cardTime}`}>
                        <span className={styles.statLabel}>AVG TIME</span>
                        <span className={styles.statValue}>
                            {avgTime.toFixed(2)}<span className={styles.statUnit}>s</span>
                        </span>
                    </div>

                    {activeTab === 'challenge' && (
                        <div className={`${styles.statCard} ${styles.cardBonus}`}>
                            <span className={styles.statLabel}>FAST BONUS</span>
                            <span className={styles.statValue}>
                                {stats.totalQuestions > 0
                                    ? (((stats.fastBonuses || 0) / stats.totalQuestions) * 100).toFixed(1)
                                    : 0}
                                <span className={styles.statUnit}>%</span>
                            </span>
                            <span className={styles.statSubValue}>
                                ({stats.fastBonuses || 0}/{stats.totalQuestions})
                            </span>
                        </div>
                    )}

                    <div className={`${styles.statCard} ${styles.cardScore}`}>
                        <span className={styles.statLabel}>
                            {activeTab === 'sprint' ? 'BEST TIME' : 'HIGH SCORE'}
                        </span>
                        <span className={styles.statValue}>
                            {activeTab === 'sprint'
                                ? (stats.bestScore === undefined || stats.bestScore === Infinity ? '-' : `${stats.bestScore?.toFixed(2)}s`)
                                : (stats.bestScore || 0).toLocaleString()}
                        </span>
                    </div>
                </div>
            </div>
        );
    };

    return (
        <div className={styles.container}>
            <div className={styles.content}>
                <div className={styles.header}>
                    <h2 className={styles.title}>SUMMARY</h2>
                </div>

                <div className={styles.tabSection}>
                    <div className={styles.tabGroup}>
                        {(['overall', 'challenge', 'sprint', 'survival'] as Tab[]).map((tab) => (
                            <button
                                key={tab}
                                className={`${styles.tab} ${activeTab === tab ? styles.tabActive : ''}`}
                                onClick={() => setSummaryTab(tab)}
                            >
                                {tab.toUpperCase()}
                            </button>
                        ))}
                    </div>
                </div>

                {activeTab !== 'overall' && (
                    <div className={styles.tabSection}>
                        <div className={styles.tabGroup}>
                            {(['beginner', 'amateur', 'normal', 'expert', 'master'] as Difficulty[]).map((diff) => (
                                <button
                                    key={diff}
                                    className={`${styles.tab} ${styles.tabSmall} ${activeDifficulty === diff ? styles.tabActive : ''}`}
                                    onClick={() => setActiveDifficulty(diff)}
                                >
                                    {diff.toUpperCase()}
                                </button>
                            ))}
                        </div>
                    </div>
                )}

                {activeTab === 'overall' ? renderOverallStats() : renderModeStats()}

                <div className={styles.actions}>
                    <GameButton
                        variant="secondary"
                        onClick={() => navigate('/')}
                        fullWidth
                    >
                        BACK
                    </GameButton>
                </div>
            </div>
        </div>
    );
};
