// useGameBoard.ts
import { useState } from 'react';
import { generateSafeBoard, revealEmptyCells, calculateFlaggedCount } from '@/utils';
import type { GameState } from '@/types';

// 棋盘配置类型
export interface BoardConfig {
  width: number;
  height: number;
  mines: number;
}

interface UseGameBoardProps {
  onWin: () => void;
  onLose: () => void;
}

export function useGameBoard({ onWin, onLose }: UseGameBoardProps) {
  // 游戏状态
  const [gameState, setGameState] = useState<GameState>({
    board: Array(0).fill(Array(0).fill(0)),
    revealed: Array.from({ length: 0 }, () => Array(0).fill(0)),
    timer: 0,
    total: 0,
    mines: 0,
    revealedCount: 0,
    flaggedCount: 0,
  });

  // 棋盘配置
  const [boardConfig, setBoardConfig] = useState<BoardConfig>({
    width: 0,
    height: 0,
    mines: 0
  });
  // 添加一个状态来跟踪是否为第一次点击
  const [isFirstClick, setIsFirstClick] = useState(true);

  // 根据难度创建棋盘
  const createBoard = (difficulty: string) => {
    let rows, cols, mines;
    switch (difficulty) {
      case 'easy':
        rows = 10; cols = 10; mines = 10;
        break;
      case 'medium':
        rows = 16; cols = 16; mines = 40;
        break;
      case 'hard':
        rows = 30; cols = 16; mines = 99;
        break;
      default:
        rows = 10; cols = 10; mines = 10;
    }

    // 更新棋盘配置
    setBoardConfig({
      width: cols,
      height: rows,
      mines: mines
    });

    // 重置第一次点击状态
    setIsFirstClick(true);

    // 生成空棋盘（不放置地雷）
    const emptyBoard = Array.from({ length: rows }, () => Array(cols).fill(0));

    setGameState({
      board: emptyBoard,
      revealed: Array.from({ length: rows }, () => Array(cols).fill(0)),
      timer: 0,
      total: rows * cols,
      mines,
      revealedCount: 0,
      flaggedCount: 0,
    });

    return { board: emptyBoard, rows, cols, mines };
  };

  // 重置计时器
  const resetTimer = () => {
    setGameState(prev => ({
      ...prev,
      timer: 0
    }));
  };

  // 更新计时器
  const updateTimer = () => {
    setGameState(prev => ({
      ...prev,
      timer: prev.timer + 1
    }));
  };

  // 处理单元格点击
  const handleCellClick = (row: number, col: number, gameStatus: string) => {
    if (gameStatus !== 'playing' || gameState.revealed[row][col]) {
      return;
    }

    // 如果是第一次点击，确保不会踩雷并生成真正的棋盘
    if (isFirstClick) {
      setIsFirstClick(false);

      // 生成确保第一次点击不是地雷的棋盘
      const { height: rows, width: cols, mines } = boardConfig;
      const newBoard = generateSafeBoard(rows, cols, mines, row, col);

      // 创建新的revealed数组
      const newRevealed = Array.from({ length: rows }, () => Array(cols).fill(0));

      // 由于我们确保了第一次点击的格子是空白格子（值为0），所以执行连锁揭开
      revealEmptyCells(row, col, newBoard, newRevealed);

      // 计算已标记和已揭示的格子数量
      const [flaggedCount, revealedCount] = calculateFlaggedCount(newRevealed);

      // 更新游戏状态
      setGameState(prevState => ({
        ...prevState,
        board: newBoard,
        revealed: newRevealed,
        flaggedCount,
        revealedCount
      }));

      // 检查是否获胜（不太可能在第一次点击就赢，但以防万一）
      if (rows * cols - mines === revealedCount) {
        setTimeout(() => onWin(), 100);
      }

      return;
    }

    if (gameState.board[row][col] === -1) {
      // 点击到地雷
      setGameState(prevState => ({
        ...prevState,
        revealed: prevState.revealed.map((r, i) =>
          r.map((_c, j) => (i === row && j === col ? 1 : prevState.revealed[i][j]))
        ),
      }));
      onLose();
    } else {
      setGameState(prevState => {
        const newRevealed = prevState.revealed.map(arr => [...arr]);

        if (prevState.board[row][col] === 0) {
          revealEmptyCells(row, col, prevState.board, newRevealed);
        } else {
          newRevealed[row][col] = 1;
        }

        const [flaggedCount, revealedCount] = calculateFlaggedCount(newRevealed);

        // 检查是否获胜
        const isWin = prevState.total - prevState.mines === revealedCount;

        // 如果获胜，通知父组件
        if (isWin) {
          setTimeout(() => onWin(), 100);
        }

        return {
          ...prevState,
          revealed: newRevealed,
          flaggedCount,
          revealedCount
        };
      });
    }
  };

  // 处理右键点击（标记地雷）
  const handleCellRightClick = (row: number, col: number, gameStatus: string) => {
    if (gameStatus !== 'playing' || gameState.revealed[row][col] === 1) {
      return;
    }

    setGameState(prevState => {
      const newRevealed = prevState.revealed.map(arr => [...arr]);
      const revealed = newRevealed[row][col];

      if (revealed === 0) {
        newRevealed[row][col] = 2; // 标记为地雷
      } else if (revealed === 2) {
        newRevealed[row][col] = 0; // 取消标记
      }

      const [flaggedCount, revealedCount] = calculateFlaggedCount(newRevealed);

      // 检查是否获胜
      const isWin = prevState.total - prevState.mines === revealedCount;

      // 如果获胜，通知父组件
      if (isWin) {
        setTimeout(() => onWin(), 100);
      }

      return {
        ...prevState,
        revealed: newRevealed,
        flaggedCount,
        revealedCount
      };
    });
  };

  return {
    gameState,
    boardConfig,
    createBoard,
    resetTimer,
    updateTimer,
    handleCellClick,
    handleCellRightClick
  };
}
