// useMineSweeper.ts - 主hook文件
import { useEffect } from 'react';
import { useGameBoard } from './useGameBoard';
import { useGameTimer } from './useGameTimer';
import { useGameStats } from './useGameStats';
import { useGameStatus } from './useGameStatus';
import { useGameModal } from './useGameModal';
import { useAudio } from '@/contexts/AudioContext';

export function useMineSweeper() {
  // 整合各个子hook
  const { gameStats, recordWin, recordLoss } = useGameStats();

  // 添加音效
  // 尝试在组件渲染时再获取音频上下文
  const audio = useAudio();
  const playFlagSound = audio?.playFlagSound;
  const playVictorySound = audio?.playVictorySound;

  const {
    gameStatus,
    currentDifficulty,
    setDifficulty,
    startGame: setGameStart,
    pauseGame,
    resumeGame,
    winGame,
    loseGame,
    resetGame: resetGameStatus
  } = useGameStatus();

  const {
    gameState,
    boardConfig,
    createBoard,
    resetTimer,
    updateTimer,
    handleCellClick: handleBoardCellClick,
    handleCellRightClick: handleBoardCellRightClick
  } = useGameBoard({
    onWin: () => {
      recordWin(gameState.timer);
      if (playVictorySound) playVictorySound(); // 胜利时播放胜利音效
      winGame();
    },
    onLose: () => {
      recordLoss();
      // 爆炸音效已在Cell组件中处理
      loseGame();
    }
  });

  const {
    startTimer,
    stopTimer,
    resetAndStartTimer,
    cleanupTimer
  } = useGameTimer(updateTimer);

  const {
    modalState,
    showRules,
    showLeaderboard,
    showWinModal,
    showLoseModal,
    closeModal
  } = useGameModal();

  // 游戏开始
  const startGame = (difficulty: string) => {
    if (!difficulty || !['easy', 'medium', 'hard'].includes(difficulty)) {
      alert("无效的难度选择，请重新选择。");
      return;
    }

    setDifficulty(difficulty);
    createBoard(difficulty);
    resetTimer();
    setGameStart();
    closeModal();
    resetAndStartTimer();
  };

  // 重置当前游戏
  const resetGame = () => {
    createBoard(currentDifficulty);
    resetGameStatus();
    resetAndStartTimer();
  };

  // 处理单元格点击
  const handleCellClick = (row: number, col: number) => {
    handleBoardCellClick(row, col, gameStatus);
  };

  // 处理右键点击
  const handleCellRightClick = (row: number, col: number) => {
    if (gameStatus === 'playing' || gameStatus === 'idle') {
      // 播放标旗音效
      if (playFlagSound) playFlagSound();
      handleBoardCellRightClick(row, col, gameStatus);
    }
  };

  // 处理暂停/继续游戏
  const handlePauseGame = () => {
    pauseGame({
      difficulty: currentDifficulty,
      board: [...gameState.board],
      revealed: [...gameState.revealed]
    });
    stopTimer();
  };

  const handleResumeGame = () => {
    resumeGame();
    startTimer();
  };

  // 游戏结果处理
  useEffect(() => {
    if (gameStatus === 'won') {
      stopTimer();
      // 胜利时播放音效
      if (playVictorySound) playVictorySound();
      showWinModal(gameState.timer);
    } else if (gameStatus === 'lost') {
      stopTimer();
      // 爆炸音效已在 Cell 组件中处理
      showLoseModal(
        gameState.timer,
        gameState.mines - gameState.flaggedCount,
        gameState.revealedCount
      );
    }
  }, [gameStatus]);

  // 组件卸载时清理计时器
  useEffect(() => {
    return () => {
      cleanupTimer();
    };
  }, []);

  return {
    gameStatus,
    gameState,
    gameStats,
    boardConfig,
    modalState,
    currentDifficulty,
    startGame,
    resetGame,
    pauseGame: handlePauseGame,
    resumeGame: handleResumeGame,
    handleCellClick,
    handleCellRightClick,
    showRules,
    showLeaderboard,
    closeModal,
  };
}
