import React from 'react';

// 游戏统计数据接口
interface GameStatsProps {
  totalGames: number;
  wins: number;
  losses: number;
  bestTime: number;
  averageTime: number;
  streakWins: number;
  lastPlayed: string;
}

const GameStats: React.FC<GameStatsProps> = ({
  totalGames,
  wins,
  losses,
  bestTime,
  // averageTime,
  streakWins,
  lastPlayed
}) => {
  // 计算胜率
  const winRate = totalGames > 0 ? Math.round((wins / totalGames) * 100) : 0;

  return (
    <div className="mt-2 bg-base-100 p-4 rounded-lg shadow-sm">
      <h3 className="text-lg font-semibold mb-3">游戏统计</h3>

      <div className="stats stats-vertical shadow w-full">
        <div className="stat">
          <div className="stat-title">总游戏</div>
          <div className="stat-value">{totalGames}</div>
        </div>

        <div className="stat">
          <div className="stat-title">胜率</div>
          <div className="stat-value text-success">{winRate}%</div>
          <div className="stat-desc">{wins}胜 / {losses}负</div>
        </div>

        <div className="stat">
          <div className="stat-title">最佳时间</div>
          <div className="stat-value text-primary">{bestTime > 0 ? `${bestTime}秒` : '无记录'}</div>
        </div>

        <div className="stat">
          <div className="stat-title">连胜</div>
          <div className="stat-value">{streakWins}</div>
        </div>
      </div>

      <div className="text-xs text-base-content/60 mt-4">
        {lastPlayed ? `上次游戏: ${lastPlayed}` : '还没有游戏记录'}
      </div>

      <div className="mt-3">
        <button className="btn btn-sm btn-outline w-full">查看完整统计</button>
      </div>
    </div>
  );
};

export default GameStats;
