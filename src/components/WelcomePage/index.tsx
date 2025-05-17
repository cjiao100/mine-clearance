import React from 'react';
import { ReactComponent as RevealIcon } from '@/assets/icons/welcomePage/reveal.svg';
import { ReactComponent as FlagIcon } from '@/assets/icons/welcomePage/flag.svg';
import { ReactComponent as WinIcon } from '@/assets/icons/welcomePage/win.svg';
import { ReactComponent as SafeIcon } from '@/assets/icons/welcomePage/safe.svg';
import { ReactComponent as LeaderboardIcon } from '@/assets/icons/welcomePage/leaderboard.svg';

interface WelcomePageProps {
  onStartGame: (difficulty: string) => void;
  onShowLeaderboard: () => void;
}

// 根据数字返回对应颜色类名
const getNumberColor = (num: number): React.ReactNode => {
  const colors = [
    'text-blue-600',      // 1
    'text-green-600',     // 2
    'text-red-600',       // 3
    'text-purple-700',    // 4
    'text-yellow-700',    // 5
    'text-teal-600',      // 6
    'text-black',         // 7
    'text-gray-600'       // 8
  ];

  return <span className={colors[num - 1] || ''}>{num}</span>;
};

const WelcomePage: React.FC<WelcomePageProps> = ({
  onStartGame,
  onShowLeaderboard,
}) => {
  return (
    <div className="flex flex-col items-center justify-center p-4 space-y-8 max-w-3xl mx-auto animate-fadeIn">
      {/* 游戏标题和Logo */}
      <div className="text-center bg-base-100 p-6 rounded-xl shadow-xl w-full">
        <div className="flex justify-center my-4">
          <div className="grid grid-cols-3 gap-1 transition-transform hover:scale-110 duration-300">
            {[1, 2, -1, 1, 2, 1, 0, 0, 0].map((value, i) => (
              <div
                key={i}
                className={`w-8 h-8 md:w-12 md:h-12 flex items-center justify-center border shadow-md ${
                  value === -1
                    ? 'bg-error text-white'
                    : value === 0
                    ? 'bg-base-200'
                    : 'bg-base-100'
                } ${i === 4 ? 'animate-pulse duration-2000' : ''}`}
              >
                {value > 0 && <span className="font-bold">{getNumberColor(value)}</span>}
                {value === -1 && <span className="text-lg">💣</span>}
              </div>
            ))}
          </div>
        </div>
        <p className="text-base-content/70 italic">挑战扫雷，考验你的逻辑推理能力</p>
      </div>

      {/* 游戏介绍 */}
      <div className="card bg-base-100 shadow-xl w-full">
        <div className="card-body">
          <h2 className="card-title text-xl font-bold text-primary">游戏规则</h2>
          <ul className="space-y-2 mt-2">
            <li className="flex items-center">
              <div className="rounded-full bg-primary/20 p-1 mr-2">
                <RevealIcon className="h-5 w-5" />
              </div>
              左键点击格子进行揭示
            </li>
            <li className="flex items-center">
              <div className="rounded-full bg-secondary/20 p-1 mr-2">
                <FlagIcon className="h-5 w-5" />
              </div>
              右键点击格子标记地雷
            </li>
            <li className="flex items-center">
              <div className="rounded-full bg-accent/20 p-1 mr-2">
                <WinIcon className="h-5 w-5" />
              </div>
              揭示所有非地雷格子获胜
            </li>
            <li className="flex items-center">
              <div className="rounded-full bg-success/20 p-1 mr-2 text-success">
                <SafeIcon className="h-5 w-5" />
              </div>
              <span className="font-medium">第一次点击永远是安全的！</span>
            </li>
          </ul>
        </div>
      </div>

      {/* 难度选择 */}
      <div className="card bg-base-100 shadow-xl w-full">
        <div className="card-body">
          <h2 className="card-title text-xl font-bold text-secondary mb-4">选择难度</h2>
          <div className="flex flex-col md:flex-row gap-4 justify-center">
            <button
              onClick={() => onStartGame('easy')}
              className="btn btn-primary btn-lg shadow-md hover:shadow-lg transition-all transform hover:-translate-y-1"
            >
              <div className="flex flex-col items-center">
                <span className="text-lg font-bold">简单模式</span>
                <span className="text-sm opacity-80">10×10 网格，10 个地雷</span>
              </div>
            </button>

            <button
              onClick={() => onStartGame('medium')}
              className="btn btn-secondary btn-lg shadow-md hover:shadow-lg transition-all transform hover:-translate-y-1"
            >
              <div className="flex flex-col items-center">
                <span className="text-lg font-bold">中等模式</span>
                <span className="text-sm opacity-80">16×16 网格，40 个地雷</span>
              </div>
            </button>

            <button
              onClick={() => onStartGame('hard')}
              className="btn btn-accent btn-lg shadow-md hover:shadow-lg transition-all transform hover:-translate-y-1"
            >
              <div className="flex flex-col items-center">
                <span className="text-lg font-bold">困难模式</span>
                <span className="text-sm opacity-80">30×16 网格，99 个地雷</span>
              </div>
            </button>
          </div>
        </div>
      </div>

      {/* 其他功能入口 */}
      <div className="flex gap-4 justify-center mt-2">
        <button
          onClick={onShowLeaderboard}
          className="btn btn-outline btn-primary gap-2"
        >
          <LeaderboardIcon className="h-5 w-5" />
          查看排行榜
        </button>
      </div>
    </div>
  );
};

export default WelcomePage;
