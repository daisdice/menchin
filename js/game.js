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
        ranking: [],
        difficulty: 'normal', // easy, normal, hard
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
            achievements: [] // Array of unlocked achievement IDs
        },
        questionStartTime: null
    },

    achievementsList: [
        { id: 'beginner', name: 'メンチン初心者', description: '初めてクイズに正解する', icon: '🔰' },
        { id: 'streak_10', name: '集中力', description: '10問連続正解する', icon: '🔥' },
        { id: 'score_20', name: 'メンチン初段', description: '1プレイで20点以上獲得する', icon: '🥋' },
        { id: 'hard_mode', name: '上級者への道', description: '上級モードでプレイする', icon: '🏔️' },
        { id: 'multi_wait_master', name: '多面張マスター', description: '5面待ち以上を累計10回正解する', icon: '👑' },
        { id: 'speed_star', name: 'スピードスター', description: '平均回答時間3秒以内で10問以上正解して終了', icon: '⚡' }
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
        statsResetBtn: document.getElementById('stats-reset-btn')
    },

    init: function () {
        this.loadRanking();
        this.loadStats();
        this.updateRankingUI();

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

        // Training wait selection
        document.querySelectorAll('.training-wait-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                document.querySelectorAll('.training-wait-btn').forEach(b => b.classList.remove('selected'));
                e.target.classList.add('selected');
                this.state.trainingWaitCount = parseInt(e.target.dataset.wait);
                document.getElementById('start-training-btn').disabled = false;
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
                this.state.ranking = JSON.parse(stored);
            } catch (e) {
                console.error("Failed to parse ranking", e);
                this.state.ranking = [];
            }
        }
    },

    loadStats: function () {
        const stored = localStorage.getItem('menchin_stats');
        if (stored) {
            try {
                const loadedStats = JSON.parse(stored);
                // Migrate old stats if needed
                if (loadedStats.waitStats && !loadedStats.waitCountStats) {
                    this.initializeStats();
                } else {
                    this.state.stats = loadedStats;
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
            }
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

            if (stats.currentStreak >= 10) unlock('streak_10');

            if (this.state.score >= 20) unlock('score_20');

            if (this.state.difficulty === 'hard') unlock('hard_mode');

            // Multi-wait master
            const multiWaitCorrect = (stats.waitCountStats[5]?.correct || 0);
            if (multiWaitCorrect >= 10) unlock('multi_wait_master');
        }

        // Show notifications for new unlocks
        if (newUnlocks.length > 0) {
            newUnlocks.forEach(ach => {
                alert(`🏆 実績解除: ${ach.icon} ${ach.name}\n${ach.description}`);
            });
        }
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
            div.style.padding = '10px';
            div.style.marginBottom = '5px';
            div.style.borderRadius = '8px';
            div.style.background = isUnlocked ? 'rgba(255, 215, 0, 0.1)' : 'rgba(255, 255, 255, 0.05)';
            div.style.border = isUnlocked ? '1px solid #ffd700' : '1px solid #555';
            div.style.opacity = isUnlocked ? '1' : '0.5';

            div.innerHTML = `
                <div style="font-weight: bold; color: ${isUnlocked ? '#ffd700' : '#aaa'}">
                    ${isUnlocked ? ach.icon : '🔒'} ${ach.name}
                </div>
                <div style="font-size: 0.8rem; color: #ccc;">${ach.description}</div>
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

        // Check if it's a new record (strictly greater than previous best)
        const previousBest = this.state.ranking.length > 0 ? this.state.ranking[0].score : 0;
        const isNewRecord = score > previousBest;

        this.state.ranking.push({ score, date });
        this.state.ranking.sort((a, b) => b.score - a.score);
        this.state.ranking = this.state.ranking.slice(0, 5); // Keep top 5
        localStorage.setItem('menchin_ranking', JSON.stringify(this.state.ranking));
        this.updateRankingUI();

        return isNewRecord;
    },

    updateRankingUI: function () {
        const list = this.elements.rankingList;
        if (!list) return;

        list.innerHTML = '';
        if (this.state.ranking.length === 0) {
            list.innerHTML = '<li>まだ記録はありません</li>';
            return;
        }

        this.state.ranking.forEach((item, index) => {
            const li = document.createElement('li');
            li.textContent = `${index + 1}位: ${item.score}点 (${item.date})`;
            li.style.padding = '5px 0';
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
                'hard': '上級'
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

        this.nextHand();

        if (this.state.timerInterval) clearInterval(this.state.timerInterval);
        // No timer tick for training or maybe just count up? Let's keep it simple for now
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
            }
        }

        this.state.currentHand = Mahjong.generateChinitsuHand(options);
        this.state.currentWaits = Mahjong.getWaits(this.state.currentHand);

        // Record question start time
        this.state.questionStartTime = Date.now();

        // Render hand
        this.renderHand();
    },

    renderHand: function () {
        const container = this.elements.handContainer;
        container.innerHTML = '';

        this.state.currentHand.forEach(tileVal => {
            const tile = document.createElement('div');
            tile.className = 'tile';
            tile.dataset.value = tileVal;
            // Simple visual representation for now
            // We can replace this with SVG or images later
            tile.textContent = tileVal;
            container.appendChild(tile);
        });
    },

    toggleWait: function (btn) {
        const val = parseInt(btn.dataset.value);
        if (this.state.selectedWaits.has(val)) {
            this.state.selectedWaits.delete(val);
        } else {
            this.state.selectedWaits.add(val);
        }
        this.updateSelectionUI();
    },

    updateSelectionUI: function () {
        this.elements.numBtns.forEach(btn => {
            const val = parseInt(btn.dataset.value);
            if (this.state.selectedWaits.has(val)) {
                btn.classList.add('selected');
            } else {
                btn.classList.remove('selected');
            }
        });
    },

    submitAnswer: function () {
        if (!this.state.isPlaying) return;

        // Calculate time spent
        const timeSpent = (Date.now() - this.state.questionStartTime) / 1000;

        const selected = Array.from(this.state.selectedWaits).sort((a, b) => a - b);
        const correct = this.state.currentWaits.sort((a, b) => a - b);

        const isCorrect = JSON.stringify(selected) === JSON.stringify(correct);

        // Update statistics
        this.updateStats(isCorrect, correct, timeSpent);

        if (isCorrect) {
            this.state.score++;
            this.elements.currentScore.textContent = this.state.score;
            this.showFeedback(true, '正解！');
            setTimeout(() => this.nextHand(), 500);
        } else {
            this.showFeedback(false, `不正解... 正解は: ${correct.join(', ')}`);
            // Penalty? Or just move on? Let's wait a bit longer so they can see the answer
            setTimeout(() => this.nextHand(), 2000);
        }
    },

    showFeedback: function (isSuccess, message) {
        const fb = this.elements.feedback;
        fb.textContent = message;
        fb.className = `feedback ${isSuccess ? 'success' : 'error'}`;
        fb.classList.remove('hidden');
    },

    switchScreen: function (screenId) {
        document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
        document.getElementById(screenId).classList.add('active');
    },

    updateUI: function () {
        this.elements.currentScore.textContent = this.state.score;
        this.elements.timeLeft.textContent = this.state.timeLeft;
    }
};

// Initialize game when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    Game.init();
});
