import type { BoardType, RevealedType } from "@/types";

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

/**
 * 生成一个安全的棋盘，确保指定位置是一个空白格子（周围没有地雷）
 * @param rows 棋盘行数
 * @param cols 棋盘列数
 * @param mines 地雷数量
 * @param safeRow 安全区域的中心行
 * @param safeCol 安全区域的中心列
 * @returns 生成的棋盘
 */
export function generateSafeBoard(rows: number, cols: number, mines: number, safeRow: number, safeCol: number): number[][] {
  const board = Array.from({ length: rows }, () => Array(cols).fill(0));

  // 创建扩展的安全区域
  // 为了确保点击位置是空白格子（0），我们需要在更大范围内禁止放置地雷
  const forbiddenCells = [];

  // 扩大安全区域，确保第一次点击位置及其周围一圈都不会有数字
  // 这意味着我们需要在"周围一圈的周围一圈"都禁止放置地雷
  for (let i = -2; i <= 2; i++) {
    for (let j = -2; j <= 2; j++) {
      const r = safeRow + i;
      const c = safeCol + j;
      if (r >= 0 && r < rows && c >= 0 && c < cols) {
        forbiddenCells.push({ row: r, col: c });
      }
    }
  }

  // 放置地雷
  let mineCount = 0;

  // 检查地雷数量是否超过可用格子数
  const availableCells = rows * cols - forbiddenCells.length;
  const actualMines = Math.min(mines, availableCells);

  while (mineCount < actualMines) {
    const row = Math.floor(Math.random() * rows);
    const col = Math.floor(Math.random() * cols);

    // 检查该位置是否在禁止放置地雷的区域内
    const isForbidden = forbiddenCells.some(cell => cell.row === row && cell.col === col);

    if (!isForbidden && board[row][col] !== -1) {
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

  return board;
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