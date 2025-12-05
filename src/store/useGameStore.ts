import { create } from 'zustand';
import type { Tile, Hand } from '../utils/mahjong';
import { Mahjong } from '../utils/mahjong';
import { TROPHIES, checkTrophyUnlock } from '../data/trophies';
import { LIVES, DURATION, SCORE, HAND_CONFIG, STORAGE_KEYS, LIMITS } from '../utils/constants';

export type Difficulty = 'beginner' | 'amateur' | 'normal' | 'expert' | 'master';
export type GameMode = 'challenge' | 'sprint' | 'survival' | 'practice';

export interface GameRecord {
    mode: 'challenge' | 'sprint' | 'survival';
    difficulty: Difficulty;
    score: number;
    date: number;
}

// Record management functions
const getStorageKey = (mode: GameRecord['mode'], difficulty: Difficulty): string => {
    return `${STORAGE_KEYS.RECORDS_PREFIX}_${mode}_${difficulty}`;
};

export const saveRecord = (record: GameRecord): void => {
    const key = getStorageKey(record.mode, record.difficulty);
    const existingRecords = getRecords(record.mode, record.difficulty);

    // Add new record
    const updatedRecords = [...existingRecords, record];

    // Sort by score (descending for challenge/survival, ascending for sprint)
    updatedRecords.sort((a, b) => {
        if (record.mode === 'sprint') {
            return a.score - b.score; // Lower is better for sprint (time)
        }
        return b.score - a.score; // Higher is better for challenge/survival
    });

    // Keep only top 10
    const top10 = updatedRecords.slice(0, LIMITS.MAX_RECORDS);

    // Save to localStorage
    localStorage.setItem(key, JSON.stringify(top10));
};

export const getRecords = (mode: GameRecord['mode'], difficulty: Difficulty): GameRecord[] => {
    const key = getStorageKey(mode, difficulty);
    const stored = localStorage.getItem(key);

    if (!stored) {
        return [];
    }

    try {
        return JSON.parse(stored) as GameRecord[];
    } catch {
        return [];
    }
};

// Statistics data structures
export interface QuestionResult {
    mode: 'challenge' | 'sprint' | 'survival' | 'practice';
    difficulty: Difficulty;
    waitCount: number;
    correct: boolean;
    responseTime: number;
    fastBonus: boolean;
    timestamp: number;
}

export interface ModeStats {
    attempts: number;
    clears?: number; // For challenge/survival
    noMissClears?: number; // No-mistake clears
    totalQuestions: number;
    correctAnswers: number;
    fastBonuses?: number; // For challenge
    totalResponseTime: number;
    bestScore?: number; // For challenge/survival: highScore, for sprint: bestTime
}

// Statistics management functions
const STATS_STORAGE_KEY = STORAGE_KEYS.QUESTION_RESULTS;
const MODE_STATS_KEY = STORAGE_KEYS.MODE_STATS;
const GLOBAL_STATS_KEY = STORAGE_KEYS.GLOBAL_STATS;

// Global statistics (across all modes and difficulties)
export interface GlobalStats {
    totalCorrect: number; // Total correct answers across all modes
    wait3Plus: number; // Correct answers with 3+ tile waits
    wait6Plus: number; // Correct answers with 6+ tile waits
    wait9: number; // Correct answers with 9 tile waits
    practiceAttempts: number; // Practice mode play count
    waitStats: Record<number, number>; // Wait count -> correct count
    fastBonusCount: number; // Total fast bonuses
}

export const saveQuestionResult = (result: QuestionResult): void => {
    const stored = localStorage.getItem(STATS_STORAGE_KEY);
    const results: QuestionResult[] = stored ? JSON.parse(stored) : [];
    results.push(result);

    // Keep only last 10000 results to prevent storage overflow
    if (results.length > LIMITS.MAX_QUESTION_RESULTS) {
        results.shift();
    }

    localStorage.setItem(STATS_STORAGE_KEY, JSON.stringify(results));
};

export const getQuestionResults = (): QuestionResult[] => {
    const stored = localStorage.getItem(STATS_STORAGE_KEY);
    if (!stored) return [];

    try {
        return JSON.parse(stored) as QuestionResult[];
    } catch {
        return [];
    }
};

export const getGlobalStats = (): GlobalStats => {
    const stored = localStorage.getItem(GLOBAL_STATS_KEY);

    if (!stored) {
        return {
            totalCorrect: 0,
            wait3Plus: 0,
            wait6Plus: 0,
            wait9: 0,
            practiceAttempts: 0,
            waitStats: {},
            fastBonusCount: 0
        };
    }

    try {
        return JSON.parse(stored) as GlobalStats;
    } catch {
        return {
            totalCorrect: 0,
            wait3Plus: 0,
            wait6Plus: 0,
            wait9: 0,
            practiceAttempts: 0,
            waitStats: {},
            fastBonusCount: 0
        };
    }
};

export const updateGlobalStats = (updates: Partial<GlobalStats>): void => {
    const current = getGlobalStats();

    const updated: GlobalStats = {
        totalCorrect: updates.totalCorrect !== undefined ? current.totalCorrect + updates.totalCorrect : current.totalCorrect,
        wait3Plus: updates.wait3Plus !== undefined ? current.wait3Plus + updates.wait3Plus : current.wait3Plus,
        wait6Plus: updates.wait6Plus !== undefined ? current.wait6Plus + updates.wait6Plus : current.wait6Plus,
        wait9: updates.wait9 !== undefined ? current.wait9 + updates.wait9 : current.wait9,
        practiceAttempts: updates.practiceAttempts !== undefined ? current.practiceAttempts + updates.practiceAttempts : current.practiceAttempts,
        waitStats: updates.waitStats ? { ...current.waitStats, ...updates.waitStats } : current.waitStats,
        fastBonusCount: updates.fastBonusCount !== undefined ? current.fastBonusCount + updates.fastBonusCount : current.fastBonusCount
    };

    localStorage.setItem(GLOBAL_STATS_KEY, JSON.stringify(updated));
};

export const getModeStats = (mode: 'challenge' | 'sprint' | 'survival', difficulty: Difficulty): ModeStats => {
    const key = `${MODE_STATS_KEY}_${mode}_${difficulty}`;
    const stored = localStorage.getItem(key);

    if (!stored) {
        return {
            attempts: 0,
            clears: 0,
            noMissClears: 0,
            totalQuestions: 0,
            correctAnswers: 0,
            fastBonuses: 0,
            totalResponseTime: 0,
            bestScore: mode === 'sprint' ? Infinity : 0
        };
    }

    try {
        return JSON.parse(stored) as ModeStats;
    } catch {
        return {
            attempts: 0,
            clears: 0,
            noMissClears: 0,
            totalQuestions: 0,
            correctAnswers: 0,
            fastBonuses: 0,
            totalResponseTime: 0,
            bestScore: mode === 'sprint' ? Infinity : 0
        };
    }
};

export const updateModeStats = (mode: 'challenge' | 'sprint' | 'survival', difficulty: Difficulty, updates: Partial<ModeStats>): void => {
    const current = getModeStats(mode, difficulty);
    const key = `${MODE_STATS_KEY}_${mode}_${difficulty}`;

    const updated: ModeStats = {
        attempts: updates.attempts !== undefined ? current.attempts + updates.attempts : current.attempts,
        clears: updates.clears !== undefined ? (current.clears || 0) + updates.clears : current.clears,
        noMissClears: updates.noMissClears !== undefined ? (current.noMissClears || 0) + updates.noMissClears : current.noMissClears,
        totalQuestions: updates.totalQuestions !== undefined ? current.totalQuestions + updates.totalQuestions : current.totalQuestions,
        correctAnswers: updates.correctAnswers !== undefined ? current.correctAnswers + updates.correctAnswers : current.correctAnswers,
        fastBonuses: updates.fastBonuses !== undefined ? (current.fastBonuses || 0) + updates.fastBonuses : current.fastBonuses,
        totalResponseTime: updates.totalResponseTime !== undefined ? current.totalResponseTime + updates.totalResponseTime : current.totalResponseTime,
        bestScore: updates.bestScore !== undefined ?
            (mode === 'sprint' ? Math.min(current.bestScore || Infinity, updates.bestScore) : Math.max(current.bestScore || 0, updates.bestScore))
            : current.bestScore
    };

    localStorage.setItem(key, JSON.stringify(updated));
};

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
    incorrectCount: number;
    isGameOver: boolean;
    isClear: boolean;
    sprintTimes: number[]; // Track time spent per hand for SPRINT mode
    lastScoreBreakdown: {
        baseScore: number;

        lifeBonus: number;
        timeBonus: number;
        totalScore: number;
        timeLeft: number;
        lives: number;
        sprintTimes?: number[];
        incorrectCount?: number;
        totalQuestions?: number;
    } | null;
    unlockedTrophies: string[]; // Array of trophy IDs
    trophyUnlockDates: Record<string, number>; // Map of trophy ID to unlock timestamp
    newlyUnlockedTrophies: string[]; // Trophies unlocked in current session
    hasErrors: boolean; // Track if any mistakes were made in current game
    fastBonusCount: number; // Track number of FAST bonuses in current game
    isTimeUp: boolean; // Track if time ran out
    isNewRecord: boolean; // Track if current score is a new record
    previousBestScore: number | undefined; // Best score at start of game
    sprintTimeAccumulator: number; // Accumulate time for incorrect answers in Sprint mode

    // Actions
    startGame: (mode: GameMode, difficulty: Difficulty) => void;
    endGame: (forceClear?: boolean, isGiveUp?: boolean) => void;
    nextHand: () => void;
    toggleWait: (tile: Tile) => void;
    submitAnswer: () => { correct: boolean; correctWaits: Tile[]; points?: number; fastBonus?: number; timeSpent?: number; bonuses?: string[]; gameEnding?: boolean };
    tick: () => void;
    resetGame: () => void;
    startGameTimer: () => void;
    checkAndUnlockTrophies: () => void;
    clearNewlyUnlockedTrophies: () => void;
}

const TROPHY_STORAGE_KEY = STORAGE_KEYS.UNLOCKED_TROPHIES;
const TROPHY_DATES_STORAGE_KEY = STORAGE_KEYS.TROPHY_DATES;

// Load unlocked trophies from localStorage
const loadUnlockedTrophies = (): string[] => {
    const stored = localStorage.getItem(TROPHY_STORAGE_KEY);
    if (!stored) return [];
    try {
        return JSON.parse(stored) as string[];
    } catch {
        return [];
    }
};

// Save unlocked trophies to localStorage
const saveUnlockedTrophies = (trophies: string[]): void => {
    localStorage.setItem(TROPHY_STORAGE_KEY, JSON.stringify(trophies));
};

// Load trophy dates from localStorage
const loadTrophyDates = (): Record<string, number> => {
    const stored = localStorage.getItem(TROPHY_DATES_STORAGE_KEY);
    if (!stored) return {};
    try {
        return JSON.parse(stored) as Record<string, number>;
    } catch {
        return {};
    }
};

// Save trophy dates to localStorage
const saveTrophyDates = (dates: Record<string, number>): void => {
    localStorage.setItem(TROPHY_DATES_STORAGE_KEY, JSON.stringify(dates));
};

export const useGameStore = create<GameState>((set, get) => ({
    isPlaying: false,
    score: 0,
    lives: LIVES.INITIAL,
    timeLeft: 0,
    currentHand: [],
    currentWaits: [],
    selectedWaits: [],
    difficulty: 'normal',
    mode: 'challenge',
    questionStartTime: 0,
    correctCount: 0,
    incorrectCount: 0,
    isGameOver: false,
    isClear: false,
    lastScoreBreakdown: null,
    sprintTimes: [],
    unlockedTrophies: loadUnlockedTrophies(),
    trophyUnlockDates: loadTrophyDates(),
    newlyUnlockedTrophies: [],
    hasErrors: false,
    fastBonusCount: 0,
    isTimeUp: false,
    isNewRecord: false,
    previousBestScore: undefined,
    sprintTimeAccumulator: 0,

    gameEndTime: 0,

    startGame: (mode, difficulty) => {
        let lives = LIVES.INITIAL;
        let duration = 0;

        switch (mode) {
            case 'sprint':
                lives = LIVES.SPRINT;
                duration = 0; // No time limit, count up timer
                break;
            case 'survival':
                lives = LIVES.SURVIVAL;
                switch (difficulty) {
                    case 'beginner': duration = DURATION.SURVIVAL.BEGINNER; break;
                    case 'amateur': duration = DURATION.SURVIVAL.AMATEUR; break;
                    case 'normal': duration = DURATION.SURVIVAL.NORMAL; break;
                    case 'expert': duration = DURATION.SURVIVAL.EXPERT; break;
                    case 'master': duration = DURATION.SURVIVAL.MASTER; break;
                }
                break;
            case 'practice':
                lives = LIVES.PRACTICE;
                duration = 0;
                break;
            case 'challenge':
            default:
                lives = LIVES.INITIAL;
                switch (difficulty) {
                    case 'beginner': duration = DURATION.CHALLENGE.BEGINNER; break;
                    case 'amateur': duration = DURATION.CHALLENGE.AMATEUR; break;
                    case 'normal': duration = DURATION.CHALLENGE.NORMAL; break;
                    case 'expert': duration = DURATION.CHALLENGE.EXPERT; break;
                    case 'master': duration = DURATION.CHALLENGE.MASTER; break;
                }
                break;
        }

        // Get previous best score (not available for practice mode)
        let previousBestScore: number | undefined = undefined;
        if (mode !== 'practice') {
            const stats = getModeStats(mode, difficulty);
            previousBestScore = stats.bestScore;
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
            incorrectCount: 0,
            isGameOver: false,
            isClear: false,
            lastScoreBreakdown: null,
            sprintTimes: [],
            hasErrors: false,
            fastBonusCount: 0,
            isTimeUp: false,
            isNewRecord: false,
            previousBestScore,
            sprintTimeAccumulator: 0
        });

        // Update practice mode stats
        if (mode === 'practice') {
            updateGlobalStats({
                practiceAttempts: 1
            });
        }

        get().nextHand();
    },

    endGame: (forceClear: boolean = false, isGiveUp: boolean = false) => {
        set({ isNewRecord: false });

        // Common data for breakdown
        const { score, timeLeft, lives, mode, correctCount, incorrectCount, sprintTimes, gameEndTime, isClear: alreadyClear } = get();

        // Determine clear status based on mode and conditions
        let isClear = alreadyClear;
        if (forceClear) {
            isClear = true;
        } else if (isGiveUp) {
            // Special handling for Survival on Give Up
            if (mode === 'survival' && correctCount > 0) {
                isClear = true;
            } else {
                isClear = false;
            }
        } else {
            // Normal game end checks
            if (mode === 'sprint') {
                isClear = correctCount >= LIMITS.CLEAR_COUNT;
            } else if (mode === 'survival') {
                isClear = correctCount > 0;
            } else if (mode === 'practice') {
                isClear = true; // Practice is always "done"
            } else if (mode === 'challenge') {
                isClear = correctCount >= LIMITS.CLEAR_COUNT;
            }
        }

        let finalScore = score;
        let finalTimeBonus = 0;
        let finalLifeBonus = 0;
        let finalTimeLeft = 0;
        let finalLives = 0;

        // Calculate final score and bonuses
        if (mode === 'challenge') {
            // Only calculate bonuses if NOT giving up, OR if forceClear
            if (!isGiveUp || forceClear) {
                // If cleared normally or forced
                if (isClear) {
                    finalTimeLeft = timeLeft;
                    finalLives = lives;
                    finalTimeBonus = timeLeft * SCORE.TIME_BONUS_MULTIPLIER;
                    finalLifeBonus = lives * SCORE.LIFE_BONUS_MULTIPLIER;
                    finalScore = score + finalTimeBonus + finalLifeBonus;
                }
            }
            // If give up, keep current score (no bonuses)
        } else if (mode === 'sprint') {
            if (isClear) {
                // If cleared, score is elapsed time
                const elapsedTime = (Date.now() - gameEndTime) / 1000;
                finalScore = elapsedTime;
            } else {
                // If failed/give up, score is meaningless for ranking, but keep it for display?
                // Actually for sprint failed, we usually don't show time score.
                finalScore = 0;
            }
        } else if (mode === 'survival') {
            finalScore = correctCount;
        } else if (mode === 'practice') {
            finalScore = correctCount;
        }

        set({
            isPlaying: false,
            isGameOver: true,
            isClear,
            score: finalScore,
            lastScoreBreakdown: {
                baseScore: score, // Base score before time/life bonuses
                lifeBonus: finalLifeBonus,
                timeBonus: finalTimeBonus,
                totalScore: finalScore,
                timeLeft: finalTimeLeft,
                lives: finalLives,
                sprintTimes: sprintTimes,
                incorrectCount: incorrectCount,
                totalQuestions: correctCount + incorrectCount
            }
        });

        // Save record for CHALLENGE, SPRINT, and SURVIVAL modes
        const { mode: currentMode, difficulty: currentDifficulty, score: currentScore, isClear: currentIsClear, hasErrors: currentHasErrors } = get();
        if ((currentMode === 'challenge' || currentMode === 'sprint' || currentMode === 'survival')) {
            // Save Record (always for challenge, only on clear for sprint/survival)
            if (currentMode === 'challenge' || currentIsClear) {
                // Check if this is a new record BEFORE saving
                const existingRecords = getRecords(currentMode, currentDifficulty);
                let isNewRecord = false;
                if (existingRecords.length === 0) {
                    isNewRecord = true;
                } else {
                    const currentBest = existingRecords[0].score;
                    // Sprint mode: lower time is better
                    isNewRecord = currentMode === 'sprint' ? currentScore < currentBest : currentScore > currentBest;
                }
                set({ isNewRecord });

                const record: GameRecord = {
                    mode: currentMode,
                    difficulty: currentDifficulty,
                    score: currentScore,
                    date: Date.now()
                };
                saveRecord(record);
            }

            // Update Mode Stats (only game-level stats)
            updateModeStats(currentMode, currentDifficulty, {
                attempts: 1,
                clears: currentIsClear ? 1 : 0,
                noMissClears: (currentIsClear && !currentHasErrors) ? 1 : 0,
                bestScore: (currentMode === 'sprint' && !currentIsClear) ? undefined : currentScore
            });
        }

        // Check and unlock trophies (Always check for all modes, including Practice)
        get().checkAndUnlockTrophies();
    },

    nextHand: () => {
        const { difficulty } = get();
        let options = {};

        switch (difficulty) {
            case 'beginner':
                options = HAND_CONFIG.BEGINNER;
                break;
            case 'amateur':
                options = HAND_CONFIG.AMATEUR;
                break;
            case 'normal':
                options = HAND_CONFIG.NORMAL;
                break;
            case 'expert':
                options = HAND_CONFIG.EXPERT;
                break;
            case 'master':
                options = HAND_CONFIG.MASTER;
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
        const { currentWaits, selectedWaits, questionStartTime, score, lives, mode, difficulty, correctCount, timeLeft, sprintTimeAccumulator } = get();

        // Check if arrays are equal
        const sortedCurrent = [...currentWaits].sort((a, b) => a - b);
        const sortedSelected = [...selectedWaits].sort((a, b) => a - b);
        const isCorrect = JSON.stringify(sortedCurrent) === JSON.stringify(sortedSelected);

        if (isCorrect) {
            const timeSpent = (Date.now() - questionStartTime) / 1000;

            // Calculate Score (New Formula)
            const baseScore = currentWaits.length * SCORE.BASE_MULTIPLIER;
            const fastThreshold = 2 + currentWaits.length * 1; // 2秒 + 待ちの数 * 1秒
            const fastBonus = timeSpent <= fastThreshold ? Math.floor(baseScore * SCORE.FAST_BONUS_MULTIPLIER) : 0;

            // SPRINT mode: no score, only track time
            const points = mode === 'sprint' ? 0 : baseScore + fastBonus;

            const newCorrectCount = correctCount + 1;

            if (mode === 'survival') {
                const timeToAdd = currentWaits.length * SCORE.SURVIVAL_TIME_BONUS_MULTIPLIER;
                const newGameEndTime = get().gameEndTime + timeToAdd * 1000;
                set({
                    score: newCorrectCount,
                    correctCount: newCorrectCount,
                    gameEndTime: newGameEndTime,
                    timeLeft: timeLeft + timeToAdd
                });
            } else {
                // For Sprint mode: Add accumulated time from incorrect attempts to current timeSpent
                const totalSprintTimeForHand = mode === 'sprint' ? sprintTimeAccumulator + timeSpent : timeSpent;

                set({
                    score: score + points,
                    correctCount: newCorrectCount,
                    sprintTimes: mode === 'sprint' ? [...get().sprintTimes, totalSprintTimeForHand] : get().sprintTimes,
                    fastBonusCount: (mode === 'challenge' && fastBonus > 0) ? get().fastBonusCount + 1 : get().fastBonusCount,
                    // Reset questionStartTime for next question in Sprint mode (for cumulative tracking)
                    questionStartTime: mode === 'sprint' ? Date.now() : get().questionStartTime,
                    sprintTimeAccumulator: 0 // Reset accumulator after correct answer
                });
            }

            // Check Clear Condition for CHALLENGE
            if (mode === 'challenge' && newCorrectCount >= LIMITS.CLEAR_COUNT) {
                // Mark as clear, bonuses will be calculated in endGame
                set({
                    score: score + points, // Just add the last question's points
                    isClear: true
                });
            }


            // Check Clear Condition for SPRINT
            const isSprintEnd = mode === 'sprint' && newCorrectCount >= LIMITS.CLEAR_COUNT;

            // Save question result for statistics
            saveQuestionResult({
                mode,
                difficulty,
                waitCount: currentWaits.length,
                correct: true,
                responseTime: timeSpent,
                fastBonus: fastBonus > 0,
                timestamp: Date.now()
            });

            // Update mode stats immediately (only for non-practice modes)
            if (mode !== 'practice') {
                updateModeStats(mode, difficulty, {
                    totalQuestions: 1,
                    correctAnswers: 1,
                    totalResponseTime: timeSpent,
                    fastBonuses: (mode === 'challenge' && fastBonus > 0) ? 1 : 0
                });
            }

            // Update Global Stats (for all modes including practice)
            const globalUpdates: Partial<GlobalStats> = {
                totalCorrect: 1,
                wait3Plus: currentWaits.length >= 3 ? 1 : 0,
                wait6Plus: currentWaits.length >= 6 ? 1 : 0,
                wait9: currentWaits.length === 9 ? 1 : 0,
                fastBonusCount: (mode === 'challenge' && fastBonus > 0) ? 1 : 0
            };

            // Update waitStats
            const currentGlobal = getGlobalStats();
            const waitCount = currentWaits.length;
            const currentWaitCount = currentGlobal.waitStats[waitCount] || 0;
            globalUpdates.waitStats = {
                [waitCount]: currentWaitCount + 1
            };

            updateGlobalStats(globalUpdates);


            return {
                correct: true,
                correctWaits: currentWaits,
                points: mode === 'survival' ? 0 : points,
                fastBonus,
                timeSpent,
                bonuses: mode === 'survival'
                    ? [`+${currentWaits.length * SCORE.SURVIVAL_TIME_BONUS_MULTIPLIER} s`]
                    : [fastBonus > 0 ? 'FAST' : ''].filter(Boolean),
                gameEnding: (mode === 'challenge' && newCorrectCount >= LIMITS.CLEAR_COUNT) || isSprintEnd
            };

        } else {
            // Handle wrong answer based on mode
            let newLives = lives;
            if (mode === 'survival') {
                newLives = 0;
            } else if (mode !== 'practice' && mode !== 'sprint') {
                newLives = lives - 1;
            }

            const timeSpent = (Date.now() - questionStartTime) / 1000;

            set({
                lives: newLives,
                incorrectCount: get().incorrectCount + 1,
                hasErrors: true,
                // Accumulate time for Sprint mode
                sprintTimeAccumulator: mode === 'sprint' ? get().sprintTimeAccumulator + timeSpent : 0
            });

            // Save question result for statistics
            saveQuestionResult({
                mode,
                difficulty,
                waitCount: currentWaits.length,
                correct: false,
                responseTime: timeSpent,
                fastBonus: false,
                timestamp: Date.now()
            });

            // Update mode stats immediately (only for non-practice modes)
            if (mode !== 'practice') {
                updateModeStats(mode, difficulty, {
                    totalQuestions: 1,
                    correctAnswers: 0,
                    totalResponseTime: timeSpent,
                    fastBonuses: 0
                });
            }

            return {
                correct: false,
                correctWaits: currentWaits,
                points: 0,
                bonuses: [],
                gameEnding: newLives <= 0
            };
        }
    },

    tick: () => {
        const { isPlaying, mode, gameEndTime } = get();
        if (!isPlaying) return;

        if (mode === 'challenge' || mode === 'survival') {
            const now = Date.now();
            if (gameEndTime > 0) {
                const remaining = Math.max(0, Math.ceil((gameEndTime - now) / 1000));
                set({ timeLeft: remaining });

                if (remaining <= 0) {
                    set({ isTimeUp: true });
                }
            }
        }
    },

    resetGame: () => {
        set({
            isPlaying: false,
            score: 0,
            lives: LIVES.INITIAL,
            timeLeft: 0,
            currentHand: [],
            currentWaits: [],
            selectedWaits: [],
            correctCount: 0,
            isGameOver: false,
            isClear: false,
            lastScoreBreakdown: null,
        });
    },

    startGameTimer: () => {
        const { mode, difficulty } = get();
        const now = Date.now();
        let gameEndTime = 0;
        let timeLeft = 0;

        if (mode === 'sprint') {
            gameEndTime = now;
            timeLeft = 0;
        } else {
            let duration = 0;
            if (mode === 'challenge') {
                switch (difficulty) {
                    case 'beginner': duration = 90; break;
                    case 'amateur': duration = 120; break;
                    case 'normal': duration = 180; break;
                    case 'expert': duration = 240; break;
                    case 'master': duration = 300; break;
                }
            } else if (mode === 'survival') {
                switch (difficulty) {
                    case 'beginner': duration = 30; break;
                    case 'amateur': duration = 45; break;
                    case 'normal': duration = 60; break;
                    case 'expert': duration = 90; break;
                    case 'master': duration = 120; break;
                }
            }

            if (duration > 0) {
                gameEndTime = now + duration * 1000;
                timeLeft = duration;
            }
        }

        set({
            questionStartTime: now,
            gameEndTime,
            timeLeft
        });
    },

    checkAndUnlockTrophies: () => {
        const { mode, difficulty, isClear, score, hasErrors, fastBonusCount, unlockedTrophies, trophyUnlockDates, sprintTimes } = get();

        // Calculate total time for sprint mode
        const totalTime = sprintTimes.reduce((sum, time) => sum + time, 0);

        const gameState = {
            mode,
            difficulty,
            isClear,
            score,
            hasErrors,
            fastBonusCount,
            totalTime: totalTime / 1000 // Convert to seconds
        };

        // Collect all mode stats
        const modeStats: Record<string, ModeStats> = {};
        const modes = ['challenge', 'sprint', 'survival'] as const;
        const difficulties = ['beginner', 'amateur', 'normal', 'expert', 'master'] as const;

        for (const m of modes) {
            for (const d of difficulties) {
                const key = `${m}_${d}`;
                modeStats[key] = getModeStats(m, d);
            }
        }

        const globalStats = getGlobalStats();
        const newlyUnlocked: string[] = [];
        const now = Date.now();
        const newDates = { ...trophyUnlockDates };

        // Check all trophies except platinum
        for (const trophy of TROPHIES) {
            if (trophy.id === 'PLATINUM_ALL_TROPHIES') continue; // Handle platinum separately

            // Skip if already unlocked
            if (unlockedTrophies.includes(trophy.id)) continue;

            // Check if trophy should be unlocked
            const trophyCheckState = {
                ...gameState,
                modeStats,
                globalStats,
                unlockedTrophies,
                isTimeUp: get().isTimeUp,
                correctCount: get().correctCount,
                remainingTime: get().timeLeft * 1000 // Convert back to ms for consistency if needed, or adjust check logic
            };

            if (checkTrophyUnlock(trophy, trophyCheckState)) {
                newlyUnlocked.push(trophy.id);
                newDates[trophy.id] = now; // Record unlock timestamp
            }
        }

        // Check platinum trophy (all other trophies except platinum itself)
        if (!unlockedTrophies.includes('PLATINUM_ALL_TROPHIES')) {
            const allOtherTrophies = TROPHIES.filter(t => t.id !== 'PLATINUM_ALL_TROPHIES');
            const allUnlocked = allOtherTrophies.every(t =>
                unlockedTrophies.includes(t.id) || newlyUnlocked.includes(t.id)
            );

            if (allUnlocked) {
                newlyUnlocked.push('PLATINUM_ALL_TROPHIES');
                newDates['PLATINUM_ALL_TROPHIES'] = now;
            }
        }

        // Update state if any trophies were unlocked
        if (newlyUnlocked.length > 0) {
            const updatedUnlockedTrophies = [...unlockedTrophies, ...newlyUnlocked];
            saveUnlockedTrophies(updatedUnlockedTrophies);
            saveTrophyDates(newDates);
            set({
                unlockedTrophies: updatedUnlockedTrophies,
                trophyUnlockDates: newDates,
                newlyUnlockedTrophies: newlyUnlocked
            });
        }
    },

    clearNewlyUnlockedTrophies: () => {
        set({ newlyUnlockedTrophies: [] });
    }
}));

// Trophy stats functions
export const getTrophyStats = () => {
    const unlocked = loadUnlockedTrophies();
    // Count all trophies including platinum
    const totalTrophies = TROPHIES.length;

    // Count by tier
    const byTier = {
        bronze: { unlocked: 0, total: 0 },
        silver: { unlocked: 0, total: 0 },
        gold: { unlocked: 0, total: 0 },
        platinum: { unlocked: 0, total: 0 }
    };

    TROPHIES.forEach(trophy => {
        byTier[trophy.tier].total++;
        if (unlocked.includes(trophy.id)) {
            byTier[trophy.tier].unlocked++;
        }
    });

    return {
        unlocked: unlocked.length,
        total: totalTrophies,
        byTier
    };
};

// Difficulty-based stats
export const getDifficultyStats = (): Record<Difficulty, { correct: number; total: number; totalTime: number }> => {
    const questionResults = getQuestionResults();
    const difficulties: Difficulty[] = ['beginner', 'amateur', 'normal', 'expert', 'master'];

    const stats: Record<string, { correct: number; total: number; totalTime: number }> = {};

    difficulties.forEach(diff => {
        const filtered = questionResults.filter(r => r.difficulty === diff);
        stats[diff] = {
            correct: filtered.filter(r => r.correct).length,
            total: filtered.length,
            totalTime: filtered.reduce((sum, r) => sum + r.responseTime, 0)
        };
    });

    return stats as Record<Difficulty, { correct: number; total: number; totalTime: number }>;
};

// Mode-based stats
export const getStatsByMode = (): Record<'challenge' | 'sprint' | 'survival' | 'practice', { correct: number; total: number; totalTime: number }> => {
    const questionResults = getQuestionResults();
    const modes: ('challenge' | 'sprint' | 'survival' | 'practice')[] = ['challenge', 'sprint', 'survival', 'practice'];

    const stats: Record<string, { correct: number; total: number; totalTime: number }> = {};

    modes.forEach(mode => {
        const filtered = questionResults.filter(r => r.mode === mode);
        stats[mode] = {
            correct: filtered.filter(r => r.correct).length,
            total: filtered.length,
            totalTime: filtered.reduce((sum, r) => sum + r.responseTime, 0)
        };
    });

    return stats as Record<'challenge' | 'sprint' | 'survival' | 'practice', { correct: number; total: number; totalTime: number }>;
};

