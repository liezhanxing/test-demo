/**
 * 快乐五子棋 - 游戏逻辑
 * 适合小朋友的双人对战五子棋游戏
 */

class GomokuGame {
    constructor() {
        this.size = 15;
        this.board = [];
        this.currentPlayer = 'X'; // X 黑棋先手，O 白棋后手
        this.gameOver = false;
        this.winner = null;
        this.winLine = null;
        this.moveHistory = [];
        this.soundEnabled = true;

        this.initBoard();
        this.bindEvents();
        this.updateUI();
    }

    // 初始化棋盘数据
    initBoard() {
        this.board = [];
        for (let i = 0; i < this.size; i++) {
            this.board[i] = [];
            for (let j = 0; j < this.size; j++) {
                this.board[i][j] = null;
            }
        }
    }

    // 绑定事件
    bindEvents() {
        const boardEl = document.getElementById('board');
        boardEl.addEventListener('click', (e) => this.handleBoardClick(e));

        document.getElementById('restartBtn').addEventListener('click', () => this.restart());
        document.getElementById('undoBtn').addEventListener('click', () => this.undo());
        document.getElementById('soundBtn').addEventListener('click', () => this.toggleSound());
    }

    // 渲染棋盘
    renderBoard() {
        const boardEl = document.getElementById('board');
        boardEl.innerHTML = '';

        for (let i = 0; i < this.size; i++) {
            for (let j = 0; j < this.size; j++) {
                const cell = document.createElement('div');
                cell.className = 'cell';
                cell.dataset.row = i;
                cell.dataset.col = j;

                if (this.board[i][j]) {
                    cell.classList.add('locked');
                    const stone = document.createElement('div');
                    stone.className = `stone ${this.board[i][j] === 'X' ? 'black' : 'white'}`;
                    cell.appendChild(stone);
                }

                boardEl.appendChild(cell);
            }
        }
    }

    // 处理棋盘点击
    handleBoardClick(e) {
        const cell = e.target.closest('.cell');
        if (!cell) return;

        const row = parseInt(cell.dataset.row);
        const col = parseInt(cell.dataset.col);

        if (this.gameOver) {
            this.showMessage('游戏已结束，点击"重新开始"再来一局吧！', '🎮');
            this.playSound('invalid');
            return;
        }

        if (this.board[row][col] !== null) {
            this.showMessage('这里已经有棋子啦，换个位置吧！', '🤔');
            this.playSound('invalid');
            return;
        }

        // 落子
        this.placeStone(row, col);
    }

    // 落子
    placeStone(row, col) {
        this.board[row][col] = this.currentPlayer;
        this.moveHistory.push({ row, col, player: this.currentPlayer });

        // 重新渲染棋盘以显示新棋子
        this.renderBoard();
        this.playSound('place');

        // 检查获胜
        const winInfo = this.checkWin(row, col);
        if (winInfo) {
            this.gameOver = true;
            this.winner = this.currentPlayer;
            this.winLine = winInfo;
            this.highlightWin(winInfo);
            this.updateUI();
            this.showMessage(
                `🎉 ${this.currentPlayer === 'X' ? '黑棋' : '白棋'} 获胜啦！太棒了！ 🎉`,
                '🏆'
            );
            this.playSound('win');
            this.createConfetti();
            return;
        }

        // 检查平局
        if (this.isDraw()) {
            this.gameOver = true;
            this.showMessage('平局啦！你们势均力敌呢！', '🤝');
            this.playSound('invalid');
            return;
        }

        // 切换玩家
        this.switchPlayer();
        this.updateUI();
        this.showMessage(
            `${this.currentPlayer === 'X' ? '黑棋' : '白棋'} 的回合，请落子！`,
            '✨'
        );
    }

    // 切换玩家
    switchPlayer() {
        this.currentPlayer = this.currentPlayer === 'X' ? 'O' : 'X';
    }

    // 检查是否平局
    isDraw() {
        for (let i = 0; i < this.size; i++) {
            for (let j = 0; j < this.size; j++) {
                if (this.board[i][j] === null) {
                    return false;
                }
            }
        }
        return true;
    }

    // 检查获胜
    checkWin(row, col) {
        const player = this.board[row][col];
        const directions = [
            { dr: 0, dc: 1 },   // 水平
            { dr: 1, dc: 0 },   // 垂直
            { dr: 1, dc: 1 },   // 右下斜线
            { dr: 1, dc: -1 }   // 左下斜线
        ];

        for (const { dr, dc } of directions) {
            const line = [{ row, col }];
            let count = 1;

            // 正方向
            let r = row + dr, c = col + dc;
            while (r >= 0 && r < this.size && c >= 0 && c < this.size && this.board[r][c] === player) {
                line.push({ row: r, col: c });
                count++;
                r += dr;
                c += dc;
            }

            // 反方向
            r = row - dr;
            c = col - dc;
            while (r >= 0 && r < this.size && c >= 0 && c < this.size && this.board[r][c] === player) {
                line.push({ row: r, col: c });
                count++;
                r -= dr;
                c -= dc;
            }

            if (count >= 5) {
                return line;
            }
        }
        return null;
    }

    // 高亮获胜棋子
    highlightWin(line) {
        const cells = document.querySelectorAll('.cell');
        cells.forEach(cell => {
            const row = parseInt(cell.dataset.row);
            const col = parseInt(cell.dataset.col);
            for (const pos of line) {
                if (pos.row === row && pos.col === col) {
                    cell.classList.add('winner');
                    break;
                }
            }
        });
    }

    // 更新 UI
    updateUI() {
        const playerXCard = document.querySelector('.player-x');
        const playerOCard = document.querySelector('.player-o');

        if (this.currentPlayer === 'X') {
            playerXCard.classList.add('active');
            playerOCard.classList.remove('active');
        } else {
            playerXCard.classList.remove('active');
            playerOCard.classList.add('active');
        }

        // 更新按钮状态
        const undoBtn = document.getElementById('undoBtn');
        undoBtn.disabled = this.moveHistory.length === 0 || this.gameOver;
        undoBtn.style.opacity = (this.moveHistory.length === 0 || this.gameOver) ? '0.5' : '1';
    }

    // 显示消息
    showMessage(text, icon = '📢') {
        const messageText = document.getElementById('messageText');
        const messageIcon = document.querySelector('.message-icon');
        messageText.textContent = text;
        messageIcon.textContent = icon;

        // 添加动画效果
        const messageBox = document.getElementById('messageBox');
        messageBox.style.animation = 'none';
        messageBox.offsetHeight; // 触发重绘
        messageBox.style.animation = 'bounce 0.5s ease';
    }

    // 重新开始
    restart() {
        this.initBoard();
        this.currentPlayer = 'X';
        this.gameOver = false;
        this.winner = null;
        this.winLine = null;
        this.moveHistory = [];
        this.renderBoard();
        this.updateUI();
        this.showMessage('新游戏开始！黑棋先手，请落子！', '🎮');
        this.playSound('place');
    }

    // 悔棋
    undo() {
        if (this.moveHistory.length === 0 || this.gameOver) {
            this.showMessage('无法悔棋哦！', '🤔');
            this.playSound('invalid');
            return;
        }

        const lastMove = this.moveHistory.pop();
        this.board[lastMove.row][lastMove.col] = null;
        this.switchPlayer();
        this.renderBoard();
        this.updateUI();
        this.showMessage(
            '已撤销上一步，轮到 ' + (this.currentPlayer === 'X' ? '黑棋' : '白棋') + ' 啦！',
            '↩️'
        );
        this.playSound('place');
    }

    // 切换音效
    toggleSound() {
        this.soundEnabled = !this.soundEnabled;
        const soundBtn = document.getElementById('soundBtn');
        const soundStatus = document.getElementById('soundStatus');
        const soundIcon = soundBtn.querySelector('.btn-icon');

        if (this.soundEnabled) {
            soundStatus.textContent = '开';
            soundIcon.textContent = '🔊';
            soundBtn.classList.remove('muted');
            this.showMessage('音效已打开', '🔊');
        } else {
            soundStatus.textContent = '关';
            soundIcon.textContent = '🔇';
            soundBtn.classList.add('muted');
            this.showMessage('音效已关闭', '🔇');
        }
    }

    // 播放音效（使用 Web Audio API 合成）
    playSound(type) {
        if (!this.soundEnabled) return;

        const AudioContext = window.AudioContext || window.webkitAudioContext;
        if (!AudioContext) return;

        const ctx = new AudioContext();
        const oscillator = ctx.createOscillator();
        const gainNode = ctx.createGain();

        oscillator.connect(gainNode);
        gainNode.connect(ctx.destination);

        switch (type) {
            case 'place':
                // 落子声：短促的高频音
                oscillator.frequency.setValueAtTime(800, ctx.currentTime);
                oscillator.frequency.exponentialRampToValueAtTime(400, ctx.currentTime + 0.1);
                gainNode.gain.setValueAtTime(0.3, ctx.currentTime);
                gainNode.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.1);
                oscillator.start(ctx.currentTime);
                oscillator.stop(ctx.currentTime + 0.1);
                break;

            case 'win':
                // 获胜音效：欢快的上行音阶
                const winFreqs = [523, 659, 784, 1047];
                winFreqs.forEach((freq, i) => {
                    const osc = ctx.createOscillator();
                    const gain = ctx.createGain();
                    osc.connect(gain);
                    gain.connect(ctx.destination);
                    osc.type = 'square';
                    osc.frequency.setValueAtTime(freq, ctx.currentTime + i * 0.15);
                    gain.gain.setValueAtTime(0.2, ctx.currentTime + i * 0.15);
                    gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + i * 0.15 + 0.3);
                    osc.start(ctx.currentTime + i * 0.15);
                    osc.stop(ctx.currentTime + i * 0.15 + 0.3);
                });
                return;

            case 'invalid':
                // 无效操作：低音提示
                oscillator.type = 'sawtooth';
                oscillator.frequency.setValueAtTime(200, ctx.currentTime);
                oscillator.frequency.linearRampToValueAtTime(150, ctx.currentTime + 0.2);
                gainNode.gain.setValueAtTime(0.2, ctx.currentTime);
                gainNode.gain.linearRampToValueAtTime(0.01, ctx.currentTime + 0.2);
                oscillator.start(ctx.currentTime);
                oscillator.stop(ctx.currentTime + 0.2);
                break;
        }
    }

    // 创建庆祝纸屑
    createConfetti() {
        const colors = ['#FF6B6B', '#FFE66D', '#4ECDC4', '#FF8C8C', '#A8E6CF', '#FFD5A4'];

        for (let i = 0; i < 50; i++) {
            setTimeout(() => {
                const confetti = document.createElement('div');
                confetti.className = 'confetti';
                confetti.style.left = Math.random() * 100 + 'vw';
                confetti.style.background = colors[Math.floor(Math.random() * colors.length)];
                confetti.style.animationDuration = (Math.random() * 2 + 2) + 's';
                confetti.style.transform = `rotate(${Math.random() * 360}deg)`;
                document.body.appendChild(confetti);

                // 清理
                setTimeout(() => confetti.remove(), 4000);
            }, i * 50);
        }
    }
}

// 页面加载完成后初始化游戏
document.addEventListener('DOMContentLoaded', () => {
    const game = new GomokuGame();
    game.showMessage('黑棋先手，请落子！', '✨');
});
