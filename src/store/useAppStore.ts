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
    };

    // Actions
    saveScore: (difficulty: Difficulty, score: number) => boolean; // Returns true if new record
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

            toggleSound: () => {
                set((state) => ({
                    settings: { ...state.settings, soundEnabled: !state.settings.soundEnabled },
                }));
            },
        }),
        {
            name: 'menchin-storage',
            version: 2, // Increment version to trigger migration
            migrate: (persistedState: any) => {
                // Remove unlockedDifficulties from old data
                if (persistedState && persistedState.unlockedDifficulties) {
                    delete persistedState.unlockedDifficulties;
                }
                return persistedState;
            },
        }
    )
);
