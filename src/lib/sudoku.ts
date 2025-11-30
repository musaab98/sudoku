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

export function solve(board: Board, findFirst = true): boolean {
  for (let row = 0; row < 9; row++) {
    for (let col = 0; col < 9; col++) {
      if (board[row][col] === BLANK) {
        const nums = findFirst 
          ? [1, 2, 3, 4, 5, 6, 7, 8, 9].sort(() => Math.random() - 0.5)
          : [1, 2, 3, 4, 5, 6, 7, 8, 9];
        for (const num of nums) {
          if (isValid(board, row, col, num)) {
            board[row][col] = num;
            if (solve(board, findFirst)) {
              return true;
            }
            board[row][col] = BLANK;
          }
        }
        return false;
      }
    }
  }
  return true;
}

function countSolutions(board: Board, limit = 2): number {
  let count = 0;
  
  function backtrack(b: Board): void {
    if (count >= limit) return;
    
    for (let row = 0; row < 9; row++) {
      for (let col = 0; col < 9; col++) {
        if (b[row][col] === BLANK) {
          for (let num = 1; num <= 9; num++) {
            if (isValid(b, row, col, num)) {
              b[row][col] = num;
              backtrack(b);
              b[row][col] = BLANK;
              if (count >= limit) return;
            }
          }
          return;
        }
      }
    }
    count++;
  }
  
  const copy = JSON.parse(JSON.stringify(board));
  backtrack(copy);
  return count;
}

export function generateSudoku(attempts = 40) {
  const solved = Array.from({ length: 9 }, () => Array(9).fill(BLANK));
  solve(solved); // Generate full board
  const playable = JSON.parse(JSON.stringify(solved));

  // Dig holes
  const maxAttempts = Math.min(attempts, 35);
  for (let i = 0; i < maxAttempts; i++) {
    let r = Math.floor(Math.random() * 9);
    let c = Math.floor(Math.random() * 9);
    let tries = 0;
    while(playable[r][c] === BLANK && tries < 30) {
      r = Math.floor(Math.random() * 9);
      c = Math.floor(Math.random() * 9);
      tries++;
    }
    if (playable[r][c] === BLANK) continue;
    
    const backup = playable[r][c];
    playable[r][c] = BLANK;

    // Check uniqueness
    const numSolutions = countSolutions(playable, 2);
    if (numSolutions !== 1) {
      playable[r][c] = backup; // Put back if not unique
    }
  }
  return { board: playable, solution: solved };
}