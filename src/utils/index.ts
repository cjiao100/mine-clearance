import type { BoardType, RevealedType } from "../types";

export function generateBoard(rows: number, cols: number, mines: number): number[][] {
  const board = Array.from({ length: rows }, () => Array(cols).fill(0));

  let mineCount = 0;
  while (mineCount < mines) {
    const row = Math.floor(Math.random() * rows);
    const col = Math.floor(Math.random() * cols);
    if (board[row][col] !== -1) {
      board[row][col] = -1; // 设置地雷
      mineCount++;
      // 更新周围的数字
      for (let i = -1; i <= 1; i++) {
        for (let j = -1; j <= 1; j++) {
          if (row + i >= 0 && row + i < rows && col + j >= 0 && col + j < cols && board[row + i][col + j] !== -1) {
            board[row + i][col + j]++;
          }
        }
      }
    }
  }

  return board; // 返回生成的棋盘
}

export function calculateFlaggedCount(revealed: RevealedType): number[] {
  const flaggedCells = revealed.flat().filter(cell => cell === 2).length;
  const safeCells = revealed.flat().filter(cell => cell === 1).length;
  return [flaggedCells, safeCells];
}

export function revealEmptyCells(row: number, col: number, board: BoardType, revealed: RevealedType): void {
  // 揭示空白格子逻辑...
  const rows = board.length;
    const cols = board[0].length;

    if (row < 0 || row >= rows || col < 0 || col >= cols || revealed[row][col] !== 0) {
      return;
    }

    // 当前格子置为已点击
    revealed[row][col] = 1;

    // 如果是空白格子，则递归检查周围的格子
    if (board[row][col] === 0) {
      // 遍历周边的格子
      for (let i = -1; i <= 1; i += 1) {
        for (let j = -1; j <= 1; j += 1) {
          if (i === 0 && j === 0) continue;
          revealEmptyCells(row + i, col + j, board, revealed);
        }
      }
    }
}