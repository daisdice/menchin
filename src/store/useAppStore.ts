import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Difficulty } from './useGameStore';

interface ScoreRecord {
    score: number;
    date: string;
}

interface AppState {
    highScores: Record<Difficulty, ScoreRecord[]>;
    settings: {
        soundEnabled: boolean;
        theme: 'light' | 'dark';
    };
    uiState: {
        recordTab: 'challenge' | 'sprint' | 'survival';
        summaryTab: 'overall' | 'challenge' | 'sprint' | 'survival';
        trophyTab: 'overall' | 'challenge' | 'sprint' | 'survival';
        trophyFilter: 'all' | 'achieved' | 'notAchieved';
        recordDifficulty: Difficulty;
        summaryDifficulty: Difficulty;
    };

    // Actions
    saveScore: (difficulty: Difficulty, score: number) => boolean; // Returns true if new record
    toggleSound: () => void;
    setTheme: (theme: 'light' | 'dark') => void;
    setRecordTab: (tab: 'challenge' | 'sprint' | 'survival') => void;
    setSummaryTab: (tab: 'overall' | 'challenge' | 'sprint' | 'survival') => void;
    setTrophyTab: (tab: 'overall' | 'challenge' | 'sprint' | 'survival') => void;
    setTrophyFilter: (filter: 'all' | 'achieved' | 'notAchieved') => void;
    setRecordDifficulty: (difficulty: Difficulty) => void;
    setSummaryDifficulty: (difficulty: Difficulty) => void;
}

export const useAppStore = create<AppState>()(
    persist(
        (set, get) => ({
            highScores: {
                beginner: [],
                amateur: [],
                normal: [],
                expert: [],
                master: []
            },
            settings: {
                soundEnabled: true,
                theme: 'light',
            },
            uiState: {
                recordTab: 'challenge',
                summaryTab: 'overall',
                trophyTab: 'overall',
                trophyFilter: 'all',
                recordDifficulty: 'normal',
                summaryDifficulty: 'normal',
            },

            saveScore: (difficulty, score) => {
                const { highScores } = get();
                const currentScores = highScores[difficulty] || [];
                const newRecord: ScoreRecord = {
                    score,
                    date: new Date().toISOString(),
                };

                // Check if it's a high score (top 5)
                const newScores = [...currentScores, newRecord]
                    .sort((a, b) => b.score - a.score)
                    .slice(0, 5);

                const isNewRecord = newScores.length > 0 && newScores[0].score === score &&
                    (currentScores.length === 0 || score > currentScores[0].score);

                set({
                    highScores: {
                        ...highScores,
                        [difficulty]: newScores,
                    },
                });

                return isNewRecord;
            },

            toggleSound: () => {
                set((state) => ({
                    settings: { ...state.settings, soundEnabled: !state.settings.soundEnabled },
                }));
            },

            setTheme: (theme) => {
                set((state) => ({
                    settings: { ...state.settings, theme },
                }));
                // Update HTML data-theme attribute
                document.documentElement.setAttribute('data-theme', theme);
            },

            setRecordTab: (tab) => set((state) => ({
                uiState: { ...state.uiState, recordTab: tab }
            })),

            setSummaryTab: (tab) => set((state) => ({
                uiState: { ...state.uiState, summaryTab: tab }
            })),

            setTrophyTab: (tab) => set((state) => ({
                uiState: { ...state.uiState, trophyTab: tab }
            })),

            setTrophyFilter: (filter) => set((state) => ({
                uiState: { ...state.uiState, trophyFilter: filter }
            })),

            setRecordDifficulty: (difficulty) => set((state) => ({
                uiState: { ...state.uiState, recordDifficulty: difficulty }
            })),

            setSummaryDifficulty: (difficulty) => set((state) => ({
                uiState: { ...state.uiState, summaryDifficulty: difficulty }
            })),
        }),
        {
            name: 'menchin-storage',
            version: 4, // Increment version to trigger migration
            migrate: (persistedState: any, version: number) => {
                if (version < 3) {
                    persistedState.uiState = {
                        recordTab: 'challenge',
                        summaryTab: 'overall',
                        trophyTab: 'overall',
                        trophyFilter: 'all',
                        recordDifficulty: 'normal',
                        summaryDifficulty: 'normal',
                    };
                } else if (version < 4) {
                    // Migration for version 4: Add difficulty fields if missing
                    if (persistedState.uiState) {
                        persistedState.uiState.recordDifficulty = 'normal';
                        persistedState.uiState.summaryDifficulty = 'normal';
                    }
                }
                // Remove unlockedDifficulties from old data
                if (persistedState && persistedState.unlockedDifficulties) {
                    delete persistedState.unlockedDifficulties;
                }
                return persistedState;
            },
        }
    )
);
