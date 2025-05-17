import ThemeToggle from "@/components/ThemeToggle";
import type { GameStatus } from "@/types";
import { useState } from "react";

// 定义侧边栏接口，可根据需要调整
interface SidePanelProps {

  gameStatus?: GameStatus;
  boardInfo?: {
    width: number;
    height: number;
    mines: number;
  };
  gameStats?: {
    wins: number;
    losses: number;
    bestTime: number;
  };
  onStartGame?: (difficulty: string) => void;
  onResetGame?: () => void;
  onPauseGame?: () => void;
  onResumeGame?: () => void;
  onShowRules?: () => void;
  onShowLeaderboard?: () => void;
}

const SidePanel: React.FC<SidePanelProps> = ({
  gameStatus = 'idle',
  boardInfo = { width: 10, height: 10, mines: 10 },
  gameStats = { wins: 0, losses: 0, bestTime: 0 },
  onStartGame,
  onResetGame,
  onPauseGame,
  onResumeGame,
  onShowRules,
  onShowLeaderboard
}) => {
  const [activeDifficulty, setActiveDifficulty] = useState('简单');

  // 处理难度选择
  const handleDifficultySelect = (difficulty: string) => {
    setActiveDifficulty(difficulty);
    onStartGame?.(difficulty.toLowerCase());
  };

  return (
    <div className="w-72 shadow-lg min-h-full bg-base-200 p-4 flex flex-col relative">
      {/* 游戏标题 */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-center">
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-primary to-secondary">扫雷游戏</span>
        </h1>
      </div>

      {/* 游戏控制区 */}
      <div className="card bg-base-100 shadow-sm mb-4">
        <div className="card-body p-4">
          <h2 className="card-title text-base mb-2 flex justify-between items-center">
            游戏控制
            <span className={`badge ${
              gameStatus === 'playing' ? 'badge-success' :
              gameStatus === 'paused' ? 'badge-warning' :
              gameStatus === 'won' ? 'badge-primary' :
              gameStatus === 'lost' ? 'badge-error' : 'badge-neutral'
            }`}>
              {
                gameStatus === 'playing' ? '进行中' :
                gameStatus === 'paused' ? '已暂停' :
                gameStatus === 'won' ? '胜利' :
                gameStatus === 'lost' ? '失败' : '未开始'
              }
            </span>
          </h2>

          {/* 游戏按钮组 */}
          <div className="flex flex-wrap gap-2 mt-2">
            {gameStatus === 'playing' ? (
              <button
                className="btn btn-sm btn-warning flex-1"
                onClick={onPauseGame}
              >
                暂停
              </button>
            ) : gameStatus === 'paused' ? (
              <button
                className="btn btn-sm btn-success flex-1"
                onClick={onResumeGame}
              >
                继续
              </button>
            ) : null}

            <button
              className="btn btn-sm btn-primary flex-1"
              onClick={onResetGame}
            >
              {gameStatus === 'idle' ? '开始游戏' : '重新开始'}
            </button>
          </div>
        </div>
      </div>

      {/* 难度选择 */}
      <div className="card bg-base-100 shadow-sm mb-4">
        <div className="card-body p-4">
          <h2 className="card-title text-base mb-2">难度设置</h2>
          <div className="grid grid-cols-3 gap-2">
            <button
              className={`btn btn-sm ${activeDifficulty === 'easy' ? 'btn-primary' : 'btn-outline'}`}
              onClick={() => handleDifficultySelect('easy')}
            >
              简单
            </button>
            <button
              className={`btn btn-sm ${activeDifficulty === 'medium' ? 'btn-secondary' : 'btn-outline'}`}
              onClick={() => handleDifficultySelect('medium')}
            >
              中等
            </button>
            <button
              className={`btn btn-sm ${activeDifficulty === 'hard' ? 'btn-accent' : 'btn-outline'}`}
              onClick={() => handleDifficultySelect('hard')}
            >
              困难
            </button>
          </div>
        </div>
      </div>

      {/* 棋盘信息 */}
      <div className="card bg-base-100 shadow-sm mb-4">
        <div className="card-body p-4">
          <h2 className="card-title text-base mb-2">棋盘信息</h2>
          <div className="grid grid-cols-3 gap-2 text-center">
            <div className="flex flex-col items-center">
              <div className="bg-base-200 w-10 h-10 rounded-lg flex items-center justify-center font-mono text-lg shadow-inner">
                {boardInfo.width}
              </div>
              <span className="text-xs mt-1">宽度</span>
            </div>
            <div className="flex flex-col items-center">
              <div className="bg-base-200 w-10 h-10 rounded-lg flex items-center justify-center font-mono text-lg shadow-inner">
                {boardInfo.height}
              </div>
              <span className="text-xs mt-1">高度</span>
            </div>
            <div className="flex flex-col items-center">
              <div className="bg-error/20 w-10 h-10 rounded-lg flex items-center justify-center font-mono text-lg shadow-inner">
                {boardInfo.mines}
              </div>
              <span className="text-xs mt-1">地雷数</span>
            </div>
          </div>
        </div>
      </div>

      {/* 游戏统计 */}
      <div className="card bg-base-100 shadow-sm mb-4">
        <div className="card-body p-4">
          <h2 className="card-title text-base mb-2">游戏统计</h2>
          <div className="stats stats-vertical shadow bg-base-200">
            <div className="stat p-2">
              <div className="stat-title text-xs">胜率</div>
              <div className="stat-value text-lg">
                {gameStats.wins + gameStats.losses > 0
                  ? Math.round(gameStats.wins / (gameStats.wins + gameStats.losses) * 100)
                  : 0}%
              </div>
            </div>
            <div className="stat p-2">
              <div className="stat-title text-xs">获胜场次</div>
              <div className="stat-value text-lg text-success">{gameStats.wins}</div>
            </div>
            <div className="stat p-2">
              <div className="stat-title text-xs">失败场次</div>
              <div className="stat-value text-lg text-error">{gameStats.losses}</div>
            </div>
            <div className="stat p-2">
              <div className="stat-title text-xs">最佳时间</div>
              <div className="stat-value text-lg text-primary">{gameStats.bestTime > 0 ? `${gameStats.bestTime}s` : '-'}</div>
            </div>
          </div>
        </div>
      </div>

      {/* 帮助和排行榜按钮 */}
      <div className="card bg-base-100 shadow-sm mb-auto">
        <div className="card-body p-4">
          <div className="flex gap-2">
            <button
              className="btn btn-sm btn-ghost flex-1"
              onClick={onShowRules}
            >
              游戏规则
            </button>
            <button
              className="btn btn-sm btn-ghost flex-1"
              onClick={onShowLeaderboard}
            >
              排行榜
            </button>
          </div>
        </div>
      </div>

      {/* 主题切换按钮 */}
      <div className="mt-4 flex justify-center">
        <ThemeToggle />
      </div>
    </div>
  );
};

export default SidePanel;