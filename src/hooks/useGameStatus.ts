// useGameStatus.ts
import { useState, useRef } from 'react';
import type { GameStatus } from '@/types';

export function useGameStatus() {
  // 游戏状态
  const [gameStatus, setGameStatus] = useState<GameStatus>('idle');
  
  // 当前难度
  const [currentDifficulty, setCurrentDifficulty] = useState<string>('easy');
  
  // 上一次状态快照，用于暂停和恢复
  const previousState = useRef<{
    difficulty: string;
    board: number[][];
    revealed: number[][];
  } | null>(null);

  // 设置游戏难度
  const setDifficulty = (difficulty: string) => {
    setCurrentDifficulty(difficulty);
  };

  // 开始游戏
  const startGame = () => {
    setGameStatus('playing');
  };

  // 暂停游戏
  const pauseGame = (boardState?: { difficulty: string; board: number[][]; revealed: number[][] }) => {
    if (gameStatus !== 'playing') return;
    
    if (boardState) {
      previousState.current = boardState;
    }
    
    setGameStatus('paused');
  };
  
  // 继续游戏
  const resumeGame = () => {
    if (gameStatus !== 'paused') return;
    setGameStatus('playing');
  };
  
  // 游戏胜利
  const winGame = () => {
    setGameStatus('won');
  };
  
  // 游戏失败
  const loseGame = () => {
    setGameStatus('lost');
  };
  
  // 重置游戏状态
  const resetGame = () => {
    setGameStatus('playing');
  };

  return {
    gameStatus,
    currentDifficulty,
    previousState: previousState.current,
    setDifficulty,
    startGame,
    pauseGame,
    resumeGame,
    winGame,
    loseGame,
    resetGame
  };
}
