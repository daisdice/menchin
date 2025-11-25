import { create } from 'zustand';
import type { Tile, Hand } from '../utils/mahjong';
import { Mahjong } from '../utils/mahjong';

export type Difficulty = 'beginner' | 'amateur' | 'normal' | 'expert' | 'master';
export type GameMode = 'challenge' | 'sprint' | 'survival' | 'practice';

interface GameState {
    isPlaying: boolean;
    score: number;
    lives: number;
    timeLeft: number;
    gameEndTime: number;
    currentHand: Hand;
    currentWaits: Tile[];
    selectedWaits: Tile[];
    difficulty: Difficulty;
    mode: GameMode;
    questionStartTime: number;
    correctCount: number;
    isGameOver: boolean;
    isClear: boolean;
    lastScoreBreakdown: {
        baseScore: number;
        clearBonus: number;
        lifeBonus: number;
        timeBonus: number;
        totalScore: number;
    } | null;

    // Actions
    startGame: (mode: GameMode, difficulty: Difficulty) => void;
    endGame: (forceClear?: boolean) => void;
    nextHand: () => void;
    toggleWait: (tile: Tile) => void;
    submitAnswer: () => { correct: boolean; correctWaits: Tile[]; points?: number; fastBonus?: number; bonuses?: string[] };
    tick: () => void;
    resetGame: () => void;
}

const INITIAL_LIVES = 3;
const TIME_LIMIT_SPRINT = 60;

export const useGameStore = create<GameState>((set, get) => ({
    isPlaying: false,
    score: 0,
    lives: INITIAL_LIVES,
    timeLeft: 0,
    currentHand: [],
    currentWaits: [],
    selectedWaits: [],
    difficulty: 'normal',
    mode: 'challenge',
    questionStartTime: 0,
    correctCount: 0,
    isGameOver: false,
    isClear: false,
    lastScoreBreakdown: null,

    gameEndTime: 0,

    startGame: (mode, difficulty) => {
        let lives = INITIAL_LIVES;
        let duration = 0;

        switch (mode) {
            case 'sprint':
                lives = 99;
                duration = TIME_LIMIT_SPRINT;
                break;
            case 'survival':
                lives = 1;
                duration = 0; // Infinite? Or handled differently
                break;
            case 'practice':
                lives = 99;
                duration = 0;
                break;
            case 'challenge':
            default:
                lives = 3;
                duration = 120; // 120 seconds time limit
                break;
        }

        const gameEndTime = 0; // Don't start timer yet, wait for countdown

        set({
            isPlaying: true,
            score: 0,
            lives,
            timeLeft: duration,
            gameEndTime,
            difficulty,
            mode,
            selectedWaits: [],
            correctCount: 0,
            isGameOver: false,
            isClear: false,
            lastScoreBreakdown: null,
        });
        get().nextHand();
    },

    endGame: (forceClear: boolean = false) => {
        if (forceClear) {
            const { score, timeLeft, lives, difficulty } = get();

            // Calculate bonuses for debug clear (New Formula)
            const timeBonus = timeLeft * 100;
            const lifeBonus = lives * 1000;
            let clearBonus = 2000;
            switch (difficulty) {
                case 'beginner': clearBonus = 2000; break;
                case 'amateur': clearBonus = 4000; break;
                case 'normal': clearBonus = 6000; break;
                case 'expert': clearBonus = 8000; break;
                case 'master': clearBonus = 10000; break;
            }
            const totalScore = score + timeBonus + lifeBonus + clearBonus;

            set({
                isPlaying: false,
                isGameOver: true,
                isClear: true,
                score: totalScore,
                lastScoreBreakdown: {
                    baseScore: score,
                    clearBonus,
                    lifeBonus,
                    timeBonus,
                    totalScore
                }
            });
        } else {
            const { score, isClear, lastScoreBreakdown } = get();

            if (isClear && lastScoreBreakdown) {
                set({
                    isPlaying: false,
                    isGameOver: true
                });
            } else {
                set({
                    isPlaying: false,
                    isGameOver: true,
                    lastScoreBreakdown: {
                        baseScore: score,
                        clearBonus: 0,
                        lifeBonus: 0,
                        timeBonus: 0,
                        totalScore: score
                    }
                });
            }
        }
    },

    nextHand: () => {
        const { difficulty } = get();
        let options = {};

        switch (difficulty) {
            case 'beginner':
                options = { tiles: 7, minWaits: 1, maxWaits: 5 };
                break;
            case 'amateur':
                options = { tiles: 10, minWaits: 1, maxWaits: 5 };
                break;
            case 'normal':
                options = { tiles: 13, minWaits: 1, maxWaits: 5 };
                break;
            case 'expert':
                options = { tiles: 13, minWaits: 3, maxWaits: 7 };
                break;
            case 'master':
                options = { tiles: 13, minWaits: 5, maxWaits: 9 };
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
        const { currentWaits, selectedWaits, questionStartTime, score, lives, mode, difficulty, correctCount, timeLeft } = get();

        // Check if arrays are equal
        const isCorrect = JSON.stringify(currentWaits.sort((a, b) => a - b)) ===
            JSON.stringify(selectedWaits.sort((a, b) => a - b));

        if (isCorrect) {
            const timeSpent = (Date.now() - questionStartTime) / 1000;

            // Calculate Score (New Formula)
            const baseScore = currentWaits.length * 100;
            const fastThreshold = 2 + currentWaits.length * 1; // 2秒 + 待ちの数 * 1秒
            const fastBonus = timeSpent <= fastThreshold ? Math.floor(baseScore * 0.3) : 0;

            const points = baseScore + fastBonus;

            const newCorrectCount = correctCount + 1;

            set({
                score: score + points,
                correctCount: newCorrectCount,
            });

            // Check Clear Condition for CHALLENGE
            if (mode === 'challenge' && newCorrectCount >= 10) {
                // Calculate Result Bonuses (New Formula)
                const timeBonus = timeLeft * 100;
                const lifeBonus = lives * 1000;
                let clearBonus = 2000;
                switch (difficulty) {
                    case 'beginner': clearBonus = 2000; break;
                    case 'amateur': clearBonus = 4000; break;
                    case 'normal': clearBonus = 6000; break;
                    case 'expert': clearBonus = 8000; break;
                    case 'master': clearBonus = 10000; break;
                }
                const totalScore = score + points + timeBonus + lifeBonus + clearBonus;

                set({
                    score: totalScore,
                    isClear: true,
                    lastScoreBreakdown: {
                        baseScore: score + points,
                        clearBonus,
                        lifeBonus,
                        timeBonus,
                        totalScore
                    }
                });
                get().endGame();
            }

            return {
                correct: true,
                correctWaits: currentWaits,
                points,
                fastBonus,
                bonuses: [
                    fastBonus > 0 ? 'FAST' : ''
                ].filter(Boolean)
            };

        } else {
            // Handle wrong answer based on mode
            let newLives = lives;
            if (mode !== 'practice') {
                newLives = lives - 1;
            }

            set({
                lives: newLives,
            });

            if (newLives <= 0) {
                get().endGame();
            }

            return {
                correct: false,
                correctWaits: currentWaits,
                points: 0,
                bonuses: []
            };
        }
    },

    tick: () => {
        const { isPlaying, mode, gameEndTime } = get();
        if (!isPlaying) return;

        if (mode === 'sprint' || mode === 'challenge') {
            const now = Date.now();
            if (gameEndTime > 0) {
                const remaining = Math.max(0, Math.ceil((gameEndTime - now) / 1000));
                set({ timeLeft: remaining });

                if (remaining <= 0) {
                    get().endGame();
                }
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
            correctCount: 0,
            isGameOver: false,
            isClear: false,
            lastScoreBreakdown: null,
        });
    }
}));
