import { create } from 'zustand';
import type { Tile, Hand } from '../utils/mahjong';
import { Mahjong } from '../utils/mahjong';

export type Difficulty = 'beginner' | 'normal' | 'advanced' | 'expert' | 'master';
export type GameMode = 'classic' | 'sprint' | 'survival' | 'practice';

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
    mode: GameMode;
    questionStartTime: number;

    // Actions
    startGame: (mode: GameMode, difficulty: Difficulty) => void;
    endGame: () => void;
    nextHand: () => void;
    toggleWait: (tile: Tile) => void;
    submitAnswer: () => { correct: boolean; correctWaits: Tile[] };
    tick: () => void;
    resetGame: () => void;
}

const INITIAL_LIVES = 3;
const TIME_LIMIT_SPRINT = 60;
// Actually, let's keep it simple:
// SPRINT: 60s total time
// CLASSIC: No time limit per question (or generous), lives matter
// SURVIVAL: 1 life, no time limit
// PRACTICE: Infinite lives, no time limit

export const useGameStore = create<GameState>((set, get) => ({
    isPlaying: false,
    score: 0,
    lives: INITIAL_LIVES,
    timeLeft: 0,
    currentHand: [],
    currentWaits: [],
    selectedWaits: [],
    combo: 0,
    difficulty: 'normal',
    mode: 'classic',
    questionStartTime: 0,

    startGame: (mode, difficulty) => {
        let lives = INITIAL_LIVES;
        let timeLeft = 0;

        switch (mode) {
            case 'sprint':
                lives = 99; // Infinite lives effectively, limited by time
                timeLeft = TIME_LIMIT_SPRINT;
                break;
            case 'survival':
                lives = 1;
                timeLeft = 0; // No time limit
                break;
            case 'practice':
                lives = 99;
                timeLeft = 0;
                break;
            case 'classic':
            default:
                lives = 3;
                timeLeft = 0;
                break;
        }

        set({
            isPlaying: true,
            score: 0,
            lives,
            timeLeft,
            combo: 0,
            difficulty,
            mode,
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
            case 'beginner':
                options = { maxWaits: 2 };
                break;
            case 'normal':
                options = { minWaits: 2, maxWaits: 3 };
                break;
            case 'advanced':
                options = { minWaits: 3, maxWaits: 4 };
                break;
            case 'expert':
                options = { minWaits: 4, maxWaits: 5 };
                break;
            case 'master':
                options = { minWaits: 5 };
                break;
        }

        const hand = Mahjong.generateChinitsuHand(options);
        const waits = Mahjong.calculateWaits(hand);

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
        const { currentWaits, selectedWaits, questionStartTime, combo, score, lives, mode } = get();

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
            // Handle wrong answer based on mode
            let newLives = lives;
            if (mode !== 'practice') {
                newLives = lives - 1;
            }

            // SPRINT mode penalty? Maybe time penalty?
            // For now, just lives (which are high in sprint) or just combo reset

            set({
                lives: newLives,
                combo: 0,
            });

            if (newLives <= 0) {
                get().endGame();
            }
        }

        return { correct: isCorrect, correctWaits: currentWaits };
    },

    tick: () => {
        const { timeLeft, isPlaying, mode } = get();
        if (!isPlaying) return;

        if (mode === 'sprint') {
            if (timeLeft > 0) {
                set({ timeLeft: timeLeft - 1 });
            } else {
                get().endGame();
            }
        }
    },

    resetGame: () => {
        set({
            isPlaying: false,
            score: 0,
            lives: INITIAL_LIVES,
            timeLeft: 0,
            currentHand: [],
            currentWaits: [],
            selectedWaits: [],
            combo: 0,
        });
    }
}));
