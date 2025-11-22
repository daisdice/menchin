/**
 * Game Controller
 */

const Game = {
    state: {
        isPlaying: false,
        score: 0,
        timeLeft: 60,
        currentHand: [],
        currentWaits: [],
        selectedWaits: new Set(),
        timerInterval: null,
        ranking: {
            easy: [],
            normal: [],
            hard: [],
            random: []
        },
        currentRankingTab: 'normal',
        difficulty: 'normal', // easy, normal, hard, random
        gameMode: 'challenge', // challenge, training
        trainingWaitCount: 0, // 0 = any, 1-5 = specific
        stats: {
            totalGames: 0,
            totalQuestions: 0,
            totalCorrect: 0,
            totalTime: 0,
            maxStreak: 0,
            currentStreak: 0,
            waitCountStats: {},  // { 1: {correct: 0, total: 0}, ... }
            difficultyStats: {}, // { easy: {correct: 0, total: 0}, ... }
            achievements: [] // Array of unlocked achievement IDs
        },
        questionStartTime: null
    },

    achievementsList: [
        // Bronze
        { id: 'beginner', name: 'メンチン初心者', description: '初めてクイズに正解する', icon: '🔰', rank: 'bronze' },
        { id: 'score_10', name: '見習い雀士', description: '1プレイで10点以上獲得する', icon: '🐣', rank: 'bronze' },
        { id: 'streak_5', name: 'プチ連荘', description: '5問連続正解する', icon: '🔥', rank: 'bronze' },

        // Silver
        { id: 'score_20', name: 'メンチン初段', description: '1プレイで20点以上獲得する', icon: '🥋', rank: 'silver' },
        { id: 'streak_10', name: '集中力', description: '10問連続正解する', icon: '⚡', rank: 'silver' },
        { id: 'hard_mode', name: '上級者への道', description: '上級モードでプレイして正解する', icon: '🏔️', rank: 'silver' },
        { id: 'total_50', name: '努力家', description: '累計50問正解する', icon: '📚', rank: 'silver' },

        // Gold
        { id: 'score_30', name: 'メンチンマスター', description: '1プレイで30点以上獲得する', icon: '👑', rank: 'gold' },
        { id: 'streak_20', name: 'ゾーン突入', description: '20問連続正解する', icon: '🌈', rank: 'gold' },
        { id: 'multi_wait_master', name: '多面張マスター', description: '5面待ち以上を累計10回正解する', icon: '👁️', rank: 'gold' },
        { id: 'speed_star', name: 'スピードスター', description: '平均回答時間2秒以内で10問以上正解して終了', icon: '🚀', rank: 'gold' },
        { id: 'total_100', name: '百人組手', description: '累計100問正解する', icon: '💯', rank: 'gold' }
    ],

    elements: {
        startScreen: document.getElementById('start-screen'),
        gameScreen: document.getElementById('game-screen'),
        resultScreen: document.getElementById('result-screen'),
        statsScreen: document.getElementById('stats-screen'),
        startBtn: document.getElementById('start-btn'),
        restartBtn: document.getElementById('restart-btn'),
        timeLeft: document.getElementById('time-left'),
        currentScore: document.getElementById('current-score'),
        finalScore: document.getElementById('final-score-val'),
        handContainer: document.getElementById('hand-container'),
        numBtns: document.querySelectorAll('.num-btn'),
        submitBtn: document.getElementById('submit-answer-btn'),
        feedback: document.getElementById('feedback'),
        rankingList: document.getElementById('ranking-list'),
        newRecordMsg: document.getElementById('new-record-msg'),
        titleBtn: document.getElementById('title-btn'),
        statsBtn: document.getElementById('stats-btn'),
        statsBackBtn: document.getElementById('stats-back-btn'),
        statsResetBtn: document.getElementById('stats-reset-btn'),
        quitTrainingBtn: document.getElementById('quit-training-btn')
    },

    init: function () {
        this.loadRanking();
        this.loadStats();

        // Ranking Screen Events
        const rankingBtn = document.getElementById('ranking-btn');
        if (rankingBtn) {
            rankingBtn.addEventListener('click', () => this.showRanking());
        }

        const rankingBackBtn = document.getElementById('ranking-back-btn');
        if (rankingBackBtn) {
            rankingBackBtn.addEventListener('click', () => this.returnToTitle());
        }

        document.querySelectorAll('.tab-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const tab = e.target.dataset.tab;
                this.switchRankingTab(tab);
            });
        });

        // Difficulty buttons
        document.querySelectorAll('.difficulty-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const diff = e.currentTarget.dataset.diff;
                this.startGame(diff);
            });
        });

        // Training mode
        const trainingBtn = document.getElementById('training-mode-btn');
        if (trainingBtn) {
            trainingBtn.addEventListener('click', () => this.switchScreen('training-screen'));
        }

        const trainingBackBtn = document.getElementById('training-back-btn');
        if (trainingBackBtn) {
            trainingBackBtn.addEventListener('click', () => this.returnToTitle());
        }

        const startTrainingBtn = document.getElementById('start-training-btn');
        if (startTrainingBtn) {
            startTrainingBtn.addEventListener('click', () => this.startTraining());
        }

        const quitTrainingBtn = document.getElementById('quit-training-btn');
        if (quitTrainingBtn) {
            quitTrainingBtn.addEventListener('click', () => this.quitTraining());
        }

        // Training wait selection
        document.querySelectorAll('.training-wait-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                document.querySelectorAll('.training-wait-btn').forEach(b => b.classList.remove('selected'));
                e.target.classList.add('selected');
                this.state.trainingWaitCount = parseInt(e.target.dataset.wait);
                document.getElementById('start-training-btn').disabled = false;
            });
        });

        // Stats Tabs
        document.querySelectorAll('.stats-tab-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const target = e.target.dataset.target;

                // Update tab buttons
                document.querySelectorAll('.stats-tab-btn').forEach(b => b.classList.remove('active'));
                e.target.classList.add('active');

                // Update content sections
                document.querySelectorAll('.stats-content-section').forEach(s => s.classList.remove('active'));
                document.getElementById(target).classList.add('active');
            });
        });

        this.elements.restartBtn.addEventListener('click', () => this.returnToTitle()); // Restart goes to title now to pick diff

        if (this.elements.titleBtn) {
            this.elements.titleBtn.addEventListener('click', () => this.returnToTitle());
        }

        if (this.elements.statsBtn) {
            this.elements.statsBtn.addEventListener('click', () => this.showStats());
        }

        if (this.elements.statsBackBtn) {
            this.elements.statsBackBtn.addEventListener('click', () => this.returnToTitle());
        }

        if (this.elements.statsResetBtn) {
            this.elements.statsResetBtn.addEventListener('click', () => this.resetStats());
        }

        this.elements.numBtns.forEach(btn => {
            btn.addEventListener('click', (e) => this.toggleWait(e.target));
        });

        this.elements.submitBtn.addEventListener('click', () => this.submitAnswer());

        const shareBtn = document.getElementById('share-btn');
        if (shareBtn) {
            shareBtn.addEventListener('click', () => this.shareResult());
        }

        const statsShareBtn = document.getElementById('stats-share-btn');
        if (statsShareBtn) {
            statsShareBtn.addEventListener('click', () => this.shareStats());
        }
    },

    loadRanking: function () {
        const stored = localStorage.getItem('menchin_ranking');
        if (stored) {
            try {
                const parsed = JSON.parse(stored);
                // Check if structure matches (has random key)
                if (parsed.random) {
                    this.state.ranking = parsed;
                } else {
                    // Reset if structure doesn't match
                    this.state.ranking = { easy: [], normal: [], hard: [], random: [] };
                    this.saveRanking();
                }
            } catch (e) {
                console.error("Failed to parse ranking", e);
                this.state.ranking = { easy: [], normal: [], hard: [], random: [] };
            }
        } else {
            this.state.ranking = { easy: [], normal: [], hard: [], random: [] };
        }
    },

    saveRanking: function () {
        localStorage.setItem('menchin_ranking', JSON.stringify(this.state.ranking));
    },

    loadStats: function () {
        const stored = localStorage.getItem('menchin_stats');
        if (stored) {
            try {
                const loadedStats = JSON.parse(stored);
                // Check if structure matches (has difficultyStats)
                if (loadedStats.difficultyStats) {
                    this.state.stats = loadedStats;
                } else {
                    this.initializeStats();
                    this.saveStats();
                }
            } catch (e) {
                console.error("Failed to parse stats", e);
                this.initializeStats();
            }
        } else {
            this.initializeStats();
        }
    },

    initializeStats: function () {
        this.state.stats = {
            totalGames: 0,
            totalQuestions: 0,
            totalCorrect: 0,
            totalTime: 0,
            maxStreak: 0,
            currentStreak: 0,
            waitCountStats: {
                1: { correct: 0, total: 0 },
                2: { correct: 0, total: 0 },
                3: { correct: 0, total: 0 },
                4: { correct: 0, total: 0 },
                5: { correct: 0, total: 0 }  // 5+ waits
            },
            difficultyStats: {
                easy: { correct: 0, total: 0 },
                normal: { correct: 0, total: 0 },
                hard: { correct: 0, total: 0 },
                random: { correct: 0, total: 0 }
            },
            achievements: []
        };
    },

    saveStats: function () {
        localStorage.setItem('menchin_stats', JSON.stringify(this.state.stats));
    },

    updateStats: function (isCorrect, waits, timeSpent) {
        if (this.state.gameMode === 'training') return;

        this.state.stats.totalQuestions++;
        this.state.stats.totalTime += timeSpent;

        if (isCorrect) {
            this.state.stats.totalCorrect++;
            this.state.stats.currentStreak++;
            if (this.state.stats.currentStreak > this.state.stats.maxStreak) {
                this.state.stats.maxStreak = this.state.stats.currentStreak;
            }
        } else {
            this.state.stats.currentStreak = 0;
        }

        // Update wait-count stats
        const waitCount = waits.length;
        const countKey = waitCount >= 5 ? 5 : waitCount;  // 5+ waits grouped together

        if (!this.state.stats.waitCountStats[countKey]) {
            this.state.stats.waitCountStats[countKey] = { correct: 0, total: 0 };
        }
        this.state.stats.waitCountStats[countKey].total++;
        if (isCorrect) {
            this.state.stats.waitCountStats[countKey].correct++;
        }

        // Update difficulty stats
        const diff = this.state.difficulty;
        if (!this.state.stats.difficultyStats[diff]) {
            this.state.stats.difficultyStats[diff] = { correct: 0, total: 0 };
        }
        this.state.stats.difficultyStats[diff].total++;
        if (isCorrect) {
            this.state.stats.difficultyStats[diff].correct++;
        }

        this.checkAchievements(isCorrect, waits, timeSpent);
        this.saveStats();
    },

    checkAchievements: function (isCorrect, waits, timeSpent) {
        const stats = this.state.stats;
        const newUnlocks = [];

        // Helper to unlock
        const unlock = (id) => {
            if (!stats.achievements) stats.achievements = [];
            if (!stats.achievements.includes(id)) {
                stats.achievements.push(id);
                newUnlocks.push(this.achievementsList.find(a => a.id === id));
            }
        };

        if (isCorrect) {
            unlock('beginner');

            if (stats.currentStreak >= 5) unlock('streak_5');
            if (stats.currentStreak >= 10) unlock('streak_10');
            if (stats.currentStreak >= 20) unlock('streak_20');

            if (this.state.score >= 10) unlock('score_10');
            if (this.state.score >= 20) unlock('score_20');
            if (this.state.score >= 30) unlock('score_30');

            if (this.state.difficulty === 'hard') unlock('hard_mode');

            if (stats.totalCorrect >= 50) unlock('total_50');
            if (stats.totalCorrect >= 100) unlock('total_100');

            // Multi-wait master
            const multiWaitCorrect = (stats.waitCountStats[5]?.correct || 0);
            if (multiWaitCorrect >= 10) unlock('multi_wait_master');

            // Speed star (check at end of game usually, but here we check per question for simplicity or modify logic)
            // For speed star description says "average time within 2s and 10+ correct at end"
            // So we should check this at endGame, not here. But let's leave it for now or move it.
            // Let's move speed star check to endGame
        }

        // Show notifications for new unlocks
        if (newUnlocks.length > 0) {
            newUnlocks.forEach(ach => {
                this.showToast(ach);
            });
        }
    },

    showToast: function (achievement) {
        const container = document.getElementById('toast-container');
        if (!container) return;

        const toast = document.createElement('div');
        toast.className = `toast ${achievement.rank || 'bronze'}`;
        toast.innerHTML = `
            <div class="toast-icon">${achievement.icon}</div>
            <div class="toast-content">
                <div class="toast-title">実績解除: ${achievement.name}</div>
                <div class="toast-desc">${achievement.description}</div>
            </div>
        `;

        container.appendChild(toast);

        // Remove after animation
        setTimeout(() => {
            if (toast.parentNode) toast.parentNode.removeChild(toast);
        }, 3500);
    },

    showStats: function () {
        this.renderStatsUI();
        this.switchScreen('stats-screen');
    },

    renderStatsUI: function () {
        const stats = this.state.stats;

        // Basic stats
        document.getElementById('stat-total-games').textContent = stats.totalGames;

        const avgScore = stats.totalGames > 0 ? (stats.totalCorrect / stats.totalGames).toFixed(1) : '0.0';
        document.getElementById('stat-avg-score').textContent = avgScore;

        document.getElementById('stat-correct').textContent = stats.totalCorrect;
        document.getElementById('stat-total').textContent = stats.totalQuestions;

        const accuracy = stats.totalQuestions > 0 ? Math.round((stats.totalCorrect / stats.totalQuestions) * 100) : 0;
        document.getElementById('stat-accuracy').textContent = accuracy;

        document.getElementById('stat-max-streak').textContent = stats.maxStreak;

        const avgTime = stats.totalQuestions > 0 ? (stats.totalTime / stats.totalQuestions).toFixed(1) : '0.0';
        document.getElementById('stat-avg-time').textContent = avgTime;

        // Difficulty Stats
        const diffContainer = document.getElementById('diff-stats-container');
        if (diffContainer) {
            const diffLabels = { easy: '初級', normal: '中級', hard: '上級', random: 'ランダム' };
            let diffHtml = '<table class="diff-stats-table"><thead><tr><th>難易度</th><th>正解数</th><th>正解率</th></tr></thead><tbody>';

            ['easy', 'normal', 'hard', 'random'].forEach(diff => {
                const dStat = stats.difficultyStats[diff] || { correct: 0, total: 0 };
                const dAcc = dStat.total > 0 ? Math.round((dStat.correct / dStat.total) * 100) : 0;
                diffHtml += `<tr><td>${diffLabels[diff]}</td><td>${dStat.correct}/${dStat.total}</td><td>${dAcc}%</td></tr>`;
            });
            diffHtml += '</tbody></table>';
            diffContainer.innerHTML = diffHtml;
        }

        // Wait count stats
        const waitsContainer = document.getElementById('stats-waits-container');
        waitsContainer.innerHTML = '';

        const waitLabels = {
            1: '1面待ち',
            2: '2面待ち',
            3: '3面待ち',
            4: '4面待ち',
            5: '5面待ち以上'
        };

        [1, 2, 3, 4, 5].forEach(count => {
            const waitData = stats.waitCountStats[count] || { correct: 0, total: 0 };
            const percentage = waitData.total > 0 ? Math.round((waitData.correct / waitData.total) * 100) : 0;

            const item = document.createElement('div');
            item.className = 'wait-stat-item';

            item.innerHTML = `
                <div class="wait-stat-label">${waitLabels[count]}</div>
                <div class="wait-stat-bar-container">
                    <div class="wait-stat-bar" style="width: ${percentage}%">
                        ${percentage > 15 ? percentage + '%' : ''}
                    </div>
                </div>
                <div class="wait-stat-count">${waitData.correct}/${waitData.total}</div>
            `;

            waitsContainer.appendChild(item);
        });

        // Achievements
        const achList = document.getElementById('achievements-list');
        achList.innerHTML = '';

        const unlockedIds = stats.achievements || [];

        this.achievementsList.forEach(ach => {
            const isUnlocked = unlockedIds.includes(ach.id);
            const div = document.createElement('div');
            div.className = `achievement-item ${ach.rank} ${isUnlocked ? 'unlocked' : ''}`;

            div.innerHTML = `
                <div class="achievement-icon">${isUnlocked ? ach.icon : '🔒'}</div>
                <div class="achievement-info">
                    <div class="achievement-name">${ach.name}</div>
                    <div class="achievement-desc">${ach.description}</div>
                </div>
            `;
            achList.appendChild(div);
        });
    },

    resetStats: function () {
        if (confirm('統計データをすべてリセットしますか？\nこの操作は取り消せません。')) {
            this.initializeStats();
            this.saveStats();
            this.renderStatsUI();
            alert('統計データをリセットしました。');
        }
    },

    saveScore: function (score) {
        const now = new Date();
        const date = `${now.toLocaleDateString()} ${now.getHours()}:${String(now.getMinutes()).padStart(2, '0')}`;
        const diff = this.state.difficulty;

        // Get current ranking for this difficulty
        let currentRankList = this.state.ranking[diff] || [];

        // Check if it's a new record (strictly greater than previous best)
        const previousBest = currentRankList.length > 0 ? currentRankList[0].score : 0;
        const isNewRecord = score > previousBest;

        currentRankList.push({ score, date });
        currentRankList.sort((a, b) => b.score - a.score);
        currentRankList = currentRankList.slice(0, 5); // Keep top 5

        this.state.ranking[diff] = currentRankList;
        this.saveRanking();

        return isNewRecord;
    },

    showRanking: function () {
        // Default to current difficulty if set, otherwise normal
        this.state.currentRankingTab = this.state.difficulty || 'normal';
        this.renderRankingUI();
        this.switchScreen('ranking-screen');
    },

    switchRankingTab: function (tab) {
        this.state.currentRankingTab = tab;
        this.renderRankingUI();
    },

    renderRankingUI: function () {
        const tab = this.state.currentRankingTab;
        const list = document.getElementById('ranking-list');

        // Update tab active state
        document.querySelectorAll('.tab-btn').forEach(btn => {
            if (btn.dataset.tab === tab) {
                btn.classList.add('active');
            } else {
                btn.classList.remove('active');
            }
        });

        if (!list) return;

        list.innerHTML = '';
        const rankData = this.state.ranking[tab] || [];

        if (rankData.length === 0) {
            list.innerHTML = '<li style="padding: 10px; color: #aaa;">まだ記録はありません</li>';
            return;
        }

        rankData.forEach((item, index) => {
            const li = document.createElement('li');
            li.innerHTML = `<span style="font-weight:bold; color:${index === 0 ? '#ffd700' : index === 1 ? '#c0c0c0' : index === 2 ? '#cd7f32' : '#fff'}">${index + 1}位</span>: ${item.score}点 <span style="font-size:0.8em; color:#aaa; margin-left:10px;">(${item.date})</span>`;
            li.style.padding = '10px 0';
            li.style.borderBottom = '1px solid #333';
            list.appendChild(li);
        });
    },

    shareResult: function () {
        let text = '';
        if (this.state.gameMode === 'training') {
            text = `麻雀メンチン待ち当てクイズ【特訓モード】で練習中！ #メンチンクイズ`;
        } else {
            const diffLabel = {
                'easy': '初級',
                'normal': '中級',
                'hard': '上級',
                'random': 'ランダム'
            }[this.state.difficulty];
            text = `麻雀メンチン待ち当てクイズ【${diffLabel}】で${this.state.score}問正解しました！ #メンチンクイズ`;
        }
        const url = "https://twitter.com/intent/tweet?text=" + encodeURIComponent(text);
        window.open(url, '_blank');
    },

    shareStats: function () {
        const stats = this.state.stats;

        // Calculate basic stats
        const avgScore = stats.totalGames > 0 ? (stats.totalCorrect / stats.totalGames).toFixed(1) : '0.0';
        const accuracy = stats.totalQuestions > 0 ? Math.round((stats.totalCorrect / stats.totalQuestions) * 100) : 0;
        const unlockedCount = stats.achievements ? stats.achievements.length : 0;

        // Format wait count stats with visual bars
        const waitLabels = {
            1: '1面待ち',
            2: '2面待ち',
            3: '3面待ち',
            4: '4面待ち',
            5: '5面待ち以上'
        };

        let waitStatsText = '';
        [1, 2, 3, 4, 5].forEach(count => {
            const waitData = stats.waitCountStats[count] || { correct: 0, total: 0 };
            const percentage = waitData.total > 0 ? Math.round((waitData.correct / waitData.total) * 100) : 0;

            // Create visual bar using blocks (10% increments)
            const blocks = Math.round(percentage / 10);
            const bar = '█'.repeat(blocks) + '░'.repeat(10 - blocks);

            waitStatsText += `\n${waitLabels[count]}: ${bar} ${percentage}%`;
        });

        const text = `📊 メンチンクイズ統計\n\n` +
            `🎮 総プレイ回数: ${stats.totalGames}回\n` +
            `⭐ 平均スコア: ${avgScore}点\n` +
            `✅ 正解率: ${accuracy}% (${stats.totalCorrect}/${stats.totalQuestions})\n` +
            `🏆 実績解除: ${unlockedCount}/${this.achievementsList.length}\n` +
            `\n【待ちの数別正解率】${waitStatsText}\n\n` +
            `#メンチンクイズ`;

        const url = "https://twitter.com/intent/tweet?text=" + encodeURIComponent(text);
        window.open(url, '_blank');
    },

    returnToTitle: function () {
        this.switchScreen('start-screen');
    },

    startGame: function (difficulty = 'normal') {
        this.state.score = 0;
        this.state.timeLeft = 60;
        this.state.isPlaying = true;
        this.state.difficulty = difficulty;
        this.state.gameMode = 'challenge';

        this.updateUI();
        this.switchScreen('game-screen');

        this.nextHand();

        if (this.state.timerInterval) clearInterval(this.state.timerInterval);
        this.state.timerInterval = setInterval(() => this.tick(), 1000);
    },

    startTraining: function () {
        this.state.score = 0;
        this.state.timeLeft = 999; // Unlimited time effectively
        this.state.isPlaying = true;
        this.state.gameMode = 'training';
        // difficulty is ignored in training, uses trainingWaitCount

        this.updateUI();
        document.getElementById('time-left').textContent = "∞";
        this.switchScreen('game-screen');

        // Show quit button
        if (this.elements.quitTrainingBtn) {
            this.elements.quitTrainingBtn.classList.remove('hidden');
        }

        this.nextHand();

        if (this.state.timerInterval) clearInterval(this.state.timerInterval);
        // No timer tick for training
    },

    quitTraining: function () {
        this.state.isPlaying = false;
        if (this.state.timerInterval) clearInterval(this.state.timerInterval);
        this.returnToTitle();
    },

    tick: function () {
        if (this.state.gameMode === 'training') return;

        this.state.timeLeft--;
        this.elements.timeLeft.textContent = this.state.timeLeft;

        if (this.state.timeLeft <= 0) {
            this.endGame();
        }
    },

    endGame: function () {
        this.state.isPlaying = false;
        if (this.state.timerInterval) clearInterval(this.state.timerInterval);
        this.elements.finalScore.textContent = this.state.score;

        // Check speed star achievement
        if (this.state.gameMode !== 'training' && this.state.score >= 10) {
            const avgTime = this.state.stats.totalQuestions > 0 ? (this.state.stats.totalTime / this.state.stats.totalQuestions) : 999;
            if (avgTime <= 2.0) {
                // Manually trigger unlock since checkAchievements is usually called per question
                const stats = this.state.stats;
                if (!stats.achievements.includes('speed_star')) {
                    stats.achievements.push('speed_star');
                    this.showToast(this.achievementsList.find(a => a.id === 'speed_star'));
                    this.saveStats();
                }
            }
        }

        // Skip stats and ranking for training mode
        if (this.state.gameMode === 'training') {
            this.switchScreen('result-screen');
            return;
        }

        // Update game count
        this.state.stats.totalGames++;
        this.saveStats();

        const isNewRecord = this.saveScore(this.state.score);
        if (isNewRecord && this.elements.newRecordMsg) {
            this.elements.newRecordMsg.classList.remove('hidden');
        } else if (this.elements.newRecordMsg) {
            this.elements.newRecordMsg.classList.add('hidden');
        }

        this.switchScreen('result-screen');
    },

    nextHand: function () {
        if (!this.state.isPlaying) return;

        // Reset selection
        this.state.selectedWaits.clear();
        this.updateSelectionUI();
        this.elements.feedback.classList.add('hidden');
        this.questionStartTime = Date.now();

        // Generate new hand
        // Generate new hand based on difficulty or training settings
        let options = {};

        if (this.state.gameMode === 'training') {
            if (this.state.trainingWaitCount > 0) {
                if (this.state.trainingWaitCount === 5) {
                    options.minWaits = 5;
                } else {
                    options.exactWaits = this.state.trainingWaitCount;
                }
            }
        } else {
            // Challenge mode difficulty
            switch (this.state.difficulty) {
                case 'easy':
                    options.maxWaits = 2;
                    break;
                case 'normal':
                    options.minWaits = 3;
                    options.maxWaits = 4;
                    break;
                case 'hard':
                    options.minWaits = 5;
                    break;
                case 'random':
                    // No restrictions
                    break;
            }
        }

        this.state.currentHand = Mahjong.generateChinitsuHand(options);
        this.state.currentWaits = Mahjong.getWaits(this.state.currentHand);

        this.renderHand();
    },

    renderHand: function () {
        this.elements.handContainer.innerHTML = '';
        // Sort hand for display
        const sortedHand = [...this.state.currentHand].sort((a, b) => a - b);

        sortedHand.forEach(tile => {
            const img = document.createElement('img');
            img.src = `img/man${tile}.png`; // Assuming images are named man1.png, etc.
            img.alt = `${tile}万`;
            img.className = 'tile';
            this.elements.handContainer.appendChild(img);
        });
    },

    toggleWait: function (btn) {
        if (!this.state.isPlaying) return;

        const value = parseInt(btn.dataset.value);
        if (this.state.selectedWaits.has(value)) {
            this.state.selectedWaits.delete(value);
        } else {
            this.state.selectedWaits.add(value);
        }
        this.updateSelectionUI();
    },

    updateSelectionUI: function () {
        this.elements.numBtns.forEach(btn => {
            const value = parseInt(btn.dataset.value);
            if (this.state.selectedWaits.has(value)) {
                btn.classList.add('selected');
            } else {
                btn.classList.remove('selected');
            }
        });
    },

    submitAnswer: function () {
        if (!this.state.isPlaying) return;

        // Check answer
        const correctWaits = this.state.currentWaits;
        const selectedWaits = Array.from(this.state.selectedWaits).sort((a, b) => a - b);

        const isCorrect = JSON.stringify(correctWaits) === JSON.stringify(selectedWaits);
        const timeSpent = (Date.now() - this.questionStartTime) / 1000;

        if (isCorrect) {
            this.state.score++;
            this.elements.feedback.textContent = "正解！";
            this.elements.feedback.className = "feedback correct";

            // Update stats only if not training
            if (this.state.gameMode !== 'training') {
                this.updateStats(true, correctWaits, timeSpent);
            }

            setTimeout(() => this.nextHand(), 500);
        } else {
            this.elements.feedback.textContent = `不正解... 正解は ${correctWaits.join(', ')}`;
            this.elements.feedback.className = "feedback incorrect";

            // Update stats only if not training
            if (this.state.gameMode !== 'training') {
                this.updateStats(false, correctWaits, timeSpent);
            }

            // Penalty? Or just next hand? Let's wait a bit longer for user to see answer
            setTimeout(() => this.nextHand(), 2000);
        }

        this.elements.feedback.classList.remove('hidden');
        this.updateUI();
    },

    updateUI: function () {
        this.elements.currentScore.textContent = this.state.score;

        // Hide quit training button if not in training
        if (this.state.gameMode !== 'training' && this.elements.quitTrainingBtn) {
            this.elements.quitTrainingBtn.classList.add('hidden');
        }
    },

    switchScreen: function (screenId) {
        document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
        document.getElementById(screenId).classList.add('active');
    }
};

// Initialize game when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    Game.init();
});
