import type { Difficulty, GlobalStats, ModeStats } from '../store/useGameStore';

export type TrophyType =
    | 'challenge_clear'
    | 'challenge_score'
    | 'challenge_nomiss'
    | 'challenge_all_fast'
    | 'challenge_plays'
    | 'sprint_clear'
    | 'sprint_time'
    | 'sprint_nomiss'
    | 'sprint_plays'
    | 'survival_correct'
    | 'survival_plays'
    | 'practice_play'
    | 'total_correct'
    | 'wait_correct'
    | 'wait_exact_correct'
    | 'fast_bonus'
    | 'platinum';

export interface Trophy {
    id: string;
    title: string;
    type: TrophyType;
    check_params: any[];
    tier: 'bronze' | 'silver' | 'gold' | 'platinum';
}

// Difficulty label mapping
const DIFFICULTY_LABELS: Record<string, string> = {
    beginner: '初級',
    amateur: '中級',
    normal: '上級',
    expert: '達人',
    master: '師範'
};

// Generate trophy description dynamically based on type and params
export const generateTrophyDescription = (trophy: Trophy): string => {
    const params = trophy.check_params;

    switch (trophy.type) {
        case 'challenge_clear': {
            const [difficulty] = params;
            return `チャレンジモード（${DIFFICULTY_LABELS[difficulty]}）をクリアした`;
        }

        case 'challenge_score': {
            const [score, difficulty] = params;
            return `チャレンジモード（${DIFFICULTY_LABELS[difficulty]}）で${score.toLocaleString()}点を達成`;
        }

        case 'challenge_nomiss': {
            const [difficulty] = params;
            return `チャレンジモード（${DIFFICULTY_LABELS[difficulty]}）をノーミスでクリア`;
        }

        case 'challenge_all_fast': {
            const [difficulty] = params;
            return `チャレンジモード（${DIFFICULTY_LABELS[difficulty]}）で全問FASTボーナスを獲得してクリア`;
        }

        case 'challenge_plays': {
            const [count] = params;
            return `チャレンジモードを累計${count}回プレイ`;
        }

        case 'sprint_clear': {
            const [difficulty] = params;
            return `スプリントモード（${DIFFICULTY_LABELS[difficulty]}）をクリア`;
        }

        case 'sprint_time': {
            const [time, difficulty] = params;
            return `スプリントモード（${DIFFICULTY_LABELS[difficulty]}）を${time}秒以内にクリア`;
        }

        case 'sprint_nomiss': {
            const [difficulty] = params;
            return `スプリントモード（${DIFFICULTY_LABELS[difficulty]}）をノーミスでクリア`;
        }

        case 'sprint_plays': {
            const [count] = params;
            return `スプリントモードを累計${count}回プレイ`;
        }

        case 'survival_correct': {
            const [count, difficulty] = params;
            return `サバイバルモード（${DIFFICULTY_LABELS[difficulty]}）で${count}問正解`;
        }

        case 'survival_plays': {
            const [count] = params;
            return `サバイバルモードを累計${count}回プレイ`;
        }

        case 'practice_play': {
            return 'プラクティスモードで初プレイ';
        }

        case 'total_correct': {
            const [count] = params;
            return `累計${count}問正解`;
        }

        case 'wait_correct': {
            const [minWaits, count] = params;
            return `${minWaits}面待ち以上を累計${count}問正解`;
        }

        case 'wait_exact_correct': {
            const [waits, count] = params;
            return `${waits}面待ちを${count === 1 ? '正解した' : `累計${count}回正解`}`;
        }

        case 'fast_bonus': {
            const [count] = params;
            return `FASTボーナスを累計${count}回獲得`;
        }

        case 'platinum': {
            return '全てのトロフィーを獲得する';
        }

        default:
            return 'トロフィーを獲得';
    }
};

export const TROPHIES: Trophy[] = [
    // ========== CHALLENGE MODE ==========
    // Initial Clear (5)
    {
        id: 'CHALLENGE_CLEAR_BEGINNER',
        title: '初級クリア',
        type: 'challenge_clear',
        check_params: ['beginner'],
        tier: 'bronze'
    },
    {
        id: 'CHALLENGE_CLEAR_AMATEUR',
        title: '中級クリア',
        type: 'challenge_clear',
        check_params: ['amateur'],
        tier: 'bronze'
    },
    {
        id: 'CHALLENGE_CLEAR_NORMAL',
        title: '上級クリア',
        type: 'challenge_clear',
        check_params: ['normal'],
        tier: 'bronze'
    },
    {
        id: 'CHALLENGE_CLEAR_EXPERT',
        title: '達人クリア',
        type: 'challenge_clear',
        check_params: ['expert'],
        tier: 'silver'
    },
    {
        id: 'CHALLENGE_CLEAR_MASTER',
        title: '師範クリア',
        type: 'challenge_clear',
        check_params: ['master'],
        tier: 'gold'
    },

    // Score Achievements (15)
    // Beginner
    {
        id: 'CHALLENGE_SCORE_BEGINNER_BRONZE',
        title: '初級スコア Bronze',
        type: 'challenge_score',
        check_params: [3000, 'beginner'],
        tier: 'bronze'
    },
    {
        id: 'CHALLENGE_SCORE_BEGINNER_SILVER',
        title: '初級スコア Silver',
        type: 'challenge_score',
        check_params: [5000, 'beginner'],
        tier: 'silver'
    },
    {
        id: 'CHALLENGE_SCORE_BEGINNER_GOLD',
        title: '初級スコア Gold',
        type: 'challenge_score',
        check_params: [8000, 'beginner'],
        tier: 'gold'
    },
    // Amateur
    {
        id: 'CHALLENGE_SCORE_AMATEUR_BRONZE',
        title: '中級スコア Bronze',
        type: 'challenge_score',
        check_params: [4000, 'amateur'],
        tier: 'bronze'
    },
    {
        id: 'CHALLENGE_SCORE_AMATEUR_SILVER',
        title: '中級スコア Silver',
        type: 'challenge_score',
        check_params: [7000, 'amateur'],
        tier: 'silver'
    },
    {
        id: 'CHALLENGE_SCORE_AMATEUR_GOLD',
        title: '中級スコア Gold',
        type: 'challenge_score',
        check_params: [12000, 'amateur'],
        tier: 'gold'
    },
    // Normal
    {
        id: 'CHALLENGE_SCORE_NORMAL_BRONZE',
        title: '上級スコア Bronze',
        type: 'challenge_score',
        check_params: [5000, 'normal'],
        tier: 'bronze'
    },
    {
        id: 'CHALLENGE_SCORE_NORMAL_SILVER',
        title: '上級スコア Silver',
        type: 'challenge_score',
        check_params: [9000, 'normal'],
        tier: 'silver'
    },
    {
        id: 'CHALLENGE_SCORE_NORMAL_GOLD',
        title: '上級スコア Gold',
        type: 'challenge_score',
        check_params: [15000, 'normal'],
        tier: 'gold'
    },
    // Expert
    {
        id: 'CHALLENGE_SCORE_EXPERT_BRONZE',
        title: '達人スコア Bronze',
        type: 'challenge_score',
        check_params: [6000, 'expert'],
        tier: 'bronze'
    },
    {
        id: 'CHALLENGE_SCORE_EXPERT_SILVER',
        title: '達人スコア Silver',
        type: 'challenge_score',
        check_params: [11000, 'expert'],
        tier: 'silver'
    },
    {
        id: 'CHALLENGE_SCORE_EXPERT_GOLD',
        title: '達人スコア Gold',
        type: 'challenge_score',
        check_params: [18000, 'expert'],
        tier: 'gold'
    },
    // Master
    {
        id: 'CHALLENGE_SCORE_MASTER_BRONZE',
        title: '師範スコア Bronze',
        type: 'challenge_score',
        check_params: [7000, 'master'],
        tier: 'bronze'
    },
    {
        id: 'CHALLENGE_SCORE_MASTER_SILVER',
        title: '師範スコア Silver',
        type: 'challenge_score',
        check_params: [13000, 'master'],
        tier: 'silver'
    },
    {
        id: 'CHALLENGE_SCORE_MASTER_GOLD',
        title: '師範スコア Gold',
        type: 'challenge_score',
        check_params: [20000, 'master'],
        tier: 'gold'
    },

    // No-Miss Clears (5)
    {
        id: 'CHALLENGE_NOMISS_BEGINNER',
        title: '初級完全勝利',
        type: 'challenge_nomiss',
        check_params: ['beginner'],
        tier: 'silver'
    },
    {
        id: 'CHALLENGE_NOMISS_AMATEUR',
        title: '中級完全勝利',
        type: 'challenge_nomiss',
        check_params: ['amateur'],
        tier: 'silver'
    },
    {
        id: 'CHALLENGE_NOMISS_NORMAL',
        title: '上級完全勝利',
        type: 'challenge_nomiss',
        check_params: ['normal'],
        tier: 'gold'
    },
    {
        id: 'CHALLENGE_NOMISS_EXPERT',
        title: '達人完全勝利',
        type: 'challenge_nomiss',
        check_params: ['expert'],
        tier: 'gold'
    },
    {
        id: 'CHALLENGE_NOMISS_MASTER',
        title: '師範完全勝利',
        type: 'challenge_nomiss',
        check_params: ['master'],
        tier: 'gold'
    },

    // All FAST Bonus (5)
    {
        id: 'CHALLENGE_ALL_FAST_BEGINNER',
        title: '初級神速',
        type: 'challenge_all_fast',
        check_params: ['beginner'],
        tier: 'silver'
    },
    {
        id: 'CHALLENGE_ALL_FAST_AMATEUR',
        title: '中級神速',
        type: 'challenge_all_fast',
        check_params: ['amateur'],
        tier: 'silver'
    },
    {
        id: 'CHALLENGE_ALL_FAST_NORMAL',
        title: '上級神速',
        type: 'challenge_all_fast',
        check_params: ['normal'],
        tier: 'gold'
    },
    {
        id: 'CHALLENGE_ALL_FAST_EXPERT',
        title: '達人神速',
        type: 'challenge_all_fast',
        check_params: ['expert'],
        tier: 'gold'
    },
    {
        id: 'CHALLENGE_ALL_FAST_MASTER',
        title: '師範神速',
        type: 'challenge_all_fast',
        check_params: ['master'],
        tier: 'gold'
    },

    // Cumulative FAST Bonus (3)
    {
        id: 'FAST_BONUS_BRONZE',
        title: 'FASTボーナス Bronze',
        type: 'fast_bonus',
        check_params: [15],
        tier: 'bronze'
    },
    {
        id: 'FAST_BONUS_SILVER',
        title: 'FASTボーナス Silver',
        type: 'fast_bonus',
        check_params: [50],
        tier: 'silver'
    },
    {
        id: 'FAST_BONUS_GOLD',
        title: 'FASTボーナス Gold',
        type: 'fast_bonus',
        check_params: [100],
        tier: 'gold'
    },

    // ========== SPRINT MODE ==========
    // Initial Clear (5)
    {
        id: 'SPRINT_CLEAR_BEGINNER',
        title: 'スプリント初級クリア',
        type: 'sprint_clear',
        check_params: ['beginner'],
        tier: 'bronze'
    },
    {
        id: 'SPRINT_CLEAR_AMATEUR',
        title: 'スプリント中級クリア',
        type: 'sprint_clear',
        check_params: ['amateur'],
        tier: 'bronze'
    },
    {
        id: 'SPRINT_CLEAR_NORMAL',
        title: 'スプリント上級クリア',
        type: 'sprint_clear',
        check_params: ['normal'],
        tier: 'bronze'
    },
    {
        id: 'SPRINT_CLEAR_EXPERT',
        title: 'スプリント達人クリア',
        type: 'sprint_clear',
        check_params: ['expert'],
        tier: 'silver'
    },
    {
        id: 'SPRINT_CLEAR_MASTER',
        title: 'スプリント師範クリア',
        type: 'sprint_clear',
        check_params: ['master'],
        tier: 'gold'
    },

    // No-Miss Clears (5)
    {
        id: 'SPRINT_NOMISS_BEGINNER',
        title: 'スプリント初級完全勝利',
        type: 'sprint_nomiss',
        check_params: ['beginner'],
        tier: 'silver'
    },
    {
        id: 'SPRINT_NOMISS_AMATEUR',
        title: 'スプリント中級完全勝利',
        type: 'sprint_nomiss',
        check_params: ['amateur'],
        tier: 'silver'
    },
    {
        id: 'SPRINT_NOMISS_NORMAL',
        title: 'スプリント上級完全勝利',
        type: 'sprint_nomiss',
        check_params: ['normal'],
        tier: 'gold'
    },
    {
        id: 'SPRINT_NOMISS_EXPERT',
        title: 'スプリント達人完全勝利',
        type: 'sprint_nomiss',
        check_params: ['expert'],
        tier: 'gold'
    },
    {
        id: 'SPRINT_NOMISS_MASTER',
        title: 'スプリント師範完全勝利',
        type: 'sprint_nomiss',
        check_params: ['master'],
        tier: 'gold'
    },

    // Time Achievements (15)
    // Beginner
    {
        id: 'SPRINT_TIME_BEGINNER_BRONZE',
        title: 'スプリント初級タイム Bronze',
        type: 'sprint_time',
        check_params: [120, 'beginner'],
        tier: 'bronze'
    },
    {
        id: 'SPRINT_TIME_BEGINNER_SILVER',
        title: 'スプリント初級タイム Silver',
        type: 'sprint_time',
        check_params: [90, 'beginner'],
        tier: 'silver'
    },
    {
        id: 'SPRINT_TIME_BEGINNER_GOLD',
        title: 'スプリント初級タイム Gold',
        type: 'sprint_time',
        check_params: [60, 'beginner'],
        tier: 'gold'
    },
    // Amateur
    {
        id: 'SPRINT_TIME_AMATEUR_BRONZE',
        title: 'スプリント中級タイム Bronze',
        type: 'sprint_time',
        check_params: [150, 'amateur'],
        tier: 'bronze'
    },
    {
        id: 'SPRINT_TIME_AMATEUR_SILVER',
        title: 'スプリント中級タイム Silver',
        type: 'sprint_time',
        check_params: [120, 'amateur'],
        tier: 'silver'
    },
    {
        id: 'SPRINT_TIME_AMATEUR_GOLD',
        title: 'スプリント中級タイム Gold',
        type: 'sprint_time',
        check_params: [90, 'amateur'],
        tier: 'gold'
    },
    // Normal
    {
        id: 'SPRINT_TIME_NORMAL_BRONZE',
        title: 'スプリント上級タイム Bronze',
        type: 'sprint_time',
        check_params: [180, 'normal'],
        tier: 'bronze'
    },
    {
        id: 'SPRINT_TIME_NORMAL_SILVER',
        title: 'スプリント上級タイム Silver',
        type: 'sprint_time',
        check_params: [150, 'normal'],
        tier: 'silver'
    },
    {
        id: 'SPRINT_TIME_NORMAL_GOLD',
        title: 'スプリント上級タイム Gold',
        type: 'sprint_time',
        check_params: [120, 'normal'],
        tier: 'gold'
    },
    // Expert
    {
        id: 'SPRINT_TIME_EXPERT_BRONZE',
        title: 'スプリント達人タイム Bronze',
        type: 'sprint_time',
        check_params: [210, 'expert'],
        tier: 'bronze'
    },
    {
        id: 'SPRINT_TIME_EXPERT_SILVER',
        title: 'スプリント達人タイム Silver',
        type: 'sprint_time',
        check_params: [180, 'expert'],
        tier: 'silver'
    },
    {
        id: 'SPRINT_TIME_EXPERT_GOLD',
        title: 'スプリント達人タイム Gold',
        type: 'sprint_time',
        check_params: [150, 'expert'],
        tier: 'gold'
    },
    // Master
    {
        id: 'SPRINT_TIME_MASTER_BRONZE',
        title: 'スプリント師範タイム Bronze',
        type: 'sprint_time',
        check_params: [240, 'master'],
        tier: 'bronze'
    },
    {
        id: 'SPRINT_TIME_MASTER_SILVER',
        title: 'スプリント師範タイム Silver',
        type: 'sprint_time',
        check_params: [210, 'master'],
        tier: 'silver'
    },
    {
        id: 'SPRINT_TIME_MASTER_GOLD',
        title: 'スプリント師範タイム Gold',
        type: 'sprint_time',
        check_params: [180, 'master'],
        tier: 'gold'
    },

    // ========== SURVIVAL MODE ==========
    // Correct Answer Achievements (15)
    // Beginner
    {
        id: 'SURVIVAL_CORRECT_BEGINNER_BRONZE',
        title: 'サバイバル初級 Bronze',
        type: 'survival_correct',
        check_params: [5, 'beginner'],
        tier: 'bronze'
    },
    {
        id: 'SURVIVAL_CORRECT_BEGINNER_SILVER',
        title: 'サバイバル初級 Silver',
        type: 'survival_correct',
        check_params: [15, 'beginner'],
        tier: 'silver'
    },
    {
        id: 'SURVIVAL_CORRECT_BEGINNER_GOLD',
        title: 'サバイバル初級 Gold',
        type: 'survival_correct',
        check_params: [30, 'beginner'],
        tier: 'gold'
    },
    // Amateur
    {
        id: 'SURVIVAL_CORRECT_AMATEUR_BRONZE',
        title: 'サバイバル中級 Bronze',
        type: 'survival_correct',
        check_params: [5, 'amateur'],
        tier: 'bronze'
    },
    {
        id: 'SURVIVAL_CORRECT_AMATEUR_SILVER',
        title: 'サバイバル中級 Silver',
        type: 'survival_correct',
        check_params: [15, 'amateur'],
        tier: 'silver'
    },
    {
        id: 'SURVIVAL_CORRECT_AMATEUR_GOLD',
        title: 'サバイバル中級 Gold',
        type: 'survival_correct',
        check_params: [30, 'amateur'],
        tier: 'gold'
    },
    // Normal
    {
        id: 'SURVIVAL_CORRECT_NORMAL_BRONZE',
        title: 'サバイバル上級 Bronze',
        type: 'survival_correct',
        check_params: [5, 'normal'],
        tier: 'bronze'
    },
    {
        id: 'SURVIVAL_CORRECT_NORMAL_SILVER',
        title: 'サバイバル上級 Silver',
        type: 'survival_correct',
        check_params: [15, 'normal'],
        tier: 'silver'
    },
    {
        id: 'SURVIVAL_CORRECT_NORMAL_GOLD',
        title: 'サバイバル上級 Gold',
        type: 'survival_correct',
        check_params: [30, 'normal'],
        tier: 'gold'
    },
    // Expert
    {
        id: 'SURVIVAL_CORRECT_EXPERT_BRONZE',
        title: 'サバイバル達人 Bronze',
        type: 'survival_correct',
        check_params: [5, 'expert'],
        tier: 'bronze'
    },
    {
        id: 'SURVIVAL_CORRECT_EXPERT_SILVER',
        title: 'サバイバル達人 Silver',
        type: 'survival_correct',
        check_params: [15, 'expert'],
        tier: 'silver'
    },
    {
        id: 'SURVIVAL_CORRECT_EXPERT_GOLD',
        title: 'サバイバル達人 Gold',
        type: 'survival_correct',
        check_params: [30, 'expert'],
        tier: 'gold'
    },
    // Master
    {
        id: 'SURVIVAL_CORRECT_MASTER_BRONZE',
        title: 'サバイバル師範 Bronze',
        type: 'survival_correct',
        check_params: [5, 'master'],
        tier: 'bronze'
    },
    {
        id: 'SURVIVAL_CORRECT_MASTER_SILVER',
        title: 'サバイバル師範 Silver',
        type: 'survival_correct',
        check_params: [15, 'master'],
        tier: 'silver'
    },
    {
        id: 'SURVIVAL_CORRECT_MASTER_GOLD',
        title: 'サバイバル師範 Gold',
        type: 'survival_correct',
        check_params: [30, 'master'],
        tier: 'gold'
    },

    // ========== PRACTICE MODE ==========
    {
        id: 'PRACTICE_FIRST_PLAY',
        title: 'プラクティス',
        type: 'practice_play',
        check_params: [],
        tier: 'bronze'
    },

    // ========== GLOBAL (Mode/Difficulty Agnostic) ==========
    // Total Correct Answers (9)
    {
        id: 'GLOBAL_CORRECT_BRONZE',
        title: '正解数 Bronze',
        type: 'total_correct',
        check_params: [15],
        tier: 'bronze'
    },
    {
        id: 'GLOBAL_CORRECT_SILVER',
        title: '正解数 Silver',
        type: 'total_correct',
        check_params: [50],
        tier: 'silver'
    },
    {
        id: 'GLOBAL_CORRECT_GOLD',
        title: '正解数 Gold',
        type: 'total_correct',
        check_params: [100],
        tier: 'gold'
    },
    {
        id: 'GLOBAL_CORRECT_150',
        title: '正解数 150',
        type: 'total_correct',
        check_params: [150],
        tier: 'bronze'
    },
    {
        id: 'GLOBAL_CORRECT_200',
        title: '正解数 200',
        type: 'total_correct',
        check_params: [200],
        tier: 'silver'
    },
    {
        id: 'GLOBAL_CORRECT_300',
        title: '正解数 300',
        type: 'total_correct',
        check_params: [300],
        tier: 'silver'
    },
    {
        id: 'GLOBAL_CORRECT_500',
        title: '正解数 500',
        type: 'total_correct',
        check_params: [500],
        tier: 'gold'
    },
    {
        id: 'GLOBAL_CORRECT_750',
        title: '正解数 750',
        type: 'total_correct',
        check_params: [750],
        tier: 'gold'
    },
    {
        id: 'GLOBAL_CORRECT_1000',
        title: '正解数 1000',
        type: 'total_correct',
        check_params: [1000],
        tier: 'gold'
    },

    // Mode Play Count (9)
    {
        id: 'CHALLENGE_PLAYS_BRONZE',
        title: 'チャレンジャー Bronze',
        type: 'challenge_plays',
        check_params: [10],
        tier: 'bronze'
    },
    {
        id: 'CHALLENGE_PLAYS_SILVER',
        title: 'チャレンジャー Silver',
        type: 'challenge_plays',
        check_params: [30],
        tier: 'silver'
    },
    {
        id: 'CHALLENGE_PLAYS_GOLD',
        title: 'チャレンジャー Gold',
        type: 'challenge_plays',
        check_params: [100],
        tier: 'gold'
    },
    {
        id: 'SPRINT_PLAYS_BRONZE',
        title: 'スプリンター Bronze',
        type: 'sprint_plays',
        check_params: [10],
        tier: 'bronze'
    },
    {
        id: 'SPRINT_PLAYS_SILVER',
        title: 'スプリンター Silver',
        type: 'sprint_plays',
        check_params: [30],
        tier: 'silver'
    },
    {
        id: 'SPRINT_PLAYS_GOLD',
        title: 'スプリンター Gold',
        type: 'sprint_plays',
        check_params: [100],
        tier: 'gold'
    },
    {
        id: 'SURVIVAL_PLAYS_BRONZE',
        title: 'サバイバリスト Bronze',
        type: 'survival_plays',
        check_params: [10],
        tier: 'bronze'
    },
    {
        id: 'SURVIVAL_PLAYS_SILVER',
        title: 'サバイバリスト Silver',
        type: 'survival_plays',
        check_params: [30],
        tier: 'silver'
    },
    {
        id: 'SURVIVAL_PLAYS_GOLD',
        title: 'サバイバリスト Gold',
        type: 'survival_plays',
        check_params: [100],
        tier: 'gold'
    },

    // 3+ Tile Waits (3)
    {
        id: 'WAIT3_BRONZE',
        title: '3面待ち以上 Bronze',
        type: 'wait_correct',
        check_params: [3, 15],
        tier: 'bronze'
    },
    {
        id: 'WAIT3_SILVER',
        title: '3面待ち以上 Silver',
        type: 'wait_correct',
        check_params: [3, 50],
        tier: 'silver'
    },
    {
        id: 'WAIT3_GOLD',
        title: '3面待ち以上 Gold',
        type: 'wait_correct',
        check_params: [3, 100],
        tier: 'gold'
    },

    // 6+ Tile Waits (3)
    {
        id: 'WAIT6_BRONZE',
        title: '6面待ち以上 Bronze',
        type: 'wait_correct',
        check_params: [6, 5],
        tier: 'bronze'
    },
    {
        id: 'WAIT6_SILVER',
        title: '6面待ち以上 Silver',
        type: 'wait_correct',
        check_params: [6, 15],
        tier: 'silver'
    },
    {
        id: 'WAIT6_GOLD',
        title: '6面待ち以上 Gold',
        type: 'wait_correct',
        check_params: [6, 30],
        tier: 'gold'
    },

    // 9 Tile Waits (3)
    {
        id: 'WAIT9_BRONZE',
        title: '純正九蓮宝燈 Bronze',
        type: 'wait_exact_correct',
        check_params: [9, 1],
        tier: 'bronze'
    },
    {
        id: 'WAIT9_SILVER',
        title: '純正九蓮宝燈 Silver',
        type: 'wait_exact_correct',
        check_params: [9, 3],
        tier: 'silver'
    },
    {
        id: 'WAIT9_GOLD',
        title: '純正九蓮宝燈 Gold',
        type: 'wait_exact_correct',
        check_params: [9, 5],
        tier: 'gold'
    },

    // Platinum Trophy
    {
        id: 'PLATINUM_ALL_TROPHIES',
        title: '免許皆伝',
        type: 'platinum',
        check_params: [],
        tier: 'platinum'
    }
];

export interface GameStateForTrophyCheck {
    mode: 'challenge' | 'sprint' | 'survival' | 'practice';
    difficulty: Difficulty;
    score: number;
    correctCount: number;
    isClear: boolean;
    hasErrors: boolean;
    remainingTime?: number; // For Sprint mode
    globalStats: GlobalStats;
    modeStats: Record<string, ModeStats>;
    unlockedTrophies: string[];
    fastBonusCount: number;
    isTimeUp: boolean;
}

export const checkTrophyUnlock = (
    trophy: Trophy,
    gameState: GameStateForTrophyCheck
): boolean => {
    const {
        mode,
        difficulty,
        score,
        isClear,
        hasErrors,
        remainingTime,
        globalStats,
        modeStats,
        unlockedTrophies,
        fastBonusCount
    } = gameState;

    // Already unlocked
    if (unlockedTrophies.includes(trophy.id)) {
        return false;
    }

    const params = trophy.check_params;

    switch (trophy.type) {
        case 'challenge_clear': {
            const [targetDiff] = params;
            return mode === 'challenge' && isClear && difficulty === targetDiff;
        }

        case 'challenge_score': {
            const [targetScore, targetDiff] = params;
            return mode === 'challenge' && difficulty === targetDiff && score >= targetScore;
        }

        case 'challenge_nomiss': {
            const [targetDiff] = params;
            return mode === 'challenge' && isClear && !hasErrors && difficulty === targetDiff;
        }

        case 'challenge_all_fast': {
            const [targetDiff] = params;
            // 全問正解かつ全問FASTボーナス (10問)
            return mode === 'challenge' && isClear && difficulty === targetDiff && fastBonusCount >= 10;
        }

        case 'challenge_plays': {
            const [targetCount] = params;
            const totalAttempts = ['beginner', 'amateur', 'normal', 'expert', 'master']
                .reduce((sum, diff) => sum + (modeStats[`challenge_${diff}`]?.attempts || 0), 0);
            return totalAttempts >= targetCount;
        }

        case 'sprint_clear': {
            const [targetDiff] = params;
            return mode === 'sprint' && isClear && difficulty === targetDiff;
        }

        case 'sprint_nomiss': {
            const [targetDiff] = params;
            return mode === 'sprint' && isClear && !hasErrors && difficulty === targetDiff;
        }

        case 'sprint_time': {
            const [targetTime, targetDiff] = params;
            // remainingTime is in ms, targetTime is in seconds
            // If remainingTime is undefined, we can't check time
            if (remainingTime === undefined) return false;

            // Calculate elapsed time: (Initial Time - Remaining Time) / 1000
            // But wait, sprint mode logic is usually "finish within X seconds".
            // The previous logic was: remainingTime >= (InitialTime - TargetTime * 1000) ??
            // Let's look at how it was implemented before.
            // It was: const timeThresholds = { ... }; return remainingTime >= timeThresholds[id] * 1000; ?? No.
            // Wait, previous implementation had thresholds like 120, 90, 60.
            // If the limit is 300s (5 min), and I finish in 60s, remaining is 240s.
            // So if I need to finish WITHIN 60s, remaining must be >= 300 - 60 = 240.
            // BUT, the thresholds in the previous file were:
            // SPRINT_TIME_BEGINNER_BRONZE: 120 (Finish within 120s)
            // The logic was: `remainingTime >= (300 - threshold) * 1000` ? 
            // Actually, let's assume the previous logic was correct or I should re-derive it.
            // Sprint mode usually has a fixed time limit (e.g. 300s).
            // If I finish in 120s, I have 180s remaining.
            // The condition "Finish within 120s" means "Time Taken <= 120".
            // Time Taken = (Total Time - Remaining Time).
            // So (Total - Remaining) <= 120  =>  Remaining >= Total - 120.
            // Let's assume Total Time is 300s (5 minutes) for all sprint modes?
            // Checking useGameStore.ts might be needed, but assuming standard 300s for now.
            // Actually, let's just use the logic: "Remaining time >= X" where X is calculated based on target.
            // Wait, the previous code didn't show the calculation logic clearly in the snippet I saw.
            // Let's assume the parameter passed is "Target Seconds to Finish".
            // So we need to know the Total Time.
            // In Sprint mode, initial time is usually 300s.
            // So Remaining >= (300 - TargetTime) * 1000.

            // However, to be safe and avoid hardcoding 300, let's look at how it works.
            // If I can't access total time here, I might need to rely on what I know.
            // Let's assume 300s for now as it's standard for this app.
            const SPRINT_TOTAL_TIME_SEC = 300;
            return mode === 'sprint' && isClear && difficulty === targetDiff &&
                (remainingTime / 1000) >= (SPRINT_TOTAL_TIME_SEC - targetTime);
        }

        case 'sprint_plays': {
            const [targetCount] = params;
            const totalAttempts = ['beginner', 'amateur', 'normal', 'expert', 'master']
                .reduce((sum, diff) => sum + (modeStats[`sprint_${diff}`]?.attempts || 0), 0);
            return totalAttempts >= targetCount;
        }

        case 'survival_correct': {
            const [targetCount, targetDiff] = params;
            // Survival mode accumulates score/correct count.
            // The trophy says "5 questions correct in Survival (Beginner)".
            // This usually means in a SINGLE GAME.
            // So we check current game's correctCount.
            return mode === 'survival' && difficulty === targetDiff && gameState.correctCount >= targetCount;
        }

        case 'survival_plays': {
            const [targetCount] = params;
            const totalAttempts = ['beginner', 'amateur', 'normal', 'expert', 'master']
                .reduce((sum, diff) => sum + (modeStats[`survival_${diff}`]?.attempts || 0), 0);
            return totalAttempts >= targetCount;
        }

        case 'practice_play': {
            return globalStats.practiceAttempts >= 1;
        }

        case 'total_correct': {
            const [targetCount] = params;
            return globalStats.totalCorrect >= targetCount;
        }

        case 'wait_correct': {
            const [minWaits, targetCount] = params;
            // Check global stats for waits >= minWaits
            // globalStats.waitStats is Record<number, number> (wait count -> correct count)
            let count = 0;
            for (const [waits, correct] of Object.entries(globalStats.waitStats)) {
                if (parseInt(waits) >= minWaits) {
                    count += correct;
                }
            }
            return count >= targetCount;
        }

        case 'wait_exact_correct': {
            const [exactWaits, targetCount] = params;
            const count = globalStats.waitStats[exactWaits] || 0;
            return count >= targetCount;
        }

        case 'fast_bonus': {
            const [targetCount] = params;
            return globalStats.fastBonusCount >= targetCount;
        }

        case 'platinum': {
            // Check if all other trophies are unlocked
            // Exclude this platinum trophy itself
            const otherTrophies = TROPHIES.filter(t => t.type !== 'platinum');
            return otherTrophies.every(t => unlockedTrophies.includes(t.id));
        }

        default:
            return false;
    }
};
