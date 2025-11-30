import type { Difficulty, GlobalStats, ModeStats } from '../store/useGameStore';

export interface Trophy {
    id: string;
    title: string;
    description: string;
    icon: string;
    hidden: boolean;
    category: 'challenge' | 'sprint' | 'survival' | 'practice' | 'global' | 'platinum';
    tier?: 'bronze' | 'silver' | 'gold' | 'platinum';
}

export const TROPHIES: Trophy[] = [
    // ========== CHALLENGE MODE ==========
    // Initial Clear (5)
    {
        id: 'CHALLENGE_CLEAR_BEGINNER',
        title: '初級クリア',
        description: 'チャレンジモード（初級）をクリアした',
        icon: '🏆',
        hidden: false,
        category: 'challenge'
    },
    {
        id: 'CHALLENGE_CLEAR_AMATEUR',
        title: '中級クリア',
        description: 'チャレンジモード（中級）をクリアした',
        icon: '🏆',
        hidden: false,
        category: 'challenge'
    },
    {
        id: 'CHALLENGE_CLEAR_NORMAL',
        title: '上級クリア',
        description: 'チャレンジモード（上級）をクリアした',
        icon: '🏆',
        hidden: false,
        category: 'challenge'
    },
    {
        id: 'CHALLENGE_CLEAR_EXPERT',
        title: '達人クリア',
        description: 'チャレンジモード（達人）をクリアした',
        icon: '🏆',
        hidden: false,
        category: 'challenge'
    },
    {
        id: 'CHALLENGE_CLEAR_MASTER',
        title: '師範クリア',
        description: 'チャレンジモード（師範）をクリアした',
        icon: '🏆',
        hidden: false,
        category: 'challenge'
    },

    // Score Achievements (15)
    // Beginner
    {
        id: 'CHALLENGE_SCORE_BEGINNER_BRONZE',
        title: '初級スコア Bronze',
        description: 'チャレンジモード（初級）で3,000点を達成',
        icon: '🥉',
        hidden: false,
        category: 'challenge',
        tier: 'bronze'
    },
    {
        id: 'CHALLENGE_SCORE_BEGINNER_SILVER',
        title: '初級スコア Silver',
        description: 'チャレンジモード（初級）で5,000点を達成',
        icon: '🥈',
        hidden: false,
        category: 'challenge',
        tier: 'silver'
    },
    {
        id: 'CHALLENGE_SCORE_BEGINNER_GOLD',
        title: '初級スコア Gold',
        description: 'チャレンジモード（初級）で8,000点を達成',
        icon: '🥇',
        hidden: false,
        category: 'challenge',
        tier: 'gold'
    },
    // Amateur
    {
        id: 'CHALLENGE_SCORE_AMATEUR_BRONZE',
        title: '中級スコア Bronze',
        description: 'チャレンジモード（中級）で4,000点を達成',
        icon: '🥉',
        hidden: false,
        category: 'challenge',
        tier: 'bronze'
    },
    {
        id: 'CHALLENGE_SCORE_AMATEUR_SILVER',
        title: '中級スコア Silver',
        description: 'チャレンジモード（中級）で7,000点を達成',
        icon: '🥈',
        hidden: false,
        category: 'challenge',
        tier: 'silver'
    },
    {
        id: 'CHALLENGE_SCORE_AMATEUR_GOLD',
        title: '中級スコア Gold',
        description: 'チャレンジモード（中級）で12,000点を達成',
        icon: '🥇',
        hidden: false,
        category: 'challenge',
        tier: 'gold'
    },
    // Normal
    {
        id: 'CHALLENGE_SCORE_NORMAL_BRONZE',
        title: '上級スコア Bronze',
        description: 'チャレンジモード（上級）で5,000点を達成',
        icon: '🥉',
        hidden: false,
        category: 'challenge',
        tier: 'bronze'
    },
    {
        id: 'CHALLENGE_SCORE_NORMAL_SILVER',
        title: '上級スコア Silver',
        description: 'チャレンジモード（上級）で9,000点を達成',
        icon: '🥈',
        hidden: false,
        category: 'challenge',
        tier: 'silver'
    },
    {
        id: 'CHALLENGE_SCORE_NORMAL_GOLD',
        title: '上級スコア Gold',
        description: 'チャレンジモード（上級）で15,000点を達成',
        icon: '🥇',
        hidden: false,
        category: 'challenge',
        tier: 'gold'
    },
    // Expert
    {
        id: 'CHALLENGE_SCORE_EXPERT_BRONZE',
        title: '達人スコア Bronze',
        description: 'チャレンジモード（達人）で6,000点を達成',
        icon: '🥉',
        hidden: false,
        category: 'challenge',
        tier: 'bronze'
    },
    {
        id: 'CHALLENGE_SCORE_EXPERT_SILVER',
        title: '達人スコア Silver',
        description: 'チャレンジモード（達人）で11,000点を達成',
        icon: '🥈',
        hidden: false,
        category: 'challenge',
        tier: 'silver'
    },
    {
        id: 'CHALLENGE_SCORE_EXPERT_GOLD',
        title: '達人スコア Gold',
        description: 'チャレンジモード（達人）で18,000点を達成',
        icon: '🥇',
        hidden: false,
        category: 'challenge',
        tier: 'gold'
    },
    // Master
    {
        id: 'CHALLENGE_SCORE_MASTER_BRONZE',
        title: '師範スコア Bronze',
        description: 'チャレンジモード（師範）で7,000点を達成',
        icon: '🥉',
        hidden: false,
        category: 'challenge',
        tier: 'bronze'
    },
    {
        id: 'CHALLENGE_SCORE_MASTER_SILVER',
        title: '師範スコア Silver',
        description: 'チャレンジモード（師範）で13,000点を達成',
        icon: '🥈',
        hidden: false,
        category: 'challenge',
        tier: 'silver'
    },
    {
        id: 'CHALLENGE_SCORE_MASTER_GOLD',
        title: '師範スコア Gold',
        description: 'チャレンジモード（師範）で20,000点を達成',
        icon: '🥇',
        hidden: false,
        category: 'challenge',
        tier: 'gold'
    },

    // No-Miss Clears (5)
    {
        id: 'CHALLENGE_NOMISS_BEGINNER',
        title: '初級完全勝利',
        description: 'チャレンジモード（初級）をノーミスでクリア',
        icon: '🎯',
        hidden: false,
        category: 'challenge'
    },
    {
        id: 'CHALLENGE_NOMISS_AMATEUR',
        title: '中級完全勝利',
        description: 'チャレンジモード（中級）をノーミスでクリア',
        icon: '🎯',
        hidden: false,
        category: 'challenge'
    },
    {
        id: 'CHALLENGE_NOMISS_NORMAL',
        title: '上級完全勝利',
        description: 'チャレンジモード（上級）をノーミスでクリア',
        icon: '🎯',
        hidden: false,
        category: 'challenge'
    },
    {
        id: 'CHALLENGE_NOMISS_EXPERT',
        title: '達人完全勝利',
        description: 'チャレンジモード（達人）をノーミスでクリア',
        icon: '🎯',
        hidden: false,
        category: 'challenge'
    },
    {
        id: 'CHALLENGE_NOMISS_MASTER',
        title: '師範完全勝利',
        description: 'チャレンジモード（師範）をノーミスでクリア',
        icon: '🎯',
        hidden: false,
        category: 'challenge'
    },
    {
        id: 'CHALLENGE_ALL_FAST_BEGINNER',
        title: '初級神速',
        description: 'チャレンジモード（初級）で全問FASTボーナスを獲得してクリア',
        icon: '⚡',
        hidden: false,
        category: 'challenge',
        tier: 'silver'
    },
    {
        id: 'CHALLENGE_ALL_FAST_AMATEUR',
        title: '中級神速',
        description: 'チャレンジモード（中級）で全問FASTボーナスを獲得してクリア',
        icon: '⚡',
        hidden: false,
        category: 'challenge',
        tier: 'silver'
    },
    {
        id: 'CHALLENGE_ALL_FAST_NORMAL',
        title: '上級神速',
        description: 'チャレンジモード（上級）で全問FASTボーナスを獲得してクリア',
        icon: '⚡',
        hidden: false,
        category: 'challenge',
        tier: 'gold'
    },
    {
        id: 'CHALLENGE_ALL_FAST_EXPERT',
        title: '達人神速',
        description: 'チャレンジモード（達人）で全問FASTボーナスを獲得してクリア',
        icon: '⚡',
        hidden: false,
        category: 'challenge',
        tier: 'gold'
    },
    {
        id: 'CHALLENGE_ALL_FAST_MASTER',
        title: '師範神速',
        description: 'チャレンジモード（師範）で全問FASTボーナスを獲得してクリア',
        icon: '⚡',
        hidden: false,
        category: 'challenge',
        tier: 'gold'
    },

    // Cumulative FAST Bonus (3)
    {
        id: 'FAST_BONUS_BRONZE',
        title: 'FASTボーナス Bronze',
        description: 'FASTボーナスを累計15回獲得',
        icon: '⚡',
        hidden: false,
        category: 'challenge',
        tier: 'bronze'
    },
    {
        id: 'FAST_BONUS_SILVER',
        title: 'FASTボーナス Silver',
        description: 'FASTボーナスを累計50回獲得',
        icon: '⚡',
        hidden: false,
        category: 'challenge',
        tier: 'silver'
    },
    {
        id: 'FAST_BONUS_GOLD',
        title: 'FASTボーナス Gold',
        description: 'FASTボーナスを累計100回獲得',
        icon: '⚡',
        hidden: false,
        category: 'challenge',
        tier: 'gold'
    },

    // ========== SPRINT MODE ==========
    // Initial Clear (5)
    {
        id: 'SPRINT_CLEAR_BEGINNER',
        title: 'スプリント初級クリア',
        description: 'スプリントモード（初級）をクリア',
        icon: '🏃',
        hidden: false,
        category: 'sprint'
    },
    {
        id: 'SPRINT_CLEAR_AMATEUR',
        title: 'スプリント中級クリア',
        description: 'スプリントモード（中級）をクリア',
        icon: '🏃',
        hidden: false,
        category: 'sprint'
    },
    {
        id: 'SPRINT_CLEAR_NORMAL',
        title: 'スプリント上級クリア',
        description: 'スプリントモード（上級）をクリア',
        icon: '🏃',
        hidden: false,
        category: 'sprint'
    },
    {
        id: 'SPRINT_CLEAR_EXPERT',
        title: 'スプリント達人クリア',
        description: 'スプリントモード（達人）をクリア',
        icon: '🏃',
        hidden: false,
        category: 'sprint'
    },
    {
        id: 'SPRINT_CLEAR_MASTER',
        title: 'スプリント師範クリア',
        description: 'スプリントモード（師範）をクリア',
        icon: '🏃',
        hidden: false,
        category: 'sprint'
    },

    // No-Miss Clears (5)
    {
        id: 'SPRINT_NOMISS_BEGINNER',
        title: 'スプリント初級完全勝利',
        description: 'スプリントモード（初級）をノーミスでクリア',
        icon: '🎯',
        hidden: false,
        category: 'sprint'
    },
    {
        id: 'SPRINT_NOMISS_AMATEUR',
        title: 'スプリント中級完全勝利',
        description: 'スプリントモード（中級）をノーミスでクリア',
        icon: '🎯',
        hidden: false,
        category: 'sprint'
    },
    {
        id: 'SPRINT_NOMISS_NORMAL',
        title: 'スプリント上級完全勝利',
        description: 'スプリントモード（上級）をノーミスでクリア',
        icon: '🎯',
        hidden: false,
        category: 'sprint'
    },
    {
        id: 'SPRINT_NOMISS_EXPERT',
        title: 'スプリント達人完全勝利',
        description: 'スプリントモード（達人）をノーミスでクリア',
        icon: '🎯',
        hidden: false,
        category: 'sprint'
    },
    {
        id: 'SPRINT_NOMISS_MASTER',
        title: 'スプリント師範完全勝利',
        description: 'スプリントモード（師範）をノーミスでクリア',
        icon: '🎯',
        hidden: false,
        category: 'sprint'
    },

    // Time Achievements (15)
    // Beginner
    {
        id: 'SPRINT_TIME_BEGINNER_BRONZE',
        title: 'スプリント初級タイム Bronze',
        description: 'スプリントモード（初級）を120秒以内にクリア',
        icon: '⏱️',
        hidden: false,
        category: 'sprint',
        tier: 'bronze'
    },
    {
        id: 'SPRINT_TIME_BEGINNER_SILVER',
        title: 'スプリント初級タイム Silver',
        description: 'スプリントモード（初級）を90秒以内にクリア',
        icon: '⏱️',
        hidden: false,
        category: 'sprint',
        tier: 'silver'
    },
    {
        id: 'SPRINT_TIME_BEGINNER_GOLD',
        title: 'スプリント初級タイム Gold',
        description: 'スプリントモード（初級）を60秒以内にクリア',
        icon: '⏱️',
        hidden: false,
        category: 'sprint',
        tier: 'gold'
    },
    // Amateur
    {
        id: 'SPRINT_TIME_AMATEUR_BRONZE',
        title: 'スプリント中級タイム Bronze',
        description: 'スプリントモード（中級）を150秒以内にクリア',
        icon: '⏱️',
        hidden: false,
        category: 'sprint',
        tier: 'bronze'
    },
    {
        id: 'SPRINT_TIME_AMATEUR_SILVER',
        title: 'スプリント中級タイム Silver',
        description: 'スプリントモード（中級）を120秒以内にクリア',
        icon: '⏱️',
        hidden: false,
        category: 'sprint',
        tier: 'silver'
    },
    {
        id: 'SPRINT_TIME_AMATEUR_GOLD',
        title: 'スプリント中級タイム Gold',
        description: 'スプリントモード（中級）を90秒以内にクリア',
        icon: '⏱️',
        hidden: false,
        category: 'sprint',
        tier: 'gold'
    },
    // Normal
    {
        id: 'SPRINT_TIME_NORMAL_BRONZE',
        title: 'スプリント上級タイム Bronze',
        description: 'スプリントモード（上級）を180秒以内にクリア',
        icon: '⏱️',
        hidden: false,
        category: 'sprint',
        tier: 'bronze'
    },
    {
        id: 'SPRINT_TIME_NORMAL_SILVER',
        title: 'スプリント上級タイム Silver',
        description: 'スプリントモード（上級）を150秒以内にクリア',
        icon: '⏱️',
        hidden: false,
        category: 'sprint',
        tier: 'silver'
    },
    {
        id: 'SPRINT_TIME_NORMAL_GOLD',
        title: 'スプリント上級タイム Gold',
        description: 'スプリントモード（上級）を120秒以内にクリア',
        icon: '⏱️',
        hidden: false,
        category: 'sprint',
        tier: 'gold'
    },
    // Expert
    {
        id: 'SPRINT_TIME_EXPERT_BRONZE',
        title: 'スプリント達人タイム Bronze',
        description: 'スプリントモード（達人）を210秒以内にクリア',
        icon: '⏱️',
        hidden: false,
        category: 'sprint',
        tier: 'bronze'
    },
    {
        id: 'SPRINT_TIME_EXPERT_SILVER',
        title: 'スプリント達人タイム Silver',
        description: 'スプリントモード（達人）を180秒以内にクリア',
        icon: '⏱️',
        hidden: false,
        category: 'sprint',
        tier: 'silver'
    },
    {
        id: 'SPRINT_TIME_EXPERT_GOLD',
        title: 'スプリント達人タイム Gold',
        description: 'スプリントモード（達人）を150秒以内にクリア',
        icon: '⏱️',
        hidden: false,
        category: 'sprint',
        tier: 'gold'
    },
    // Master
    {
        id: 'SPRINT_TIME_MASTER_BRONZE',
        title: 'スプリント師範タイム Bronze',
        description: 'スプリントモード（師範）を240秒以内にクリア',
        icon: '⏱️',
        hidden: false,
        category: 'sprint',
        tier: 'bronze'
    },
    {
        id: 'SPRINT_TIME_MASTER_SILVER',
        title: 'スプリント師範タイム Silver',
        description: 'スプリントモード（師範）を210秒以内にクリア',
        icon: '⏱️',
        hidden: false,
        category: 'sprint',
        tier: 'silver'
    },
    {
        id: 'SPRINT_TIME_MASTER_GOLD',
        title: 'スプリント師範タイム Gold',
        description: 'スプリントモード（師範）を180秒以内にクリア',
        icon: '⏱️',
        hidden: false,
        category: 'sprint',
        tier: 'gold'
    },

    // ========== SURVIVAL MODE ==========
    // Correct Answer Achievements (15)
    // Beginner
    {
        id: 'SURVIVAL_CORRECT_BEGINNER_BRONZE',
        title: 'サバイバル初級 Bronze',
        description: 'サバイバルモード（初級）で5問正解',
        icon: '💪',
        hidden: false,
        category: 'survival',
        tier: 'bronze'
    },
    {
        id: 'SURVIVAL_CORRECT_BEGINNER_SILVER',
        title: 'サバイバル初級 Silver',
        description: 'サバイバルモード（初級）で15問正解',
        icon: '💪',
        hidden: false,
        category: 'survival',
        tier: 'silver'
    },
    {
        id: 'SURVIVAL_CORRECT_BEGINNER_GOLD',
        title: 'サバイバル初級 Gold',
        description: 'サバイバルモード（初級）で30問正解',
        icon: '💪',
        hidden: false,
        category: 'survival',
        tier: 'gold'
    },
    // Amateur
    {
        id: 'SURVIVAL_CORRECT_AMATEUR_BRONZE',
        title: 'サバイバル中級 Bronze',
        description: 'サバイバルモード（中級）で5問正解',
        icon: '💪',
        hidden: false,
        category: 'survival',
        tier: 'bronze'
    },
    {
        id: 'SURVIVAL_CORRECT_AMATEUR_SILVER',
        title: 'サバイバル中級 Silver',
        description: 'サバイバルモード（中級）で15問正解',
        icon: '💪',
        hidden: false,
        category: 'survival',
        tier: 'silver'
    },
    {
        id: 'SURVIVAL_CORRECT_AMATEUR_GOLD',
        title: 'サバイバル中級 Gold',
        description: 'サバイバルモード（中級）で30問正解',
        icon: '💪',
        hidden: false,
        category: 'survival',
        tier: 'gold'
    },
    // Normal
    {
        id: 'SURVIVAL_CORRECT_NORMAL_BRONZE',
        title: 'サバイバル上級 Bronze',
        description: 'サバイバルモード（上級）で5問正解',
        icon: '💪',
        hidden: false,
        category: 'survival',
        tier: 'bronze'
    },
    {
        id: 'SURVIVAL_CORRECT_NORMAL_SILVER',
        title: 'サバイバル上級 Silver',
        description: 'サバイバルモード（上級）で15問正解',
        icon: '💪',
        hidden: false,
        category: 'survival',
        tier: 'silver'
    },
    {
        id: 'SURVIVAL_CORRECT_NORMAL_GOLD',
        title: 'サバイバル上級 Gold',
        description: 'サバイバルモード（上級）で30問正解',
        icon: '💪',
        hidden: false,
        category: 'survival',
        tier: 'gold'
    },
    // Expert
    {
        id: 'SURVIVAL_CORRECT_EXPERT_BRONZE',
        title: 'サバイバル達人 Bronze',
        description: 'サバイバルモード（達人）で5問正解',
        icon: '💪',
        hidden: false,
        category: 'survival',
        tier: 'bronze'
    },
    {
        id: 'SURVIVAL_CORRECT_EXPERT_SILVER',
        title: 'サバイバル達人 Silver',
        description: 'サバイバルモード（達人）で15問正解',
        icon: '💪',
        hidden: false,
        category: 'survival',
        tier: 'silver'
    },
    {
        id: 'SURVIVAL_CORRECT_EXPERT_GOLD',
        title: 'サバイバル達人 Gold',
        description: 'サバイバルモード（達人）で30問正解',
        icon: '💪',
        hidden: false,
        category: 'survival',
        tier: 'gold'
    },
    // Master
    {
        id: 'SURVIVAL_CORRECT_MASTER_BRONZE',
        title: 'サバイバル師範 Bronze',
        description: 'サバイバルモード（師範）で5問正解',
        icon: '💪',
        hidden: false,
        category: 'survival',
        tier: 'bronze'
    },
    {
        id: 'SURVIVAL_CORRECT_MASTER_SILVER',
        title: 'サバイバル師範 Silver',
        description: 'サバイバルモード（師範）で15問正解',
        icon: '💪',
        hidden: false,
        category: 'survival',
        tier: 'silver'
    },
    {
        id: 'SURVIVAL_CORRECT_MASTER_GOLD',
        title: 'サバイバル師範 Gold',
        description: 'サバイバルモード（師範）で30問正解',
        icon: '💪',
        hidden: false,
        category: 'survival',
        tier: 'gold'
    },

    // ========== PRACTICE MODE ==========
    {
        id: 'PRACTICE_FIRST_PLAY',
        title: 'プラクティス',
        description: 'プラクティスモードで初プレイ',
        icon: '📚',
        hidden: false,
        category: 'practice'
    },

    // ========== GLOBAL (Mode/Difficulty Agnostic) ==========
    // Total Correct Answers (3)
    {
        id: 'GLOBAL_CORRECT_BRONZE',
        title: '正解数 Bronze',
        description: '累計15問正解',
        icon: '🎓',
        hidden: false,
        category: 'global',
        tier: 'bronze'
    },
    {
        id: 'GLOBAL_CORRECT_SILVER',
        title: '正解数 Silver',
        description: '累計50問正解',
        icon: '🎓',
        hidden: false,
        category: 'global',
        tier: 'silver'
    },
    {
        id: 'GLOBAL_CORRECT_GOLD',
        title: '正解数 Gold',
        description: '累計100問正解',
        icon: '🎓',
        hidden: false,
        category: 'global',
        tier: 'gold'
    },

    // Additional Correct Answers Milestones (6)
    {
        id: 'GLOBAL_CORRECT_150',
        title: '正解数 150',
        description: '累計150問正解',
        icon: '🎓',
        hidden: false,
        category: 'global',
        tier: 'bronze'
    },
    {
        id: 'GLOBAL_CORRECT_200',
        title: '正解数 200',
        description: '累計200問正解',
        icon: '🎓',
        hidden: false,
        category: 'global',
        tier: 'silver'
    },
    {
        id: 'GLOBAL_CORRECT_300',
        title: '正解数 300',
        description: '累計300問正解',
        icon: '🎓',
        hidden: false,
        category: 'global',
        tier: 'silver'
    },
    {
        id: 'GLOBAL_CORRECT_500',
        title: '正解数 500',
        description: '累計500問正解',
        icon: '🎓',
        hidden: false,
        category: 'global',
        tier: 'gold'
    },
    {
        id: 'GLOBAL_CORRECT_750',
        title: '正解数 750',
        description: '累計750問正解',
        icon: '🎓',
        hidden: false,
        category: 'global',
        tier: 'gold'
    },
    {
        id: 'GLOBAL_CORRECT_1000',
        title: '正解数 1000',
        description: '累計1000問正解',
        icon: '🎓',
        hidden: false,
        category: 'global',
        tier: 'gold'
    },

    // Mode Play Count (9)
    {
        id: 'CHALLENGE_PLAYS_BRONZE',
        title: 'チャレンジャー Bronze',
        description: 'チャレンジモードを累計10回プレイ',
        icon: '🎮',
        hidden: false,
        category: 'challenge',
        tier: 'bronze'
    },
    {
        id: 'CHALLENGE_PLAYS_SILVER',
        title: 'チャレンジャー Silver',
        description: 'チャレンジモードを累計30回プレイ',
        icon: '🎮',
        hidden: false,
        category: 'challenge',
        tier: 'silver'
    },
    {
        id: 'CHALLENGE_PLAYS_GOLD',
        title: 'チャレンジャー Gold',
        description: 'チャレンジモードを累計100回プレイ',
        icon: '🎮',
        hidden: false,
        category: 'challenge',
        tier: 'gold'
    },
    {
        id: 'SPRINT_PLAYS_BRONZE',
        title: 'スプリンター Bronze',
        description: 'スプリントモードを累計10回プレイ',
        icon: '🎮',
        hidden: false,
        category: 'sprint',
        tier: 'bronze'
    },
    {
        id: 'SPRINT_PLAYS_SILVER',
        title: 'スプリンター Silver',
        description: 'スプリントモードを累計30回プレイ',
        icon: '🎮',
        hidden: false,
        category: 'sprint',
        tier: 'silver'
    },
    {
        id: 'SPRINT_PLAYS_GOLD',
        title: 'スプリンター Gold',
        description: 'スプリントモードを累計100回プレイ',
        icon: '🎮',
        hidden: false,
        category: 'sprint',
        tier: 'gold'
    },
    {
        id: 'SURVIVAL_PLAYS_BRONZE',
        title: 'サバイバリスト Bronze',
        description: 'サバイバルモードを累計10回プレイ',
        icon: '🎮',
        hidden: false,
        category: 'survival',
        tier: 'bronze'
    },
    {
        id: 'SURVIVAL_PLAYS_SILVER',
        title: 'サバイバリスト Silver',
        description: 'サバイバルモードを累計30回プレイ',
        icon: '🎮',
        hidden: false,
        category: 'survival',
        tier: 'silver'
    },
    {
        id: 'SURVIVAL_PLAYS_GOLD',
        title: 'サバイバリスト Gold',
        description: 'サバイバルモードを累計100回プレイ',
        icon: '🎮',
        hidden: false,
        category: 'survival',
        tier: 'gold'
    },

    // 3+ Tile Waits (3)
    {
        id: 'WAIT3_BRONZE',
        title: '3面待ち以上 Bronze',
        description: '3面待ち以上を累計15問正解',
        icon: '🌟',
        hidden: false,
        category: 'global',
        tier: 'bronze'
    },
    {
        id: 'WAIT3_SILVER',
        title: '3面待ち以上 Silver',
        description: '3面待ち以上を累計50問正解',
        icon: '🌟',
        hidden: false,
        category: 'global',
        tier: 'silver'
    },
    {
        id: 'WAIT3_GOLD',
        title: '3面待ち以上 Gold',
        description: '3面待ち以上を累計100問正解',
        icon: '🌟',
        hidden: false,
        category: 'global',
        tier: 'gold'
    },

    // 6+ Tile Waits (3)
    {
        id: 'WAIT6_BRONZE',
        title: '6面待ち以上 Bronze',
        description: '6面待ち以上を累計15問正解',
        icon: '✨',
        hidden: false,
        category: 'global',
        tier: 'bronze'
    },
    {
        id: 'WAIT6_SILVER',
        title: '6面待ち以上 Silver',
        description: '6面待ち以上を累計50問正解',
        icon: '✨',
        hidden: false,
        category: 'global',
        tier: 'silver'
    },
    {
        id: 'WAIT6_GOLD',
        title: '6面待ち以上 Gold',
        description: '6面待ち以上を累計100問正解',
        icon: '✨',
        hidden: false,
        category: 'global',
        tier: 'gold'
    },

    // 9 Tile Waits (1)
    {
        id: 'WAIT9',
        title: '九連宝燈',
        description: '9面待ちを正解',
        icon: '💎',
        hidden: false,
        category: 'global'
    },

    // ========== PLATINUM ==========
    {
        id: 'PLATINUM_ALL_TROPHIES',
        title: '完全制覇',
        description: '他のすべてのトロフィーを獲得した',
        icon: '👑',
        hidden: false,
        category: 'platinum',
        tier: 'platinum'
    }
];

// Helper type for trophy checking
export interface GameStateForTrophyCheck {
    mode: string;
    difficulty: Difficulty;
    isClear: boolean;
    score?: number;
    hasErrors?: boolean;
    fastBonusCount?: number;
    totalTime?: number; // For sprint mode
}

// Helper function to check trophy unlock conditions
export const checkTrophyUnlock = (
    trophyId: string,
    gameState: GameStateForTrophyCheck,
    modeStats: Record<string, ModeStats>,
    globalStats: GlobalStats
): boolean => {
    const { mode, difficulty, isClear, score = 0, hasErrors = false, fastBonusCount = 0, totalTime = Infinity } = gameState;

    // Platinum trophy - check if all other trophies are unlocked
    if (trophyId === 'PLATINUM_ALL_TROPHIES') {
        return false; // This will be handled separately in the store
    }

    // ========== CHALLENGE MODE ==========
    if (trophyId.startsWith('CHALLENGE_CLEAR_') && mode === 'challenge' && isClear) {
        const diffMap: Record<string, Difficulty> = {
            'CHALLENGE_CLEAR_BEGINNER': 'beginner',
            'CHALLENGE_CLEAR_AMATEUR': 'amateur',
            'CHALLENGE_CLEAR_NORMAL': 'normal',
            'CHALLENGE_CLEAR_EXPERT': 'expert',
            'CHALLENGE_CLEAR_MASTER': 'master'
        };
        return diffMap[trophyId] === difficulty;
    }

    if (trophyId.startsWith('CHALLENGE_SCORE_') && mode === 'challenge' && isClear) {
        const scoreThresholds: Record<string, number> = {
            'CHALLENGE_SCORE_BEGINNER_BRONZE': 3000,
            'CHALLENGE_SCORE_BEGINNER_SILVER': 5000,
            'CHALLENGE_SCORE_BEGINNER_GOLD': 8000,
            'CHALLENGE_SCORE_AMATEUR_BRONZE': 4000,
            'CHALLENGE_SCORE_AMATEUR_SILVER': 7000,
            'CHALLENGE_SCORE_AMATEUR_GOLD': 12000,
            'CHALLENGE_SCORE_NORMAL_BRONZE': 5000,
            'CHALLENGE_SCORE_NORMAL_SILVER': 9000,
            'CHALLENGE_SCORE_NORMAL_GOLD': 15000,
            'CHALLENGE_SCORE_EXPERT_BRONZE': 6000,
            'CHALLENGE_SCORE_EXPERT_SILVER': 11000,
            'CHALLENGE_SCORE_EXPERT_GOLD': 18000,
            'CHALLENGE_SCORE_MASTER_BRONZE': 7000,
            'CHALLENGE_SCORE_MASTER_SILVER': 13000,
            'CHALLENGE_SCORE_MASTER_GOLD': 20000
        };
        const threshold = scoreThresholds[trophyId];
        const diff = trophyId.split('_')[2].toLowerCase() as Difficulty;
        return difficulty === diff && score >= threshold;
    }

    if (trophyId.startsWith('CHALLENGE_NOMISS_') && mode === 'challenge' && isClear && !hasErrors) {
        const diffMap: Record<string, Difficulty> = {
            'CHALLENGE_NOMISS_BEGINNER': 'beginner',
            'CHALLENGE_NOMISS_AMATEUR': 'amateur',
            'CHALLENGE_NOMISS_NORMAL': 'normal',
            'CHALLENGE_NOMISS_EXPERT': 'expert',
            'CHALLENGE_NOMISS_MASTER': 'master'
        };
        return diffMap[trophyId] === difficulty;
    }

    if (trophyId.startsWith('CHALLENGE_ALL_FAST_') && mode === 'challenge' && isClear) {
        const diffMap: Record<string, Difficulty> = {
            'CHALLENGE_ALL_FAST_BEGINNER': 'beginner',
            'CHALLENGE_ALL_FAST_AMATEUR': 'amateur',
            'CHALLENGE_ALL_FAST_NORMAL': 'normal',
            'CHALLENGE_ALL_FAST_EXPERT': 'expert',
            'CHALLENGE_ALL_FAST_MASTER': 'master'
        };
        // 全問正解かつ全問FASTボーナス (10問)
        return diffMap[trophyId] === difficulty && fastBonusCount >= 10;
    }

    if (trophyId.startsWith('FAST_BONUS_')) {
        const thresholds: Record<string, number> = {
            'FAST_BONUS_BRONZE': 15,
            'FAST_BONUS_SILVER': 50,
            'FAST_BONUS_GOLD': 100
        };
        // Sum FAST bonuses across all challenge difficulties
        let totalFast = 0;
        ['beginner', 'amateur', 'normal', 'expert', 'master'].forEach((diff) => {
            const key = `challenge_${diff}`;
            totalFast += modeStats[key]?.fastBonuses || 0;
        });
        return totalFast >= thresholds[trophyId];
    }

    // ========== SPRINT MODE ==========
    if (trophyId.startsWith('SPRINT_CLEAR_') && mode === 'sprint' && isClear) {
        const diffMap: Record<string, Difficulty> = {
            'SPRINT_CLEAR_BEGINNER': 'beginner',
            'SPRINT_CLEAR_AMATEUR': 'amateur',
            'SPRINT_CLEAR_NORMAL': 'normal',
            'SPRINT_CLEAR_EXPERT': 'expert',
            'SPRINT_CLEAR_MASTER': 'master'
        };
        return diffMap[trophyId] === difficulty;
    }

    if (trophyId.startsWith('SPRINT_NOMISS_') && mode === 'sprint' && isClear && !hasErrors) {
        const diffMap: Record<string, Difficulty> = {
            'SPRINT_NOMISS_BEGINNER': 'beginner',
            'SPRINT_NOMISS_AMATEUR': 'amateur',
            'SPRINT_NOMISS_NORMAL': 'normal',
            'SPRINT_NOMISS_EXPERT': 'expert',
            'SPRINT_NOMISS_MASTER': 'master'
        };
        return diffMap[trophyId] === difficulty;
    }

    if (trophyId.startsWith('SPRINT_TIME_') && mode === 'sprint' && isClear) {
        const timeThresholds: Record<string, number> = {
            'SPRINT_TIME_BEGINNER_BRONZE': 120,
            'SPRINT_TIME_BEGINNER_SILVER': 90,
            'SPRINT_TIME_BEGINNER_GOLD': 60,
            'SPRINT_TIME_AMATEUR_BRONZE': 150,
            'SPRINT_TIME_AMATEUR_SILVER': 120,
            'SPRINT_TIME_AMATEUR_GOLD': 90,
            'SPRINT_TIME_NORMAL_BRONZE': 180,
            'SPRINT_TIME_NORMAL_SILVER': 150,
            'SPRINT_TIME_NORMAL_GOLD': 120,
            'SPRINT_TIME_EXPERT_BRONZE': 210,
            'SPRINT_TIME_EXPERT_SILVER': 180,
            'SPRINT_TIME_EXPERT_GOLD': 150,
            'SPRINT_TIME_MASTER_BRONZE': 240,
            'SPRINT_TIME_MASTER_SILVER': 210,
            'SPRINT_TIME_MASTER_GOLD': 180
        };
        const threshold = timeThresholds[trophyId];
        const diff = trophyId.split('_')[2].toLowerCase() as Difficulty;
        return difficulty === diff && totalTime <= threshold;
    }

    // ========== SURVIVAL MODE ==========
    if (trophyId.startsWith('SURVIVAL_CORRECT_') && mode === 'survival') {
        const correctThresholds: Record<string, number> = {
            'SURVIVAL_CORRECT_BEGINNER_BRONZE': 5,
            'SURVIVAL_CORRECT_BEGINNER_SILVER': 15,
            'SURVIVAL_CORRECT_BEGINNER_GOLD': 30,
            'SURVIVAL_CORRECT_AMATEUR_BRONZE': 5,
            'SURVIVAL_CORRECT_AMATEUR_SILVER': 15,
            'SURVIVAL_CORRECT_AMATEUR_GOLD': 30,
            'SURVIVAL_CORRECT_NORMAL_BRONZE': 5,
            'SURVIVAL_CORRECT_NORMAL_SILVER': 15,
            'SURVIVAL_CORRECT_NORMAL_GOLD': 30,
            'SURVIVAL_CORRECT_EXPERT_BRONZE': 5,
            'SURVIVAL_CORRECT_EXPERT_SILVER': 15,
            'SURVIVAL_CORRECT_EXPERT_GOLD': 30,
            'SURVIVAL_CORRECT_MASTER_BRONZE': 5,
            'SURVIVAL_CORRECT_MASTER_SILVER': 15,
            'SURVIVAL_CORRECT_MASTER_GOLD': 30
        };
        const threshold = correctThresholds[trophyId];
        const diff = trophyId.split('_')[2].toLowerCase() as Difficulty;
        return difficulty === diff && score >= threshold;
    }

    // ========== PRACTICE MODE ==========
    if (trophyId === 'PRACTICE_FIRST_PLAY') {
        return globalStats.practiceAttempts >= 1;
    }

    // ========== GLOBAL ==========
    if (trophyId.startsWith('GLOBAL_CORRECT_')) {
        const thresholds: Record<string, number> = {
            'GLOBAL_CORRECT_BRONZE': 15,
            'GLOBAL_CORRECT_SILVER': 50,
            'GLOBAL_CORRECT_GOLD': 100,
            'GLOBAL_CORRECT_150': 150,
            'GLOBAL_CORRECT_200': 200,
            'GLOBAL_CORRECT_300': 300,
            'GLOBAL_CORRECT_500': 500,
            'GLOBAL_CORRECT_750': 750,
            'GLOBAL_CORRECT_1000': 1000
        };
        return globalStats.totalCorrect >= thresholds[trophyId];
    }

    // Mode Play Count
    if (trophyId.startsWith('CHALLENGE_PLAYS_')) {
        const thresholds: Record<string, number> = {
            'CHALLENGE_PLAYS_BRONZE': 10,
            'CHALLENGE_PLAYS_SILVER': 30,
            'CHALLENGE_PLAYS_GOLD': 100
        };
        const totalAttempts = ['beginner', 'amateur', 'normal', 'expert', 'master']
            .reduce((sum, diff) => sum + (modeStats[`challenge_${diff}`]?.attempts || 0), 0);
        return totalAttempts >= thresholds[trophyId];
    }

    if (trophyId.startsWith('SPRINT_PLAYS_')) {
        const thresholds: Record<string, number> = {
            'SPRINT_PLAYS_BRONZE': 10,
            'SPRINT_PLAYS_SILVER': 30,
            'SPRINT_PLAYS_GOLD': 100
        };
        const totalAttempts = ['beginner', 'amateur', 'normal', 'expert', 'master']
            .reduce((sum, diff) => sum + (modeStats[`sprint_${diff}`]?.attempts || 0), 0);
        return totalAttempts >= thresholds[trophyId];
    }

    if (trophyId.startsWith('SURVIVAL_PLAYS_')) {
        const thresholds: Record<string, number> = {
            'SURVIVAL_PLAYS_BRONZE': 10,
            'SURVIVAL_PLAYS_SILVER': 30,
            'SURVIVAL_PLAYS_GOLD': 100
        };
        const totalAttempts = ['beginner', 'amateur', 'normal', 'expert', 'master']
            .reduce((sum, diff) => sum + (modeStats[`survival_${diff}`]?.attempts || 0), 0);
        return totalAttempts >= thresholds[trophyId];
    }

    if (trophyId.startsWith('WAIT3_')) {
        const thresholds: Record<string, number> = {
            'WAIT3_BRONZE': 15,
            'WAIT3_SILVER': 50,
            'WAIT3_GOLD': 100
        };
        return globalStats.wait3Plus >= thresholds[trophyId];
    }

    if (trophyId.startsWith('WAIT6_')) {
        const thresholds: Record<string, number> = {
            'WAIT6_BRONZE': 15,
            'WAIT6_SILVER': 50,
            'WAIT6_GOLD': 100
        };
        return globalStats.wait6Plus >= thresholds[trophyId];
    }

    if (trophyId === 'WAIT9') {
        return globalStats.wait9 >= 1;
    }

    return false;
};
