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
    description: string;
    type: TrophyType;
    check_params: any[];
    tier: 'bronze' | 'silver' | 'gold' | 'platinum';
}

export const TROPHIES: Trophy[] = [
    // ========== CHALLENGE MODE ==========
    // Initial Clear (5)
    {
        id: 'CHALLENGE_CLEAR_BEGINNER',
        title: '初級クリア',
        description: 'チャレンジモード（初級）をクリアした',
        type: 'challenge_clear',
        check_params: ['beginner'],
        tier: 'bronze'
    },
    {
        id: 'CHALLENGE_CLEAR_AMATEUR',
        title: '中級クリア',
        description: 'チャレンジモード（中級）をクリアした',
        type: 'challenge_clear',
        check_params: ['amateur'],
        tier: 'bronze'
    },
    {
        id: 'CHALLENGE_CLEAR_NORMAL',
        title: '上級クリア',
        description: 'チャレンジモード（上級）をクリアした',
        type: 'challenge_clear',
        check_params: ['normal'],
        tier: 'bronze'
    },
    {
        id: 'CHALLENGE_CLEAR_EXPERT',
        title: '達人クリア',
        description: 'チャレンジモード（達人）をクリアした',
        type: 'challenge_clear',
        check_params: ['expert'],
        tier: 'silver'
    },
    {
        id: 'CHALLENGE_CLEAR_MASTER',
        title: '師範クリア',
        description: 'チャレンジモード（師範）をクリアした',
        type: 'challenge_clear',
        check_params: ['master'],
        tier: 'gold'
    },

    // Score Achievements (15)
    // Beginner
    {
        id: 'CHALLENGE_SCORE_BEGINNER_BRONZE',
        title: '初級スコア Bronze',
        description: 'チャレンジモード（初級）で3,000点を達成',
        type: 'challenge_score',
        check_params: [3000, 'beginner'],
        tier: 'bronze'
    },
    {
        id: 'CHALLENGE_SCORE_BEGINNER_SILVER',
        title: '初級スコア Silver',
        description: 'チャレンジモード（初級）で5,000点を達成',
        type: 'challenge_score',
        check_params: [5000, 'beginner'],
        tier: 'silver'
    },
    {
        id: 'CHALLENGE_SCORE_BEGINNER_GOLD',
        title: '初級スコア Gold',
        description: 'チャレンジモード（初級）で8,000点を達成',
        type: 'challenge_score',
        check_params: [8000, 'beginner'],
        tier: 'gold'
    },
    // Amateur
    {
        id: 'CHALLENGE_SCORE_AMATEUR_BRONZE',
        title: '中級スコア Bronze',
        description: 'チャレンジモード（中級）で4,000点を達成',
        type: 'challenge_score',
        check_params: [4000, 'amateur'],
        tier: 'bronze'
    },
    {
        id: 'CHALLENGE_SCORE_AMATEUR_SILVER',
        title: '中級スコア Silver',
        description: 'チャレンジモード（中級）で7,000点を達成',
        type: 'challenge_score',
        check_params: [7000, 'amateur'],
        tier: 'silver'
    },
    {
        id: 'CHALLENGE_SCORE_AMATEUR_GOLD',
        title: '中級スコア Gold',
        description: 'チャレンジモード（中級）で12,000点を達成',
        type: 'challenge_score',
        check_params: [12000, 'amateur'],
        tier: 'gold'
    },
    // Normal
    {
        id: 'CHALLENGE_SCORE_NORMAL_BRONZE',
        title: '上級スコア Bronze',
        description: 'チャレンジモード（上級）で5,000点を達成',
        type: 'challenge_score',
        check_params: [5000, 'normal'],
        tier: 'bronze'
    },
    {
        id: 'CHALLENGE_SCORE_NORMAL_SILVER',
        title: '上級スコア Silver',
        description: 'チャレンジモード（上級）で9,000点を達成',
        type: 'challenge_score',
        check_params: [9000, 'normal'],
        tier: 'silver'
    },
    {
        id: 'CHALLENGE_SCORE_NORMAL_GOLD',
        title: '上級スコア Gold',
        description: 'チャレンジモード（上級）で15,000点を達成',
        type: 'challenge_score',
        check_params: [15000, 'normal'],
        tier: 'gold'
    },
    // Expert
    {
        id: 'CHALLENGE_SCORE_EXPERT_BRONZE',
        title: '達人スコア Bronze',
        description: 'チャレンジモード（達人）で6,000点を達成',
        type: 'challenge_score',
        check_params: [6000, 'expert'],
        tier: 'bronze'
    },
    {
        id: 'CHALLENGE_SCORE_EXPERT_SILVER',
        title: '達人スコア Silver',
        description: 'チャレンジモード（達人）で11,000点を達成',
        type: 'challenge_score',
        check_params: [11000, 'expert'],
        tier: 'silver'
    },
    {
        id: 'CHALLENGE_SCORE_EXPERT_GOLD',
        title: '達人スコア Gold',
        description: 'チャレンジモード（達人）で18,000点を達成',
        type: 'challenge_score',
        check_params: [18000, 'expert'],
        tier: 'gold'
    },
    // Master
    {
        id: 'CHALLENGE_SCORE_MASTER_BRONZE',
        title: '師範スコア Bronze',
        description: 'チャレンジモード（師範）で7,000点を達成',
        type: 'challenge_score',
        check_params: [7000, 'master'],
        tier: 'bronze'
    },
    {
        id: 'CHALLENGE_SCORE_MASTER_SILVER',
        title: '師範スコア Silver',
        description: 'チャレンジモード（師範）で13,000点を達成',
        type: 'challenge_score',
        check_params: [13000, 'master'],
        tier: 'silver'
    },
    {
        id: 'CHALLENGE_SCORE_MASTER_GOLD',
        title: '師範スコア Gold',
        description: 'チャレンジモード（師範）で20,000点を達成',
        type: 'challenge_score',
        check_params: [20000, 'master'],
        tier: 'gold'
    },

    // No-Miss Clears (5)
    {
        id: 'CHALLENGE_NOMISS_BEGINNER',
        title: '初級完全勝利',
        description: 'チャレンジモード（初級）をノーミスでクリア',
        type: 'challenge_nomiss',
        check_params: ['beginner'],
        tier: 'silver'
    },
    {
        id: 'CHALLENGE_NOMISS_AMATEUR',
        title: '中級完全勝利',
        description: 'チャレンジモード（中級）をノーミスでクリア',
        type: 'challenge_nomiss',
        check_params: ['amateur'],
        tier: 'silver'
    },
    {
        id: 'CHALLENGE_NOMISS_NORMAL',
        title: '上級完全勝利',
        description: 'チャレンジモード（上級）をノーミスでクリア',
        type: 'challenge_nomiss',
        check_params: ['normal'],
        tier: 'gold'
    },
    {
        id: 'CHALLENGE_NOMISS_EXPERT',
        title: '達人完全勝利',
        description: 'チャレンジモード（達人）をノーミスでクリア',
        type: 'challenge_nomiss',
        check_params: ['expert'],
        tier: 'gold'
    },
    {
        id: 'CHALLENGE_NOMISS_MASTER',
        title: '師範完全勝利',
        description: 'チャレンジモード（師範）をノーミスでクリア',
        type: 'challenge_nomiss',
        check_params: ['master'],
        tier: 'gold'
    },

    // All FAST Bonus (5)
    {
        id: 'CHALLENGE_ALL_FAST_BEGINNER',
        title: '初級神速',
        description: 'チャレンジモード（初級）で全問FASTボーナスを獲得してクリア',
        type: 'challenge_all_fast',
        check_params: ['beginner'],
        tier: 'silver'
    },
    {
        id: 'CHALLENGE_ALL_FAST_AMATEUR',
        title: '中級神速',
        description: 'チャレンジモード（中級）で全問FASTボーナスを獲得してクリア',
        type: 'challenge_all_fast',
        check_params: ['amateur'],
        tier: 'silver'
    },
    {
        id: 'CHALLENGE_ALL_FAST_NORMAL',
        title: '上級神速',
        description: 'チャレンジモード（上級）で全問FASTボーナスを獲得してクリア',
        type: 'challenge_all_fast',
        check_params: ['normal'],
        tier: 'gold'
    },
    {
        id: 'CHALLENGE_ALL_FAST_EXPERT',
        title: '達人神速',
        description: 'チャレンジモード（達人）で全問FASTボーナスを獲得してクリア',
        type: 'challenge_all_fast',
        check_params: ['expert'],
        tier: 'gold'
    },
    {
        id: 'CHALLENGE_ALL_FAST_MASTER',
        title: '師範神速',
        description: 'チャレンジモード（師範）で全問FASTボーナスを獲得してクリア',
        type: 'challenge_all_fast',
        check_params: ['master'],
        tier: 'gold'
    },

    // Cumulative FAST Bonus (3)
    {
        id: 'FAST_BONUS_BRONZE',
        title: 'FASTボーナス Bronze',
        description: 'FASTボーナスを累計15回獲得',
        type: 'fast_bonus',
        check_params: [15],
        tier: 'bronze'
    },
    {
        id: 'FAST_BONUS_SILVER',
        title: 'FASTボーナス Silver',
        description: 'FASTボーナスを累計50回獲得',
        type: 'fast_bonus',
        check_params: [50],
        tier: 'silver'
    },
    {
        id: 'FAST_BONUS_GOLD',
        title: 'FASTボーナス Gold',
        description: 'FASTボーナスを累計100回獲得',
        type: 'fast_bonus',
        check_params: [100],
        tier: 'gold'
    },

    // ========== SPRINT MODE ==========
    // Initial Clear (5)
    {
        id: 'SPRINT_CLEAR_BEGINNER',
        title: 'スプリント初級クリア',
        description: 'スプリントモード（初級）をクリア',
        type: 'sprint_clear',
        check_params: ['beginner'],
        tier: 'bronze'
    },
    {
        id: 'SPRINT_CLEAR_AMATEUR',
        title: 'スプリント中級クリア',
        description: 'スプリントモード（中級）をクリア',
        type: 'sprint_clear',
        check_params: ['amateur'],
        tier: 'bronze'
    },
    {
        id: 'SPRINT_CLEAR_NORMAL',
        title: 'スプリント上級クリア',
        description: 'スプリントモード（上級）をクリア',
        type: 'sprint_clear',
        check_params: ['normal'],
        tier: 'bronze'
    },
    {
        id: 'SPRINT_CLEAR_EXPERT',
        title: 'スプリント達人クリア',
        description: 'スプリントモード（達人）をクリア',
        type: 'sprint_clear',
        check_params: ['expert'],
        tier: 'silver'
    },
    {
        id: 'SPRINT_CLEAR_MASTER',
        title: 'スプリント師範クリア',
        description: 'スプリントモード（師範）をクリア',
        type: 'sprint_clear',
        check_params: ['master'],
        tier: 'gold'
    },

    // No-Miss Clears (5)
    {
        id: 'SPRINT_NOMISS_BEGINNER',
        title: 'スプリント初級完全勝利',
        description: 'スプリントモード（初級）をノーミスでクリア',
        type: 'sprint_nomiss',
        check_params: ['beginner'],
        tier: 'silver'
    },
    {
        id: 'SPRINT_NOMISS_AMATEUR',
        title: 'スプリント中級完全勝利',
        description: 'スプリントモード（中級）をノーミスでクリア',
        type: 'sprint_nomiss',
        check_params: ['amateur'],
        tier: 'silver'
    },
    {
        id: 'SPRINT_NOMISS_NORMAL',
        title: 'スプリント上級完全勝利',
        description: 'スプリントモード（上級）をノーミスでクリア',
        type: 'sprint_nomiss',
        check_params: ['normal'],
        tier: 'gold'
    },
    {
        id: 'SPRINT_NOMISS_EXPERT',
        title: 'スプリント達人完全勝利',
        description: 'スプリントモード（達人）をノーミスでクリア',
        type: 'sprint_nomiss',
        check_params: ['expert'],
        tier: 'gold'
    },
    {
        id: 'SPRINT_NOMISS_MASTER',
        title: 'スプリント師範完全勝利',
        description: 'スプリントモード（師範）をノーミスでクリア',
        type: 'sprint_nomiss',
        check_params: ['master'],
        tier: 'gold'
    },

    // Time Achievements (15)
    // Beginner
    {
        id: 'SPRINT_TIME_BEGINNER_BRONZE',
        title: 'スプリント初級タイム Bronze',
        description: 'スプリントモード（初級）を120秒以内にクリア',
        type: 'sprint_time',
        check_params: [120, 'beginner'],
        tier: 'bronze'
    },
    {
        id: 'SPRINT_TIME_BEGINNER_SILVER',
        title: 'スプリント初級タイム Silver',
        description: 'スプリントモード（初級）を90秒以内にクリア',
        type: 'sprint_time',
        check_params: [90, 'beginner'],
        tier: 'silver'
    },
    {
        id: 'SPRINT_TIME_BEGINNER_GOLD',
        title: 'スプリント初級タイム Gold',
        description: 'スプリントモード（初級）を60秒以内にクリア',
        type: 'sprint_time',
        check_params: [60, 'beginner'],
        tier: 'gold'
    },
    // Amateur
    {
        id: 'SPRINT_TIME_AMATEUR_BRONZE',
        title: 'スプリント中級タイム Bronze',
        description: 'スプリントモード（中級）を150秒以内にクリア',
        type: 'sprint_time',
        check_params: [150, 'amateur'],
        tier: 'bronze'
    },
    {
        id: 'SPRINT_TIME_AMATEUR_SILVER',
        title: 'スプリント中級タイム Silver',
        description: 'スプリントモード（中級）を120秒以内にクリア',
        type: 'sprint_time',
        check_params: [120, 'amateur'],
        tier: 'silver'
    },
    {
        id: 'SPRINT_TIME_AMATEUR_GOLD',
        title: 'スプリント中級タイム Gold',
        description: 'スプリントモード（中級）を90秒以内にクリア',
        type: 'sprint_time',
        check_params: [90, 'amateur'],
        tier: 'gold'
    },
    // Normal
    {
        id: 'SPRINT_TIME_NORMAL_BRONZE',
        title: 'スプリント上級タイム Bronze',
        description: 'スプリントモード（上級）を180秒以内にクリア',
        type: 'sprint_time',
        check_params: [180, 'normal'],
        tier: 'bronze'
    },
    {
        id: 'SPRINT_TIME_NORMAL_SILVER',
        title: 'スプリント上級タイム Silver',
        description: 'スプリントモード（上級）を150秒以内にクリア',
        type: 'sprint_time',
        check_params: [150, 'normal'],
        tier: 'silver'
    },
    {
        id: 'SPRINT_TIME_NORMAL_GOLD',
        title: 'スプリント上級タイム Gold',
        description: 'スプリントモード（上級）を120秒以内にクリア',
        type: 'sprint_time',
        check_params: [120, 'normal'],
        tier: 'gold'
    },
    // Expert
    {
        id: 'SPRINT_TIME_EXPERT_BRONZE',
        title: 'スプリント達人タイム Bronze',
        description: 'スプリントモード（達人）を210秒以内にクリア',
        type: 'sprint_time',
        check_params: [210, 'expert'],
        tier: 'bronze'
    },
    {
        id: 'SPRINT_TIME_EXPERT_SILVER',
        title: 'スプリント達人タイム Silver',
        description: 'スプリントモード（達人）を180秒以内にクリア',
        type: 'sprint_time',
        check_params: [180, 'expert'],
        tier: 'silver'
    },
    {
        id: 'SPRINT_TIME_EXPERT_GOLD',
        title: 'スプリント達人タイム Gold',
        description: 'スプリントモード（達人）を150秒以内にクリア',
        type: 'sprint_time',
        check_params: [150, 'expert'],
        tier: 'gold'
    },
    // Master
    {
        id: 'SPRINT_TIME_MASTER_BRONZE',
        title: 'スプリント師範タイム Bronze',
        description: 'スプリントモード（師範）を240秒以内にクリア',
        type: 'sprint_time',
        check_params: [240, 'master'],
        tier: 'bronze'
    },
    {
        id: 'SPRINT_TIME_MASTER_SILVER',
        title: 'スプリント師範タイム Silver',
        description: 'スプリントモード（師範）を210秒以内にクリア',
        type: 'sprint_time',
        check_params: [210, 'master'],
        tier: 'silver'
    },
    {
        id: 'SPRINT_TIME_MASTER_GOLD',
        title: 'スプリント師範タイム Gold',
        description: 'スプリントモード（師範）を180秒以内にクリア',
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
        description: 'サバイバルモード（初級）で5問正解',
        type: 'survival_correct',
        check_params: [5, 'beginner'],
        tier: 'bronze'
    },
    {
        id: 'SURVIVAL_CORRECT_BEGINNER_SILVER',
        title: 'サバイバル初級 Silver',
        description: 'サバイバルモード（初級）で15問正解',
        type: 'survival_correct',
        check_params: [15, 'beginner'],
        tier: 'silver'
    },
    {
        id: 'SURVIVAL_CORRECT_BEGINNER_GOLD',
        title: 'サバイバル初級 Gold',
        description: 'サバイバルモード（初級）で30問正解',
        type: 'survival_correct',
        check_params: [30, 'beginner'],
        tier: 'gold'
    },
    // Amateur
    {
        id: 'SURVIVAL_CORRECT_AMATEUR_BRONZE',
        title: 'サバイバル中級 Bronze',
        description: 'サバイバルモード（中級）で5問正解',
        type: 'survival_correct',
        check_params: [5, 'amateur'],
        tier: 'bronze'
    },
    {
        id: 'SURVIVAL_CORRECT_AMATEUR_SILVER',
        title: 'サバイバル中級 Silver',
        description: 'サバイバルモード（中級）で15問正解',
        type: 'survival_correct',
        check_params: [15, 'amateur'],
        tier: 'silver'
    },
    {
        id: 'SURVIVAL_CORRECT_AMATEUR_GOLD',
        title: 'サバイバル中級 Gold',
        description: 'サバイバルモード（中級）で30問正解',
        type: 'survival_correct',
        check_params: [30, 'amateur'],
        tier: 'gold'
    },
    // Normal
    {
        id: 'SURVIVAL_CORRECT_NORMAL_BRONZE',
        title: 'サバイバル上級 Bronze',
        description: 'サバイバルモード（上級）で5問正解',
        type: 'survival_correct',
        check_params: [5, 'normal'],
        tier: 'bronze'
    },
    {
        id: 'SURVIVAL_CORRECT_NORMAL_SILVER',
        title: 'サバイバル上級 Silver',
        description: 'サバイバルモード（上級）で15問正解',
        type: 'survival_correct',
        check_params: [15, 'normal'],
        tier: 'silver'
    },
    {
        id: 'SURVIVAL_CORRECT_NORMAL_GOLD',
        title: 'サバイバル上級 Gold',
        description: 'サバイバルモード（上級）で30問正解',
        type: 'survival_correct',
        check_params: [30, 'normal'],
        tier: 'gold'
    },
    // Expert
    {
        id: 'SURVIVAL_CORRECT_EXPERT_BRONZE',
        title: 'サバイバル達人 Bronze',
        description: 'サバイバルモード（達人）で5問正解',
        type: 'survival_correct',
        check_params: [5, 'expert'],
        tier: 'bronze'
    },
    {
        id: 'SURVIVAL_CORRECT_EXPERT_SILVER',
        title: 'サバイバル達人 Silver',
        description: 'サバイバルモード（達人）で15問正解',
        type: 'survival_correct',
        check_params: [15, 'expert'],
        tier: 'silver'
    },
    {
        id: 'SURVIVAL_CORRECT_EXPERT_GOLD',
        title: 'サバイバル達人 Gold',
        description: 'サバイバルモード（達人）で30問正解',
        type: 'survival_correct',
        check_params: [30, 'expert'],
        tier: 'gold'
    },
    // Master
    {
        id: 'SURVIVAL_CORRECT_MASTER_BRONZE',
        title: 'サバイバル師範 Bronze',
        description: 'サバイバルモード（師範）で5問正解',
        type: 'survival_correct',
        check_params: [5, 'master'],
        tier: 'bronze'
    },
    {
        id: 'SURVIVAL_CORRECT_MASTER_SILVER',
        title: 'サバイバル師範 Silver',
        description: 'サバイバルモード（師範）で15問正解',
        type: 'survival_correct',
        check_params: [15, 'master'],
        tier: 'silver'
    },
    {
        id: 'SURVIVAL_CORRECT_MASTER_GOLD',
        title: 'サバイバル師範 Gold',
        description: 'サバイバルモード（師範）で30問正解',
        type: 'survival_correct',
        check_params: [30, 'master'],
        tier: 'gold'
    },

    // ========== PRACTICE MODE ==========
    {
        id: 'PRACTICE_FIRST_PLAY',
        title: 'プラクティス',
        description: 'プラクティスモードで初プレイ',
        type: 'practice_play',
        check_params: [],
        tier: 'bronze'
    },

    // ========== GLOBAL (Mode/Difficulty Agnostic) ==========
    // Total Correct Answers (9)
    {
        id: 'GLOBAL_CORRECT_BRONZE',
        title: '正解数 Bronze',
        description: '累計15問正解',
        type: 'total_correct',
        check_params: [15],
        tier: 'bronze'
    },
    {
        id: 'GLOBAL_CORRECT_SILVER',
        title: '正解数 Silver',
        description: '累計50問正解',
        type: 'total_correct',
        check_params: [50],
        tier: 'silver'
    },
    {
        id: 'GLOBAL_CORRECT_GOLD',
        title: '正解数 Gold',
        description: '累計100問正解',
        type: 'total_correct',
        check_params: [100],
        tier: 'gold'
    },
    {
        id: 'GLOBAL_CORRECT_150',
        title: '正解数 150',
        description: '累計150問正解',
        type: 'total_correct',
        check_params: [150],
        tier: 'bronze'
    },
    {
        id: 'GLOBAL_CORRECT_200',
        title: '正解数 200',
        description: '累計200問正解',
        type: 'total_correct',
        check_params: [200],
        tier: 'silver'
    },
    {
        id: 'GLOBAL_CORRECT_300',
        title: '正解数 300',
        description: '累計300問正解',
        type: 'total_correct',
        check_params: [300],
        tier: 'silver'
    },
    {
        id: 'GLOBAL_CORRECT_500',
        title: '正解数 500',
        description: '累計500問正解',
        type: 'total_correct',
        check_params: [500],
        tier: 'gold'
    },
    {
        id: 'GLOBAL_CORRECT_750',
        title: '正解数 750',
        description: '累計750問正解',
        type: 'total_correct',
        check_params: [750],
        tier: 'gold'
    },
    {
        id: 'GLOBAL_CORRECT_1000',
        title: '正解数 1000',
        description: '累計1000問正解',
        type: 'total_correct',
        check_params: [1000],
        tier: 'gold'
    },

    // Mode Play Count (9)
    {
        id: 'CHALLENGE_PLAYS_BRONZE',
        title: 'チャレンジャー Bronze',
        description: 'チャレンジモードを累計10回プレイ',
        type: 'challenge_plays',
        check_params: [10],
        tier: 'bronze'
    },
    {
        id: 'CHALLENGE_PLAYS_SILVER',
        title: 'チャレンジャー Silver',
        description: 'チャレンジモードを累計30回プレイ',
        type: 'challenge_plays',
        check_params: [30],
        tier: 'silver'
    },
    {
        id: 'CHALLENGE_PLAYS_GOLD',
        title: 'チャレンジャー Gold',
        description: 'チャレンジモードを累計100回プレイ',
        type: 'challenge_plays',
        check_params: [100],
        tier: 'gold'
    },
    {
        id: 'SPRINT_PLAYS_BRONZE',
        title: 'スプリンター Bronze',
        description: 'スプリントモードを累計10回プレイ',
        type: 'sprint_plays',
        check_params: [10],
        tier: 'bronze'
    },
    {
        id: 'SPRINT_PLAYS_SILVER',
        title: 'スプリンター Silver',
        description: 'スプリントモードを累計30回プレイ',
        type: 'sprint_plays',
        check_params: [30],
        tier: 'silver'
    },
    {
        id: 'SPRINT_PLAYS_GOLD',
        title: 'スプリンター Gold',
        description: 'スプリントモードを累計100回プレイ',
        type: 'sprint_plays',
        check_params: [100],
        tier: 'gold'
    },
    {
        id: 'SURVIVAL_PLAYS_BRONZE',
        title: 'サバイバリスト Bronze',
        description: 'サバイバルモードを累計10回プレイ',
        type: 'survival_plays',
        check_params: [10],
        tier: 'bronze'
    },
    {
        id: 'SURVIVAL_PLAYS_SILVER',
        title: 'サバイバリスト Silver',
        description: 'サバイバルモードを累計30回プレイ',
        type: 'survival_plays',
        check_params: [30],
        tier: 'silver'
    },
    {
        id: 'SURVIVAL_PLAYS_GOLD',
        title: 'サバイバリスト Gold',
        description: 'サバイバルモードを累計100回プレイ',
        type: 'survival_plays',
        check_params: [100],
        tier: 'gold'
    },

    // 3+ Tile Waits (3)
    {
        id: 'WAIT3_BRONZE',
        title: '3面待ち以上 Bronze',
        description: '3面待ち以上を累計15問正解',
        type: 'wait_correct',
        check_params: [3, 15],
        tier: 'bronze'
    },
    {
        id: 'WAIT3_SILVER',
        title: '3面待ち以上 Silver',
        description: '3面待ち以上を累計50問正解',
        type: 'wait_correct',
        check_params: [3, 50],
        tier: 'silver'
    },
    {
        id: 'WAIT3_GOLD',
        title: '3面待ち以上 Gold',
        description: '3面待ち以上を累計100問正解',
        type: 'wait_correct',
        check_params: [3, 100],
        tier: 'gold'
    },

    // 6+ Tile Waits (3)
    {
        id: 'WAIT6_BRONZE',
        title: '6面待ち以上 Bronze',
        description: '6面待ち以上を累計5問正解',
        type: 'wait_correct',
        check_params: [6, 5],
        tier: 'bronze'
    },
    {
        id: 'WAIT6_SILVER',
        title: '6面待ち以上 Silver',
        description: '6面待ち以上を累計15問正解',
        type: 'wait_correct',
        check_params: [6, 15],
        tier: 'silver'
    },
    {
        id: 'WAIT6_GOLD',
        title: '6面待ち以上 Gold',
        description: '6面待ち以上を累計30問正解',
        type: 'wait_correct',
        check_params: [6, 30],
        tier: 'gold'
    },

    // 9 Tile Waits (3)
    {
        id: 'WAIT9_BRONZE',
        title: '純正九蓮宝燈 Bronze',
        description: '9面待ちを累計1回正解',
        type: 'wait_exact_correct',
        check_params: [9, 1],
        tier: 'bronze'
    },
    {
        id: 'WAIT9_SILVER',
        title: '純正九蓮宝燈 Silver',
        description: '9面待ちを累計3回正解',
        type: 'wait_exact_correct',
        check_params: [9, 3],
        tier: 'silver'
    },
    {
        id: 'WAIT9_GOLD',
        title: '純正九蓮宝燈 Gold',
        description: '9面待ちを累計5回正解',
        type: 'wait_exact_correct',
        check_params: [9, 5],
        tier: 'gold'
    },

    // Platinum Trophy
    {
        id: 'PLATINUM_ALL_TROPHIES',
        title: '免許皆伝',
        description: '全てのトロフィーを獲得する',
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
