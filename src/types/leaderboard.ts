/**
 * 排行榜项目类型定义
 */

// 单条排行记录
export interface LeaderboardItem {
  id: string;         // 唯一ID
  playerName: string; // 玩家名称
  difficulty: string; // 难度: 'easy', 'medium', 'hard'
  time: number;       // 完成时间（秒）
  mines: number;      // 总雷数
  date: number;       // 完成日期时间戳
}

// 按难度分组的排行榜
export interface LeaderboardData {
  easy: LeaderboardItem[];
  medium: LeaderboardItem[];
  hard: LeaderboardItem[];
}

// 排行榜过滤选项
export interface LeaderboardFilter {
  difficulty: string | null;
  limit: number;
  sortBy: 'time' | 'date';
  sortDirection: 'asc' | 'desc';
}

