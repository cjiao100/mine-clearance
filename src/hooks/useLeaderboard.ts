import { useState, useCallback, useEffect } from 'react';
import type {
  LeaderboardItem,
  LeaderboardFilter,
} from '@/types/leaderboard';
import { defaultLeaderboardFilter } from '@/constants/leaderboard';
import {
  getFilteredLeaderboard,
  addLeaderboardEntry,
  clearLeaderboard
} from '@/utils/leaderboardUtils';

export function useLeaderboard() {
  // 排行榜记录
  const [leaderboard, setLeaderboard] = useState<LeaderboardItem[]>([]);

  // 过滤选项
  const [filter, setFilter] = useState<LeaderboardFilter>(defaultLeaderboardFilter);

  // 加载状态
  const [loading, setLoading] = useState<boolean>(false);

  // 玩家名称
  const [playerName, setPlayerName] = useState<string>(() => {
    return localStorage.getItem('minesweeper_player_name') || '无名英雄';
  });

  // 初始化加载数据
  const loadLeaderboard = useCallback(() => {
    setLoading(true);
    try {
      const data = getFilteredLeaderboard(filter);
      setLeaderboard(data);
    } catch (error) {
      console.error('加载排行榜失败:', error);
    } finally {
      setLoading(false);
    }
  }, [filter]);

  // 当过滤条件变化时重新加载数据
  useEffect(() => {
    loadLeaderboard();
  }, [filter, loadLeaderboard]);

  // 更新过滤条件
  const updateFilter = useCallback((newFilter: Partial<LeaderboardFilter>) => {
    setFilter(prev => ({ ...prev, ...newFilter }));
  }, []);

  // 保存玩家名称
  const savePlayerName = useCallback((name: string) => {
    if (name.trim()) {
      setPlayerName(name);
      localStorage.setItem('minesweeper_player_name', name);
    }
  }, []);

  // 添加新记录
  const addNewRecord = useCallback((
    difficulty: string,
    time: number,
    mines: number
  ) => {
    try {
      addLeaderboardEntry({
        playerName,
        difficulty,
        time,
        mines,
        date: Date.now()
      });
      loadLeaderboard();
      return true;
    } catch (error) {
      console.error('添加排行榜记录失败:', error);
      return false;
    }
  }, [playerName, loadLeaderboard]);

  // 清空记录
  const clearRecords = useCallback((difficulty?: string) => {
    try {
      clearLeaderboard(difficulty);
      loadLeaderboard();
      return true;
    } catch (error) {
      console.error('清空排行榜失败:', error);
      return false;
    }
  }, [loadLeaderboard]);

  // 格式化难度显示
  const formatDifficulty = useCallback((difficulty: string): string => {
    const difficultyMap: Record<string, string> = {
      'easy': '简单',
      'medium': '中等',
      'hard': '困难'
    };
    return difficultyMap[difficulty] || difficulty;
  }, []);

  // 格式化时间显示（转换为分:秒格式）
  const formatTime = useCallback((time: number): string => {
    const minutes = Math.floor(time / 60);
    const seconds = time % 60;
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  }, []);

  // 格式化日期显示
  const formatDate = useCallback((timestamp: number): string => {
    return new Date(timestamp).toLocaleDateString('zh-CN', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    });
  }, []);

  return {
    leaderboard,
    filter,
    loading,
    playerName,
    updateFilter,
    savePlayerName,
    addNewRecord,
    clearRecords,
    loadLeaderboard,
    formatDifficulty,
    formatTime,
    formatDate
  };
}
