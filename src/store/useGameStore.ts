import { create } from 'zustand';
import type { Tile, Hand } from '../utils/mahjong';
import { Mahjong } from '../utils/mahjong';

export type Difficulty = 'easy' | 'normal' | 'hard';

interface GameState {
    isPlaying: boolean;
    score: number;
    lives: number;
    timeLeft: number;
    currentHand: Hand;
    currentWaits: Tile[];
    selectedWaits: Tile[];
    combo: number;
    difficulty: Difficulty;
    questionStartTime: number;

    // Actions
    startGame: (difficulty: Difficulty) => void;
    endGame: () => void;
    nextHand: () => void;
    toggleWait: (tile: Tile) => void;
    submitAnswer: () => { correct: boolean; correctWaits: Tile[] };
    tick: () => void;
    resetGame: () => void;
}

const INITIAL_LIVES = 3;
const TIME_LIMIT = 60;

export const useGameStore = create<GameState>((set, get) => ({
    isPlaying: false,
    score: 0,
    lives: INITIAL_LIVES,
    timeLeft: TIME_LIMIT,
    currentHand: [],
    currentWaits: [],
    selectedWaits: [],
    combo: 0,
    difficulty: 'normal',
    questionStartTime: 0,

    startGame: (difficulty) => {
        set({
            isPlaying: true,
            score: 0,
            lives: INITIAL_LIVES,
            timeLeft: TIME_LIMIT,
            combo: 0,
            difficulty,
            selectedWaits: [],
        });
        get().nextHand();
    },

    endGame: () => {
        set({ isPlaying: false });
    },

    nextHand: () => {
        const { difficulty } = get();
        let options = {};

        switch (difficulty) {
            case 'easy':
                options = { maxWaits: 2 };
                break;
            case 'normal':
                options = { minWaits: 3, maxWaits: 4 };
                break;
            case 'hard':
                options = { minWaits: 5 };
                break;
        }

        const hand = Mahjong.generateChinitsuHand(options);
        const waits = Mahjong.getWaits(hand);

        set({
            currentHand: hand,
            currentWaits: waits,
            selectedWaits: [],
            questionStartTime: Date.now(),
        });
    },

    toggleWait: (tile) => {
        const { selectedWaits } = get();
        if (selectedWaits.includes(tile)) {
            set({ selectedWaits: selectedWaits.filter(t => t !== tile) });
        } else {
            set({ selectedWaits: [...selectedWaits, tile].sort((a, b) => a - b) });
        }
    },

    submitAnswer: () => {
        const { currentWaits, selectedWaits, questionStartTime, combo, score, lives } = get();

        // Check if arrays are equal
        const isCorrect = JSON.stringify(currentWaits.sort((a, b) => a - b)) ===
            JSON.stringify(selectedWaits.sort((a, b) => a - b));

        if (isCorrect) {
            const timeSpent = (Date.now() - questionStartTime) / 1000;
            const points = Mahjong.calculateScore(1, timeSpent, combo);

            set({
                score: score + points,
                combo: combo + 1,
            });
        } else {
            set({
                lives: lives - 1,
                combo: 0,
            });

            if (lives - 1 <= 0) {
                get().endGame();
            }
        }

        return { correct: isCorrect, correctWaits: currentWaits };
    },

    tick: () => {
        const { timeLeft, isPlaying } = get();
        if (!isPlaying) return;

        if (timeLeft > 0) {
            set({ timeLeft: timeLeft - 1 });
        } else {
            get().endGame();
        }
    },

    resetGame: () => {
        set({
            isPlaying: false,
            score: 0,
            lives: INITIAL_LIVES,
            timeLeft: TIME_LIMIT,
            currentHand: [],
            currentWaits: [],
            selectedWaits: [],
            combo: 0,
        });
    }
}));
