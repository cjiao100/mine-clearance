import { useState, useRef, useEffect } from 'react';
import { generateBoard, revealEmptyCells, calculateFlaggedCount } from '@/utils';
import type { GameState, ModalState } from '@/types';


export function useMineSweeper() {
  // 时间对象
  const timerRef = useRef<ReturnType<typeof setInterval>>(null);

  // 游戏状态
  const [gameState, setGameState] = useState<GameState>({
    board: Array(0).fill(Array(0).fill(0)),
    revealed: Array.from({ length: 0 }, () => Array(0).fill(0)), // 修复数组引用问题
    gameOver: 0,
    timer: 0,
    total: 0,
    mines: 0,
    revealedCount: 0,
    flaggedCount: 0,
  });

  // 模态框状态
  const [modalState, setModalState] = useState<ModalState>({
    type: 'rules',
    title: '游戏规则',
    visible: false,
    hiddenBtn: false,
    message: '',
  });

  // 根据难度设置棋盘
  const setBoard = (difficulty: string) => {
    let rows, cols, mines;
    switch (difficulty) {
      case 'easy':
        rows = 10; cols = 10; mines = 10;
        break;
      case 'medium':
        rows = 16; cols = 16; mines = 40;
        break;
      case 'hard':
        rows = 16; cols = 30; mines = 99;
        break;
      default:
        rows = 10; cols = 10; mines = 20;
    }

    // 生成棋盘
    const board = generateBoard(rows, cols, mines);

    setGameState({
      board,
      revealed: Array.from({ length: rows }, () => Array(cols).fill(0)),
      gameOver: 0,
      timer: 0,
      total: rows * cols,
      mines,
      revealedCount: 0,
      flaggedCount: 0,
    });
  };

  // 游戏开始
  const startGame = (difficulty: string) => {
    if (!difficulty || !['easy', 'medium', 'hard'].includes(difficulty)) {
      alert("无效的难度选择，请重新选择。");
      return;
    }

    setBoard(difficulty);
    setModalState(prev => ({ ...prev, visible: false }));
    startTimer();
  };

  // 游戏结束
  const endGame = () => {
    stopTimer();
    setGameState(prev => ({ ...prev, gameOver: -1 }));
  };

  // 开始计时器
  const startTimer = () => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
    }

    timerRef.current = setInterval(() => {
      setGameState(prev => ({ ...prev, timer: prev.timer + 1 }));
    }, 1000);
  };

  // 停止计时器
  const stopTimer = () => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
  };

  // 处理点击
  const handleCellClick = (row: number, col: number) => {
    if (gameState.gameOver !== 0 || gameState.revealed[row][col]) {
      return;
    }

    if (gameState.board[row][col] === -1) {
      setGameState(prevState => ({
        ...prevState,
        revealed: prevState.revealed.map((r, i) =>
          r.map((_c, j) => (i === row && j === col ? 1 : prevState.revealed[i][j]))
        ),
      }));
      endGame();
    } else {
      setGameState(prevState => {
        const newRevealed = prevState.revealed.map(arr => [...arr]);

        if (prevState.board[row][col] === 0) {
          revealEmptyCells(row, col, prevState.board, newRevealed);
        } else {
          newRevealed[row][col] = 1;
        }

        const [flaggedCount, revealedCount] = calculateFlaggedCount(newRevealed);

        return {
          ...prevState,
          revealed: newRevealed,
          flaggedCount,
          revealedCount,
          gameOver: prevState.total - prevState.mines === revealedCount ? 1 : 0,
        };
      });
    }
  };

  // 处理右键点击
  const handleCellRightClick = (row: number, col: number) => {
    if (gameState.gameOver || gameState.revealed[row][col] === 1) {
      return;
    }

    setGameState(prevState => {
      const newRevealed = prevState.revealed.map(arr => [...arr]);
      const revealed = newRevealed[row][col];

      if (revealed === 0) {
        newRevealed[row][col] = 2;
      } else if (revealed === 2) {
        newRevealed[row][col] = 0;
      }

      const [flaggedCount, revealedCount] = calculateFlaggedCount(newRevealed);

      return {
        ...prevState,
        revealed: newRevealed,
        flaggedCount,
        revealedCount,
        gameOver: prevState.total - prevState.mines === revealedCount ? 1 : 0,
      };
    });
  };

  // 显示难度选择模态框
  const showDifficultyModal = () => {
    setModalState({
      type: 'difficulty',
      title: '选择游戏难度',
      visible: true,
      hiddenBtn: true,
      message: '',
    });
  };

  // 关闭模态框
  const closeModal = () => {
    setModalState(prev => ({ ...prev, visible: false }));
  };

  // 游戏结果处理
  useEffect(() => {
    if (gameState.gameOver === 1) {
      // 游戏胜利
      stopTimer();
      setModalState({
        visible: true,
        hiddenBtn: true,
        type: 'success',
        title: '游戏胜利',
        message: `用时 ${gameState.timer} 秒`,
      });
    } else if (gameState.gameOver === -1) {
      // 游戏失败
      stopTimer();
      setModalState({
        visible: true,
        hiddenBtn: true,
        type: 'error',
        title: '游戏失败',
        message: `用时 ${gameState.timer} 秒，剩余雷数 ${gameState.mines - gameState.flaggedCount}，已揭示格子数 ${gameState.revealedCount}`,
      });
    }
  }, [gameState.gameOver]);

  // 清理计时器
  useEffect(() => {
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, []);

  return {
    gameState,
    modalState,
    startGame,
    handleCellClick,
    handleCellRightClick,
    showDifficultyModal,
    closeModal,
  };
}