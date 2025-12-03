export const LIVES = {
    INITIAL: 3,
    SPRINT: 99,
    SURVIVAL: 1,
    PRACTICE: 99,
};

export const DURATION = {
    CHALLENGE: {
        BEGINNER: 90,
        AMATEUR: 120,
        NORMAL: 180,
        EXPERT: 240,
        MASTER: 300,
    },
    SURVIVAL: {
        BEGINNER: 30,
        AMATEUR: 45,
        NORMAL: 60,
        EXPERT: 90,
        MASTER: 120,
    },
} as const;

export const SCORE = {
    BASE_MULTIPLIER: 100,
    FAST_BONUS_MULTIPLIER: 0.3,
    TIME_BONUS_MULTIPLIER: 100,
    LIFE_BONUS_MULTIPLIER: 1000,
    SURVIVAL_TIME_BONUS_MULTIPLIER: 2,
} as const;

export const HAND_CONFIG = {
    BEGINNER: { tiles: 7, minWaits: 1, maxWaits: 5 },
    AMATEUR: { tiles: 10, minWaits: 1, maxWaits: 5 },
    NORMAL: { tiles: 13, minWaits: 1, maxWaits: 5 },
    EXPERT: { tiles: 13, minWaits: 3, maxWaits: 7 },
    MASTER: { tiles: 13, minWaits: 5, maxWaits: 9 },
} as const;

export const STORAGE_KEYS = {
    RECORDS_PREFIX: 'menchin_records',
    QUESTION_RESULTS: 'menchin_question_results',
    MODE_STATS: 'menchin_mode_stats',
    GLOBAL_STATS: 'menchin_global_stats',
    UNLOCKED_TROPHIES: 'menchin_unlocked_trophies',
    TROPHY_DATES: 'menchin_trophy_dates',
} as const;

export const LIMITS = {
    MAX_RECORDS: 10,
    MAX_QUESTION_RESULTS: 10000,
    CLEAR_COUNT: 10,
} as const;
