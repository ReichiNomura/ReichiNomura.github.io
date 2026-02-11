class OthelloGame {
    constructor() {
        this.board = [];
        this.turn = 'black'; // 'black' (黒) または 'white' (白)
        this.mode = 'human-vs-cpu'; // 'human-vs-cpu' (対CPU) または 'cpu-vs-cpu' (CPU同士)
        this.playerColor = 'black'; // 'black' または 'white' (人間の色)
        this.isGameOver = false; // ゲーム終了フラグ
        this.cpu = new CPU();

        // DOM要素
        this.boardElement = document.getElementById('board');
        this.scoreBlackElement = document.getElementById('score-black');
        this.scoreWhiteElement = document.getElementById('score-white');
        this.currentTurnElement = document.getElementById('current-turn');
        this.messageArea = document.getElementById('message-area');
        this.startButton = document.getElementById('start-btn');
        this.modeSelect = document.getElementById('mode-select');
        this.turnSelect = document.getElementById('turn-select');
        this.turnSelectGroup = document.getElementById('turn-select-group');

        this.initializeEventListeners();
    }

    initializeEventListeners() {
        this.startButton.addEventListener('click', () => this.startGame());
        this.modeSelect.addEventListener('change', (e) => this.handleModeChange(e));
        // セルクリックイベントはボードへの委譲で処理
        this.boardElement.addEventListener('click', (e) => this.handleBoardClick(e));
    }

    handleModeChange(e) {
        if (e.target.value === 'cpu-vs-cpu') {
            this.turnSelectGroup.style.display = 'none';
        } else {
            this.turnSelectGroup.style.display = 'flex';
        }
    }

    startGame() {
        this.mode = this.modeSelect.value;
        this.playerColor = this.turnSelect.value;
        this.turn = 'black';
        this.isGameOver = false;
        this.initBoard();
        this.updateUI();
        this.messageArea.textContent = '';

        if (this.mode === 'human-vs-cpu' && this.playerColor === 'white') {
            // CPUが先攻 (黒)
            setTimeout(() => this.cpuMove(), 500);
        } else if (this.mode === 'cpu-vs-cpu') {
            setTimeout(() => this.cpuMove(), 500);
        }
    }

    initBoard() {
        // 8x8の盤面を初期化 (nullで埋める)
        this.board = Array(8).fill(null).map(() => Array(8).fill(null));

        // 初期配置
        this.board[3][3] = 'white';
        this.board[3][4] = 'black';
        this.board[4][3] = 'black';
        this.board[4][4] = 'white';

        this.renderBoard();
    }

    renderBoard() {
        this.boardElement.innerHTML = '';
        const validMoves = this.getValidMoves(this.turn);

        for (let r = 0; r < 8; r++) {
            for (let c = 0; c < 8; c++) {
                const cell = document.createElement('div');
                cell.classList.add('cell');
                cell.dataset.row = r;
                cell.dataset.col = c;

                if (this.board[r][c]) {
                    const piece = document.createElement('div');
                    piece.classList.add('game-piece', this.board[r][c]);
                    cell.appendChild(piece);
                } else if (this.isValidMove(r, c, this.turn)) {
                    // 人間のターンの場合のみ有効手を表示
                    if (this.isHumanTurn()) {
                        cell.classList.add('valid-move');
                    }
                }

                this.boardElement.appendChild(cell);
            }
        }
        this.updateScore();
    }

    handleBoardClick(e) {
        // クリックされたセル要素を取得
        const cell = e.target.closest('.cell');
        if (!cell || this.isGameOver || !this.isHumanTurn()) return;

        const row = parseInt(cell.dataset.row);
        const col = parseInt(cell.dataset.col);

        if (this.isValidMove(row, col, this.turn)) {
            this.placePiece(row, col, this.turn);
            this.switchTurn();
        }
    }

    isHumanTurn() {
        if (this.mode === 'cpu-vs-cpu') return false;
        return this.turn === this.playerColor;
    }

    // ロジック関数
    isValidMove(row, col, color, board = this.board) {
        if (board[row][col] !== null) return false;

        const opponent = color === 'black' ? 'white' : 'black';
        const directions = [
            [-1, -1], [-1, 0], [-1, 1],
            [0, -1], [0, 1],
            [1, -1], [1, 0], [1, 1]
        ];

        for (const [dr, dc] of directions) {
            let r = row + dr;
            let c = col + dc;
            let foundOpponent = false;

            while (r >= 0 && r < 8 && c >= 0 && c < 8) {
                if (board[r][c] === opponent) {
                    foundOpponent = true;
                    r += dr;
                    c += dc;
                } else if (board[r][c] === color) {
                    if (foundOpponent) return true;
                    break;
                } else {
                    break;
                }
            }
        }
        return false;
    }

    getValidMoves(color, board = this.board) {
        const moves = [];
        for (let r = 0; r < 8; r++) {
            for (let c = 0; c < 8; c++) {
                if (this.isValidMove(r, c, color, board)) {
                    moves.push({ r, c });
                }
            }
        }
        return moves;
    }

    placePiece(row, col, color) {
        this.board[row][col] = color;
        this.flipPieces(row, col, color);
        // 効果音やアニメーションのトリガーはここに追加可能
    }

    flipPieces(row, col, color) {
        const opponent = color === 'black' ? 'white' : 'black';
        const directions = [
            [-1, -1], [-1, 0], [-1, 1],
            [0, -1], [0, 1],
            [1, -1], [1, 0], [1, 1]
        ];

        for (const [dr, dc] of directions) {
            let r = row + dr;
            let c = col + dc;
            const piecesToFlip = [];

            while (r >= 0 && r < 8 && c >= 0 && c < 8) {
                if (this.board[r][c] === opponent) {
                    piecesToFlip.push({ r, c });
                    r += dr;
                    c += dc;
                } else if (this.board[r][c] === color) {
                    if (piecesToFlip.length > 0) {
                        piecesToFlip.forEach(p => {
                            this.board[p.r][p.c] = color;
                        });
                    }
                    break;
                } else {
                    break;
                }
            }
        }
    }

    async switchTurn() {
        this.updateScore();

        let nextTurn = this.turn === 'black' ? 'white' : 'black';
        const validMovesNext = this.getValidMoves(nextTurn);

        if (validMovesNext.length === 0) {
            // パスロジック
            const validMovesCurrent = this.getValidMoves(this.turn);
            if (validMovesCurrent.length === 0) {
                this.endGame();
                return;
            } else {
                this.messageArea.textContent = `${nextTurn === 'black' ? '黒' : '白'} スキップ (置ける場所がありません)`;

                // ユーザーに「スキップ」メッセージを見せるために少し待つ
                await new Promise(resolve => setTimeout(resolve, 1500));
                this.messageArea.textContent = '';

                // ターンを維持したプレイヤーがCPUの場合、再度移動をトリガー
                if (!this.isHumanTurn()) {
                    setTimeout(() => this.cpuMove(), 500);
                }
                return;
            }
        }

        this.turn = nextTurn;
        this.updateUI();

        if (!this.isHumanTurn()) {
            setTimeout(() => this.cpuMove(), 600);
        }
    }

    endGame() {
        this.isGameOver = true;
        this.updateScore(); // 最終スコアを確認
        let blackScore = parseInt(this.scoreBlackElement.textContent);
        let whiteScore = parseInt(this.scoreWhiteElement.textContent);

        let message = "ゲーム終了! ";
        if (blackScore > whiteScore) {
            message += "黒の勝ち!";
        } else if (whiteScore > blackScore) {
            message += "白の勝ち!";
        } else {
            message += "引き分け";
        }
        this.messageArea.textContent = message;
        alert(message);
    }

    cpuMove() {
        if (this.isGameOver) return;

        // 盤面のコピーを作成してCPUに渡す
        // this.boardは文字列の2次元配列なので、単純なコピーで十分注意する
        const boardClone = this.board.map(row => [...row]);
        const move = this.cpu.decideMove(boardClone, this.turn, this);

        if (move) {
            this.placePiece(move.r, move.c, this.turn);
            this.switchTurn();
        } else {
            // switchTurnロジックが正しければここは通らないはずだが、念のため
            console.error("CPUは動けませんが、手番が回ってきました");
            this.switchTurn(); // パス扱い
        }
    }

    updateUI() {
        this.currentTurnElement.textContent = this.turn === 'black' ? "黒" : "白";
        this.renderBoard();
    }

    updateScore() {
        let black = 0;
        let white = 0;
        for (let r = 0; r < 8; r++) {
            for (let c = 0; c < 8; c++) {
                if (this.board[r][c] === 'black') black++;
                if (this.board[r][c] === 'white') white++;
            }
        }
        this.scoreBlackElement.textContent = black;
        this.scoreWhiteElement.textContent = white;
    }
}

// ロード時にゲームを初期化
document.addEventListener('DOMContentLoaded', () => {
    new OthelloGame();
});
