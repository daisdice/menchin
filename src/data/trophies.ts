import type { Difficulty } from '../store/useGameStore';

export interface Trophy {
    id: string;
    title: string;
    description: string;
    icon: string;
    hidden: boolean;
}

export const TROPHIES: Trophy[] = [
    {
        id: 'CHALLENGE_CLEAR_BEGINNER',
        title: '初級クリア',
        description: 'チャレンジモード（初級）をクリアした',
        icon: '🏆',
        hidden: false
    },
    {
        id: 'CHALLENGE_CLEAR_AMATEUR',
        title: '中級クリア',
        description: 'チャレンジモード（中級）をクリアした',
        icon: '🏆',
        hidden: false
    },
    {
        id: 'CHALLENGE_CLEAR_NORMAL',
        title: '上級クリア',
        description: 'チャレンジモード（上級）をクリアした',
        icon: '🏆',
        hidden: false
    },
    {
        id: 'CHALLENGE_CLEAR_EXPERT',
        title: '達人クリア',
        description: 'チャレンジモード（達人）をクリアした',
        icon: '🏆',
        hidden: false
    },
    {
        id: 'CHALLENGE_CLEAR_MASTER',
        title: '師範クリア',
        description: 'チャレンジモード（師範）をクリアした',
        icon: '🏆',
        hidden: false
    }
];

// Helper function to check trophy unlock conditions
export const checkTrophyUnlock = (trophyId: string, gameState: { mode: string; difficulty: Difficulty; isClear: boolean }): boolean => {
    const { mode, difficulty, isClear } = gameState;

    // Only unlock on clear
    if (!isClear) return false;

    // Only for challenge mode
    if (mode !== 'challenge') return false;

    switch (trophyId) {
        case 'CHALLENGE_CLEAR_BEGINNER':
            return difficulty === 'beginner';
        case 'CHALLENGE_CLEAR_AMATEUR':
            return difficulty === 'amateur';
        case 'CHALLENGE_CLEAR_NORMAL':
            return difficulty === 'normal';
        case 'CHALLENGE_CLEAR_EXPERT':
            return difficulty === 'expert';
        case 'CHALLENGE_CLEAR_MASTER':
            return difficulty === 'master';
        default:
            return false;
    }
};
