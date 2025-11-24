import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Difficulty } from './useGameStore';

interface ScoreRecord {
    score: number;
    date: string;
}

interface AppState {
    highScores: Record<Difficulty, ScoreRecord[]>;
    unlockedDifficulties: Difficulty[];
    settings: {
        soundEnabled: boolean;
    };

    // Actions
    saveScore: (difficulty: Difficulty, score: number) => boolean; // Returns true if new record
    unlockDifficulty: (difficulty: Difficulty) => void;
    toggleSound: () => void;
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
            unlockedDifficulties: ['beginner'], // Start with beginner unlocked
            settings: {
                soundEnabled: true,
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

            unlockDifficulty: (difficulty) => {
                const { unlockedDifficulties } = get();
                if (!unlockedDifficulties.includes(difficulty)) {
                    set({ unlockedDifficulties: [...unlockedDifficulties, difficulty] });
                }
            },

            toggleSound: () => {
                set((state) => ({
                    settings: { ...state.settings, soundEnabled: !state.settings.soundEnabled },
                }));
            },
        }),
        {
            name: 'menchin-storage',
            version: 1,
            migrate: (persistedState: any) => {
                // Ensure beginner is always unlocked
                if (persistedState && Array.isArray(persistedState.unlockedDifficulties)) {
                    if (!persistedState.unlockedDifficulties.includes('beginner')) {
                        persistedState.unlockedDifficulties = ['beginner', ...persistedState.unlockedDifficulties];
                    }
                }
                return persistedState;
            },
        }
    )
);
