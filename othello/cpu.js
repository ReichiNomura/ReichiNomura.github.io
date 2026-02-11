class CPU {
    constructor() {
    }

    // 次の手を決定する
    // board: 現在の盤面の状態 (2次元配列)
    // color: CPUの色 ('black' or 'white')
    // game: ゲームインスタンス（ルール判定用）
    decideMove(board, color, game) {
        // 有効な手を全て取得
        const validMoves = game.getValidMoves(color, board);

        if (validMoves.length === 0) {
            return null; // パス
        }

        // 戦略1: 角があれば優先的に取る
        const corners = [
            { r: 0, c: 0 }, { r: 0, c: 7 },
            { r: 7, c: 0 }, { r: 7, c: 7 }
        ];

        for (const corner of corners) {
            const isCornerAvailable = validMoves.some(m => m.r === corner.r && m.c === corner.c);
            if (isCornerAvailable) {
                console.log(`CPU (${color}): 角を取りにいきます [${corner.r}, ${corner.c}]`);
                return corner;
            }
        }

        // 戦略2: ランダムに選択 (今のところ)
        const randomIndex = Math.floor(Math.random() * validMoves.length);
        const choice = validMoves[randomIndex];
        console.log(`CPU (${color}): ランダムに選択 [${choice.r}, ${choice.c}]`);

        return choice;
    }
}
