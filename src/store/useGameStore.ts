import { create } from 'zustand';
import type { Tile, Hand } from '../utils/mahjong';
import { Mahjong } from '../utils/mahjong';
import { TROPHIES, checkTrophyUnlock } from '../data/trophies';

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
    return `menchin_records_${mode}_${difficulty}`;
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
    const top10 = updatedRecords.slice(0, 10);

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
    mode: 'challenge' | 'sprint' | 'survival';
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
const STATS_STORAGE_KEY = 'menchin_question_results';
const MODE_STATS_KEY = 'menchin_mode_stats';
const GLOBAL_STATS_KEY = 'menchin_global_stats';

// Global statistics (across all modes and difficulties)
export interface GlobalStats {
    totalCorrect: number; // Total correct answers across all modes
    wait3Plus: number; // Correct answers with 3+ tile waits
    wait6Plus: number; // Correct answers with 6+ tile waits
    wait9: number; // Correct answers with 9 tile waits
    practiceAttempts: number; // Practice mode play count
}

export const saveQuestionResult = (result: QuestionResult): void => {
    const stored = localStorage.getItem(STATS_STORAGE_KEY);
    const results: QuestionResult[] = stored ? JSON.parse(stored) : [];
    results.push(result);

    // Keep only last 10000 results to prevent storage overflow
    if (results.length > 10000) {
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
            practiceAttempts: 0
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
            practiceAttempts: 0
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
        practiceAttempts: updates.practiceAttempts !== undefined ? current.practiceAttempts + updates.practiceAttempts : current.practiceAttempts
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
        clearBonus: number;
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

    // Actions
    startGame: (mode: GameMode, difficulty: Difficulty) => void;
    endGame: (forceClear?: boolean) => void;
    nextHand: () => void;
    toggleWait: (tile: Tile) => void;
    submitAnswer: () => { correct: boolean; correctWaits: Tile[]; points?: number; fastBonus?: number; timeSpent?: number; bonuses?: string[] };
    tick: () => void;
    resetGame: () => void;
    startGameTimer: () => void;
    checkAndUnlockTrophies: () => void;
    clearNewlyUnlockedTrophies: () => void;
}

const INITIAL_LIVES = 3;
const TROPHY_STORAGE_KEY = 'menchin_unlocked_trophies';
const TROPHY_DATES_STORAGE_KEY = 'menchin_trophy_dates';

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
    lives: INITIAL_LIVES,
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

    gameEndTime: 0,

    startGame: (mode, difficulty) => {
        let lives = INITIAL_LIVES;
        let duration = 0;

        switch (mode) {
            case 'sprint':
                lives = 99;
                duration = 0; // No time limit, count up timer
                break;
            case 'survival':
                lives = 1;
                duration = 30;
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
            incorrectCount: 0,
            isGameOver: false,
            isClear: false,
            lastScoreBreakdown: null,
            sprintTimes: [],
            hasErrors: false
        });

        // Update practice mode stats
        if (mode === 'practice') {
            updateGlobalStats({
                practiceAttempts: 1
            });
        }

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
                    totalScore,
                    timeLeft,
                    lives
                }
            });
        } else {
            const { score, isClear, lastScoreBreakdown, mode, gameEndTime } = get();

            if (isClear && lastScoreBreakdown) {
                set({
                    isPlaying: false,
                    isGameOver: true
                });
            } else {
                // For SPRINT mode, calculate elapsed time
                if (mode === 'sprint') {
                    const elapsedTime = (Date.now() - gameEndTime) / 1000; // in seconds
                    set({
                        isPlaying: false,
                        isGameOver: true,
                        isClear: true,
                        score: elapsedTime, // Store elapsed time as "score" for SPRINT
                        lastScoreBreakdown: {
                            baseScore: elapsedTime,
                            clearBonus: 0,
                            lifeBonus: 0,
                            timeBonus: 0,
                            totalScore: elapsedTime,
                            timeLeft: 0,
                            lives: 0,
                            sprintTimes: get().sprintTimes
                        }
                    });
                } else if (mode === 'survival') {
                    const { correctCount } = get();
                    const isClear = correctCount > 0;
                    set({
                        isPlaying: false,
                        isGameOver: true,
                        isClear,
                        score: correctCount,
                        lastScoreBreakdown: {
                            baseScore: correctCount,
                            clearBonus: 0,
                            lifeBonus: 0,
                            timeBonus: 0,
                            totalScore: correctCount,
                            timeLeft: 0,
                            lives: 0
                        }
                    });
                } else if (mode === 'practice') {
                    const { correctCount, incorrectCount } = get();
                    const totalQuestions = correctCount + incorrectCount;
                    set({
                        isPlaying: false,
                        isGameOver: true,
                        isClear: true,
                        score: correctCount,
                        lastScoreBreakdown: {
                            baseScore: correctCount,
                            clearBonus: 0,
                            lifeBonus: 0,
                            timeBonus: 0,
                            totalScore: correctCount,
                            timeLeft: 0,
                            lives: 0,
                            incorrectCount,
                            totalQuestions
                        }
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
                            totalScore: score,
                            timeLeft: 0,
                            lives: 0
                        }
                    });
                }
            }
        }

        // Save record for CHALLENGE, SPRINT, and SURVIVAL modes
        const { mode, difficulty, score, isClear, hasErrors } = get();
        if ((mode === 'challenge' || mode === 'sprint' || mode === 'survival')) {
            // Save Record (always for challenge, only on clear for sprint/survival)
            if (mode === 'challenge' || isClear) {
                const record: GameRecord = {
                    mode,
                    difficulty,
                    score,
                    date: Date.now()
                };
                saveRecord(record);
            }

            // Update Mode Stats (only game-level stats)
            updateModeStats(mode, difficulty, {
                attempts: 1,
                clears: isClear ? 1 : 0,
                noMissClears: (isClear && !hasErrors) ? 1 : 0,
                bestScore: (mode === 'sprint' && !isClear) ? undefined : score
            });
        }

        // Check and unlock trophies (for all modes including practice)
        get().checkAndUnlockTrophies();
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

            // SPRINT mode: no score, only track time
            const points = mode === 'sprint' ? 0 : baseScore + fastBonus;

            const newCorrectCount = correctCount + 1;

            if (mode === 'survival') {
                const timeToAdd = currentWaits.length + 1;
                const newGameEndTime = get().gameEndTime + timeToAdd * 1000;
                set({
                    score: newCorrectCount,
                    correctCount: newCorrectCount,
                    gameEndTime: newGameEndTime,
                    timeLeft: timeLeft + timeToAdd
                });
            } else {
                set({
                    score: score + points,
                    correctCount: newCorrectCount,
                    sprintTimes: mode === 'sprint' ? [...get().sprintTimes, timeSpent] : get().sprintTimes
                });
            }

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
                        totalScore,
                        timeLeft,
                        lives
                    }
                });
                get().endGame();
            }

            // Check Clear Condition for SPRINT
            if (mode === 'sprint' && newCorrectCount >= 10) {
                get().endGame();
            }

            // Save question result for statistics (exclude practice mode)
            if (mode !== 'practice') {
                saveQuestionResult({
                    mode,
                    difficulty,
                    waitCount: currentWaits.length,
                    correct: true,
                    responseTime: timeSpent,
                    fastBonus: fastBonus > 0,
                    timestamp: Date.now()
                });

                // Update mode stats immediately
                updateModeStats(mode, difficulty, {
                    totalQuestions: 1,
                    correctAnswers: 1,
                    totalResponseTime: timeSpent,
                    fastBonuses: fastBonus > 0 ? 1 : 0
                });

                // Update global stats
                const waitCount = currentWaits.length;
                updateGlobalStats({
                    totalCorrect: 1,
                    wait3Plus: waitCount >= 3 ? 1 : 0,
                    wait6Plus: waitCount >= 6 ? 1 : 0,
                    wait9: waitCount === 9 ? 1 : 0
                });
            }

            return {
                correct: true,
                correctWaits: currentWaits,
                points: mode === 'survival' ? 0 : points,
                fastBonus,
                timeSpent,
                bonuses: mode === 'survival'
                    ? [`+${currentWaits.length + 1} s`]
                    : [fastBonus > 0 ? 'FAST' : ''].filter(Boolean)
            };

        } else {
            // Handle wrong answer based on mode
            let newLives = lives;
            if (mode === 'survival') {
                newLives = 0;
            } else if (mode !== 'practice' && mode !== 'sprint') {
                newLives = lives - 1;
            }

            set({
                lives: newLives,
                incorrectCount: get().incorrectCount + 1,
                hasErrors: true
            });

            if (newLives <= 0) {
                get().endGame();
            }

            // Save question result for statistics (exclude practice mode)
            if (mode !== 'practice') {
                const timeSpent = (Date.now() - questionStartTime) / 1000;
                saveQuestionResult({
                    mode,
                    difficulty,
                    waitCount: currentWaits.length,
                    correct: false,
                    responseTime: timeSpent,
                    fastBonus: false,
                    timestamp: Date.now()
                });

                // Update mode stats immediately
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
                bonuses: []
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
    },

    startGameTimer: () => {
        const { mode } = get();
        const now = Date.now();
        let gameEndTime = 0;
        let timeLeft = 0;

        if (mode === 'sprint') {
            gameEndTime = now;
            timeLeft = 0;
        } else {
            const duration = mode === 'challenge' ? 120 : (mode === 'survival' ? 30 : 0);
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
        const { mode, difficulty, isClear, score, hasErrors, unlockedTrophies, trophyUnlockDates, sprintTimes } = get();

        // Calculate total time for sprint mode
        const totalTime = sprintTimes.reduce((sum, time) => sum + time, 0);

        const gameState = {
            mode,
            difficulty,
            isClear,
            score,
            hasErrors,
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

        // Get global stats
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
            if (checkTrophyUnlock(trophy.id, gameState, modeStats, globalStats)) {
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
