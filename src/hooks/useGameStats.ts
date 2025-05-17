// useGameStats.ts
import { useState, useEffect } from 'react';

// 游戏统计类型
export interface GameStats {
  wins: number;
  losses: number;
  bestTime: number;
  totalGames: number;
}

// 本地存储键
const STATS_STORAGE_KEY = 'minesweeper_stats';

export function useGameStats() {
  // 获取本地存储的游戏统计数据
  const loadGameStats = (): GameStats => {
    const statsStr = localStorage.getItem(STATS_STORAGE_KEY);
    if (statsStr) {
      try {
        return JSON.parse(statsStr);
      } catch (e) {
        console.error('Failed to parse game stats', e);
      }
    }
    return {
      wins: 0,
      losses: 0,
      bestTime: 0,
      totalGames: 0
    };
  };

  const [gameStats, setGameStats] = useState<GameStats>(loadGameStats);

  // 保存游戏统计数据到本地存储
  const saveGameStats = (stats: GameStats) => {
    localStorage.setItem(STATS_STORAGE_KEY, JSON.stringify(stats));
  };

  // 记录胜利
  const recordWin = (time: number) => {
    const updatedStats = {...gameStats};
    updatedStats.wins += 1;
    updatedStats.totalGames += 1;
    
    // 更新最佳时间
    if (gameStats.bestTime === 0 || time < gameStats.bestTime) {
      updatedStats.bestTime = time;
    }
    
    setGameStats(updatedStats);
  };

  // 记录失败
  const recordLoss = () => {
    const updatedStats = {...gameStats};
    updatedStats.losses += 1;
    updatedStats.totalGames += 1;
    setGameStats(updatedStats);
  };

  // 当统计数据变化时，保存到本地存储
  useEffect(() => {
    saveGameStats(gameStats);
  }, [gameStats]);

  return {
    gameStats,
    recordWin,
    recordLoss
  };
}
