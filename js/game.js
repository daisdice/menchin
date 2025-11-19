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
        timerInterval: null
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
        feedback: document.getElementById('feedback')
    },

    init: function () {
        this.elements.startBtn.addEventListener('click', () => this.startGame());
        this.elements.restartBtn.addEventListener('click', () => this.startGame());

        this.elements.numBtns.forEach(btn => {
            btn.addEventListener('click', (e) => this.toggleWait(e.target));
        });

        this.elements.submitBtn.addEventListener('click', () => this.submitAnswer());

        const shareBtn = document.getElementById('share-btn');
        if (shareBtn) {
            shareBtn.addEventListener('click', () => this.shareResult());
        }
    },

    shareResult: function () {
        const text = `麻雀メンチン待ち当てクイズで${this.state.score}問正解しました！ #メンチンクイズ`;
        const url = "https://twitter.com/intent/tweet?text=" + encodeURIComponent(text);
        window.open(url, '_blank');
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
