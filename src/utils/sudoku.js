// src/utils/sudoku.js

// Base valid fully solved 9x9 board
const BASE_BOARD = [
    [4, 3, 5, 2, 6, 9, 7, 8, 1],
    [6, 8, 2, 5, 7, 1, 4, 9, 3],
    [1, 9, 7, 8, 3, 4, 5, 6, 2],
    [8, 2, 6, 1, 9, 5, 3, 4, 7],
    [3, 7, 4, 6, 8, 2, 9, 1, 5],
    [9, 5, 1, 7, 4, 3, 6, 2, 8],
    [5, 1, 9, 3, 2, 6, 8, 7, 4],
    [2, 4, 8, 9, 5, 7, 1, 3, 6],
    [7, 6, 3, 4, 1, 8, 2, 5, 9]
];

// random integer between 0 and max-1
const rnd = (max) => Math.floor(Math.random() * max);

const shuffleBoard = (board) => {
    let newBoard = board.map(row => [...row]);

    // Swap numbers (e.g., all 1s become 5s, 5s become 1s)
    for (let i = 1; i <= 9; i++) {
        const swapWith = rnd(9) + 1;
        for (let r = 0; r < 9; r++) {
            for (let c = 0; c < 9; c++) {
                if (newBoard[r][c] === i) newBoard[r][c] = swapWith;
                else if (newBoard[r][c] === swapWith) newBoard[r][c] = i;
            }
        }
    }

    // Swap rows within bands (0-2, 3-5, 6-8)
    for (let b = 0; b < 3; b++) {
        const r1 = b * 3 + rnd(3);
        const r2 = b * 3 + rnd(3);
        const temp = newBoard[r1];
        newBoard[r1] = newBoard[r2];
        newBoard[r2] = temp;
    }

    // Swap columns within stacks (0-2, 3-5, 6-8)
    for (let s = 0; s < 3; s++) {
        const c1 = s * 3 + rnd(3);
        const c2 = s * 3 + rnd(3);
        for (let r = 0; r < 9; r++) {
            const temp = newBoard[r][c1];
            newBoard[r][c1] = newBoard[r][c2];
            newBoard[r][c2] = temp;
        }
    }

    // Swap bands
    const b1 = rnd(3);
    const b2 = rnd(3);
    for (let r = 0; r < 3; r++) {
        const temp = newBoard[b1 * 3 + r];
        newBoard[b1 * 3 + r] = newBoard[b2 * 3 + r];
        newBoard[b2 * 3 + r] = temp;
    }

    // Swap stacks
    const s1 = rnd(3);
    const s2 = rnd(3);
    for (let r = 0; r < 9; r++) {
        for (let c = 0; c < 3; c++) {
            const temp = newBoard[r][s1 * 3 + c];
            newBoard[r][s1 * 3 + c] = newBoard[r][s2 * 3 + c];
            newBoard[r][s2 * 3 + c] = temp;
        }
    }

    return newBoard;
};

export const generatePuzzle = (difficulty) => {
    let board = shuffleBoard(BASE_BOARD);
    let removeCount = 0;

    switch (difficulty) {
        case 'Easy': removeCount = 30; break;
        case 'Medium': removeCount = 45; break;
        case 'Hard': removeCount = 58; break;
        default: removeCount = 40;
    }

    let cellsRemoved = 0;
    while (cellsRemoved < removeCount) {
        const r = rnd(9);
        const c = rnd(9);
        if (board[r][c] !== null) {
            board[r][c] = null;
            cellsRemoved++;
        }
    }

    return board;
};

export const createEmptyBoard = () => Array(9).fill().map(() => Array(9).fill(null));
