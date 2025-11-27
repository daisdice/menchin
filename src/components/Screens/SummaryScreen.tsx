import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card } from '../UI/Card';
import { GameButton } from '../UI/GameButton';
import type {
    Difficulty,
    QuestionResult
} from '../../store/useGameStore';
import {
    getQuestionResults,
    getModeStats
} from '../../store/useGameStore';
import styles from './SummaryScreen.module.css';

type Tab = 'overall' | 'challenge' | 'sprint' | 'survival';

export const SummaryScreen: React.FC = () => {
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState<Tab>('overall');
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
            waitStats
        };
    }, [questionResults]);

    const modeStats = useMemo(() => {
        if (activeTab === 'overall') return null;
        return getModeStats(activeTab, activeDifficulty);
    }, [activeTab, activeDifficulty]);

    const renderOverallStats = () => {
        if (!overallStats) {
            return (
                <div className={styles.noRecords}>
                    <p>NO DATA</p>
                    <span className={styles.noRecordsHint}>Play some games to see statistics!</span>
                </div>
            );
        }

        return (
            <>
                <div className={styles.statsGrid}>
                    <div className={styles.statItem}>
                        <span className={styles.statLabel}>ACCURACY</span>
                        <span className={styles.statValue}>
                            {overallStats.accuracy.toFixed(1)}<span className={styles.statUnit}>%</span>
                        </span>
                    </div>
                    <div className={styles.statItem}>
                        <span className={styles.statLabel}>AVG TIME</span>
                        <span className={styles.statValue}>
                            {overallStats.avgTime.toFixed(2)}<span className={styles.statUnit}>s</span>
                        </span>
                    </div>
                </div>

                <div className={styles.waitStatsContainer}>
                    <h3 className={styles.sectionTitle}>STATS BY WAIT COUNT</h3>
                    <table className={styles.waitStatsTable}>
                        <thead>
                            <tr>
                                <th>WAITS</th>
                                <th>ACCURACY</th>
                                <th>AVG TIME</th>
                                <th>COUNT</th>
                            </tr>
                        </thead>
                        <tbody>
                            {Object.entries(overallStats.waitStats)
                                .sort((a, b) => Number(a[0]) - Number(b[0]))
                                .map(([waitCount, stats]) => (
                                    <tr key={waitCount}>
                                        <td>{waitCount}</td>
                                        <td>{((stats.correct / stats.total) * 100).toFixed(1)}%</td>
                                        <td>{(stats.time / stats.total).toFixed(2)}s</td>
                                        <td>{stats.total}</td>
                                    </tr>
                                ))}
                        </tbody>
                    </table>
                </div>
            </>
        );
    };

    const renderModeStats = () => {
        if (!modeStats || modeStats.attempts === 0) {
            return (
                <div className={styles.noRecords}>
                    <p>NO DATA</p>
                    <span className={styles.noRecordsHint}>Play {activeTab.toUpperCase()} mode to see stats!</span>
                </div>
            );
        }

        const accuracy = modeStats.totalQuestions > 0
            ? (modeStats.correctAnswers / modeStats.totalQuestions) * 100
            : 0;

        return (
            <div className={styles.statsGrid}>
                <div className={styles.statItem}>
                    <span className={styles.statLabel}>ATTEMPTS</span>
                    <span className={styles.statValue}>{modeStats.attempts}</span>
                </div>

                {activeTab !== 'sprint' && (
                    <div className={styles.statItem}>
                        <span className={styles.statLabel}>CLEARS</span>
                        <span className={styles.statValue}>
                            {modeStats.clears || 0}
                            <span className={styles.statUnit}>
                                ({modeStats.attempts > 0 ? ((modeStats.clears || 0) / modeStats.attempts * 100).toFixed(0) : 0}%)
                            </span>
                        </span>
                    </div>
                )}

                <div className={styles.statItem}>
                    <span className={styles.statLabel}>ACCURACY</span>
                    <span className={styles.statValue}>
                        {accuracy.toFixed(1)}<span className={styles.statUnit}>%</span>
                    </span>
                </div>

                {activeTab === 'challenge' && (
                    <div className={styles.statItem}>
                        <span className={styles.statLabel}>FAST BONUS</span>
                        <span className={styles.statValue}>
                            {modeStats.totalQuestions > 0
                                ? (((modeStats.fastBonuses || 0) / modeStats.totalQuestions) * 100).toFixed(1)
                                : 0}
                            <span className={styles.statUnit}>%</span>
                        </span>
                    </div>
                )}

                <div className={styles.statItem}>
                    <span className={styles.statLabel}>
                        {activeTab === 'sprint' ? 'BEST TIME' : 'HIGH SCORE'}
                    </span>
                    <span className={styles.statValue}>
                        {activeTab === 'sprint'
                            ? (modeStats.bestScore === Infinity ? '-' : `${modeStats.bestScore?.toFixed(2)}s`)
                            : (modeStats.bestScore || 0).toLocaleString()}
                    </span>
                </div>
            </div>
        );
    };

    return (
        <div className={styles.container}>
            <Card className={styles.summaryCard}>
                <div className={styles.header}>
                    <h2 className={styles.title}>SUMMARY</h2>
                </div>

                <div className={styles.tabGroup}>
                    {(['overall', 'challenge', 'sprint', 'survival'] as Tab[]).map((tab) => (
                        <button
                            key={tab}
                            className={`${styles.tab} ${activeTab === tab ? styles.tabActive : ''}`}
                            onClick={() => setActiveTab(tab)}
                        >
                            {tab.toUpperCase()}
                        </button>
                    ))}
                </div>

                {activeTab !== 'overall' && (
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
            </Card>
        </div>
    );
};
