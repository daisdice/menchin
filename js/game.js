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
        ranking: []
    },

    elements: {
        startScreen: document.getElementById('start-screen'),
        gameScreen: document.getElementById('game-screen'),
        resultScreen: document.getElementById('result-screen'),
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
        titleBtn: document.getElementById('title-btn')
    },

    init: function () {
        this.loadRanking();
        this.updateRankingUI();

        this.elements.startBtn.addEventListener('click', () => this.startGame());
        this.elements.restartBtn.addEventListener('click', () => this.startGame());

        if (this.elements.titleBtn) {
            this.elements.titleBtn.addEventListener('click', () => this.returnToTitle());
        }

        this.elements.numBtns.forEach(btn => {
            btn.addEventListener('click', (e) => this.toggleWait(e.target));
        });

        this.elements.submitBtn.addEventListener('click', () => this.submitAnswer());

        const shareBtn = document.getElementById('share-btn');
        if (shareBtn) {
            shareBtn.addEventListener('click', () => this.shareResult());
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
        const text = `麻雀メンチン待ち当てクイズで${this.state.score}問正解しました！ #メンチンクイズ`;
        const url = "https://twitter.com/intent/tweet?text=" + encodeURIComponent(text);
        window.open(url, '_blank');
    },

    returnToTitle: function () {
        this.switchScreen('start-screen');
    },

    startGame: function () {
        this.state.score = 0;
        this.state.timeLeft = 60;
        this.state.isPlaying = true;

        this.updateUI();
        this.switchScreen('game-screen');

        this.nextHand();

        if (this.state.timerInterval) clearInterval(this.state.timerInterval);
        this.state.timerInterval = setInterval(() => this.tick(), 1000);
    },

    tick: function () {
        this.state.timeLeft--;
        this.elements.timeLeft.textContent = this.state.timeLeft;

        if (this.state.timeLeft <= 0) {
            this.endGame();
        }
    },

    endGame: function () {
        this.state.isPlaying = false;
        clearInterval(this.state.timerInterval);
        this.elements.finalScore.textContent = this.state.score;

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
        this.state.currentHand = Mahjong.generateChinitsuHand();
        this.state.currentWaits = Mahjong.getWaits(this.state.currentHand);

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

        const selected = Array.from(this.state.selectedWaits).sort((a, b) => a - b);
        const correct = this.state.currentWaits.sort((a, b) => a - b);

        const isCorrect = JSON.stringify(selected) === JSON.stringify(correct);

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
