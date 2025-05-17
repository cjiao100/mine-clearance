import type { LeaderboardFilter } from "@/types/leaderboard";

// 默认排行榜过滤设置
export const defaultLeaderboardFilter: LeaderboardFilter = {
  difficulty: null,
  limit: 10,
  sortBy: 'time',
  sortDirection: 'asc'
};