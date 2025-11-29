// src/lib/sudoku.ts
type Board = number[][];
const BLANK = 0;

function isValid(board: Board, row: number, col: number, num: number): boolean {
  for (let i = 0; i < 9; i++) {
    if (board[row][i] === num && i !== col) return false;
    if (board[i][col] === num && i !== row) return false;
  }
  const startRow = 3 * Math.floor(row / 3);
  const startCol = 3 * Math.floor(col / 3);
  for (let i = 0; i < 3; i++) {
    for (let j = 0; j < 3; j++) {
      if (board[startRow + i][startCol + j] === num) return false;
    }
  }
  return true;
}

export function solve(board: Board, count = { val: 0 }, countOnly = false): boolean {
  if (countOnly && count.val > 1) return false; // Optimization
  for (let row = 0; row < 9; row++) {
    for (let col = 0; col < 9; col++) {
      if (board[row][col] === BLANK) {
        const nums = [1, 2, 3, 4, 5, 6, 7, 8, 9].sort(() => Math.random() - 0.5);
        for (const num of nums) {
          if (isValid(board, row, col, num)) {
            board[row][col] = num;
            if (solve(board, count, countOnly)) return true;
            board[row][col] = BLANK;
          }
        }
        return false;
      }
    }
  }
  if (countOnly) count.val++;
  return true;
}

export function generateSudoku(attempts = 40) {
  const solved = Array.from({ length: 9 }, () => Array(9).fill(BLANK));
  solve(solved); // Generate full board
  const playable = JSON.parse(JSON.stringify(solved));
  
  // Dig holes
  for (let i = 0; i < attempts; i++) {
    let r = Math.floor(Math.random() * 9);
    let c = Math.floor(Math.random() * 9);
    while(playable[r][c] === BLANK) {
        r = Math.floor(Math.random() * 9);
        c = Math.floor(Math.random() * 9);
    }
    const backup = playable[r][c];
    playable[r][c] = BLANK;
    
    // Check uniqueness
    const copy = JSON.parse(JSON.stringify(playable));
    const count = { val: 0 };
    solve(copy, count, true);
    if (count.val !== 1) playable[r][c] = backup; // Put back if ambiguous
  }
  return { board: playable, solution: solved };
}