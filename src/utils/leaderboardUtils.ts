import type { LeaderboardData, LeaderboardItem, LeaderboardFilter } from '@/types/leaderboard';

// 本地存储键
const LEADERBOARD_STORAGE_KEY = 'minesweeper_leaderboard';

// 初始化空排行榜
const emptyLeaderboard = (): LeaderboardData => ({
  easy: [],
  medium: [],
  hard: []
});

/**
 * 获取排行榜数据
 */
export const getLeaderboard = (): LeaderboardData => {
  try {
    const data = localStorage.getItem(LEADERBOARD_STORAGE_KEY);
    if (!data) return emptyLeaderboard();

    const parsedData = JSON.parse(data);
    return {
      easy: Array.isArray(parsedData.easy) ? parsedData.easy : [],
      medium: Array.isArray(parsedData.medium) ? parsedData.medium : [],
      hard: Array.isArray(parsedData.hard) ? parsedData.hard : []
    };
  } catch (error) {
    console.error('获取排行榜失败:', error);
    return emptyLeaderboard();
  }
};

/**
 * 保存排行榜数据
 */
export const saveLeaderboard = (leaderboard: LeaderboardData): void => {
  try {
    localStorage.setItem(LEADERBOARD_STORAGE_KEY, JSON.stringify(leaderboard));
  } catch (error) {
    console.error('保存排行榜失败:', error);
  }
};

/**
 * 添加新的排行记录
 */
export const addLeaderboardEntry = (entry: Omit<LeaderboardItem, 'id'>): LeaderboardItem => {
  // 验证难度
  if (!['easy', 'medium', 'hard'].includes(entry.difficulty)) {
    throw new Error('无效的难度级别');
  }

  const leaderboard = getLeaderboard();

  // 创建新记录
  const newEntry: LeaderboardItem = {
    ...entry,
    id: generateId()
  };

  // 将记录添加到对应难度的数组中
  leaderboard[entry.difficulty as keyof LeaderboardData].push(newEntry);

  // 根据时间排序（升序）
  leaderboard[entry.difficulty as keyof LeaderboardData].sort((a, b) => a.time - b.time);

  // 只保留前20条记录
  if (leaderboard[entry.difficulty as keyof LeaderboardData].length > 20) {
    leaderboard[entry.difficulty as keyof LeaderboardData] =
      leaderboard[entry.difficulty as keyof LeaderboardData].slice(0, 20);
  }

  // 保存排行榜
  saveLeaderboard(leaderboard);

  return newEntry;
};

/**
 * 根据过滤条件获取排行榜数据
 */
export const getFilteredLeaderboard = (filter: LeaderboardFilter): LeaderboardItem[] => {
  const leaderboard = getLeaderboard();

  // 根据难度获取数据
  let results: LeaderboardItem[] = [];
  if (filter.difficulty) {
    // 如果指定了难度，只获取该难度的数据
    results = [...leaderboard[filter.difficulty as keyof LeaderboardData]];
  } else {
    // 否则获取所有难度的数据
    results = [...leaderboard.easy, ...leaderboard.medium, ...leaderboard.hard];
  }

  // 根据排序字段和方向排序
  results.sort((a, b) => {
    const aValue = a[filter.sortBy];
    const bValue = b[filter.sortBy];

    if (filter.sortDirection === 'asc') {
      return aValue > bValue ? 1 : -1;
    } else {
      return aValue < bValue ? 1 : -1;
    }
  });

  // 限制返回数量
  return results.slice(0, filter.limit);
};

/**
 * 清除排行榜数据
 */
export const clearLeaderboard = (difficulty?: string): void => {
  const leaderboard = getLeaderboard();

  if (difficulty) {
    // 清除指定难度的记录
    leaderboard[difficulty as keyof LeaderboardData] = [];
  } else {
    // 清除所有记录
    Object.keys(leaderboard).forEach(key => {
      leaderboard[key as keyof LeaderboardData] = [];
    });
  }

  saveLeaderboard(leaderboard);
};

/**
 * 生成唯一ID
 */
const generateId = (): string => {
  return Date.now().toString(36) + Math.random().toString(36).substring(2, 9);
};
