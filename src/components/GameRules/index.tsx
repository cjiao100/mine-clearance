import { ReactComponent as DifficultyIcon } from '@/assets/icons/GameRules/difficulty.svg';
import { ReactComponent as TimerIcon } from '@/assets/icons/GameRules/timer.svg';
import { ReactComponent as ClickIcon } from '@/assets/icons/GameRules/click.svg';
import { ReactComponent as FlagIcon } from '@/assets/icons/GameRules/flag.svg';
import { ReactComponent as LeaderboardIcon } from '@/assets/icons/GameRules/leaderboard.svg';
import { ReactComponent as RestartIcon } from '@/assets/icons/GameRules/restart.svg';
import { ReactComponent as TipIcon } from '@/assets/icons/GameRules/tip.svg';

const GameRules: React.FC = () => {
  return (
    <div className="space-y-6 px-2 py-3 animate-fadeIn">
      <div className="text-center mb-4">
        <h2 className="text-2xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">游戏规则</h2>
        <div className="h-1 w-24 bg-gradient-to-r from-primary to-secondary rounded-full mx-auto mt-2"></div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* 规则卡片1 - 开始游戏 */}
        <div className="card bg-base-200 shadow-md hover:shadow-lg transition-all">
          <div className="card-body p-4">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 rounded-full bg-primary/15 flex items-center justify-center">
                <DifficultyIcon className="h-6 w-6 text-primary" />
              </div>
              <h3 className="card-title text-primary text-lg">选择难度</h3>
            </div>
            <p className="text-base-content/80">游戏开始，玩家可选择难度（简单、中等、困难），难度决定棋盘大小和地雷数量。</p>
          </div>
        </div>

        {/* 规则卡片2 - 游戏界面 */}
        <div className="card bg-base-200 shadow-md hover:shadow-lg transition-all">
          <div className="card-body p-4">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 rounded-full bg-secondary/15 flex items-center justify-center">
                <TimerIcon className="h-6 w-6 text-secondary" />
              </div>
              <h3 className="card-title text-secondary text-lg">计时与信息</h3>
            </div>
            <p className="text-base-content/80">游戏开始后，随机在棋盘上放置地雷，并开始计时，玩家可以查看剩余地雷数和已用时间。</p>
          </div>
        </div>

        {/* 规则卡片3 - 点击规则 */}
        <div className="card bg-base-200 shadow-md hover:shadow-lg transition-all">
          <div className="card-body p-4">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 rounded-full bg-accent/15 flex items-center justify-center">
                <ClickIcon className="h-6 w-6 text-accent" />
              </div>
              <h3 className="card-title text-accent text-lg">揭示格子</h3>
            </div>
            <p className="text-base-content/80">玩家左键点击单元格，如果点击到地雷，游戏结束；如果点击到空白单元格，显示周围地雷的数量。<strong>第一次点击永远安全！</strong></p>
          </div>
        </div>

        {/* 规则卡片4 - 标记地雷 */}
        <div className="card bg-base-200 shadow-md hover:shadow-lg transition-all">
          <div className="card-body p-4">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 rounded-full bg-info/15 flex items-center justify-center">
                <FlagIcon className="h-6 w-6 text-info" />
              </div>
              <h3 className="card-title text-info text-lg">标记地雷</h3>
            </div>
            <p className="text-base-content/80">玩家可以右键点击单元格进行标记，以标识可能存在地雷的位置。</p>
          </div>
        </div>

        {/* 规则卡片5 - 排行榜 */}
        <div className="card bg-base-200 shadow-md hover:shadow-lg transition-all">
          <div className="card-body p-4">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 rounded-full bg-success/15 flex items-center justify-center">
                <LeaderboardIcon className="h-6 w-6 text-success" />
              </div>
              <h3 className="card-title text-success text-lg">排行榜</h3>
            </div>
            <p className="text-base-content/80">游戏获胜后，玩家的成绩将被记录到排行榜，可以查看自己的排名和其他玩家的成绩。</p>
          </div>
        </div>

        {/* 规则卡片6 - 重新开始 */}
        <div className="card bg-base-200 shadow-md hover:shadow-lg transition-all">
          <div className="card-body p-4">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 rounded-full bg-warning/15 flex items-center justify-center">
                <RestartIcon className="h-6 w-6 text-warning" />
              </div>
              <h3 className="card-title text-warning text-lg">重新开始</h3>
            </div>
            <p className="text-base-content/80">玩家可以随时选择不同的难度重新开始游戏，挑战自我。</p>
          </div>
        </div>
      </div>

      {/* 小提示 */}
      <div className="alert alert-info shadow-lg mt-2">
        <TipIcon className="h-6 w-6 flex-shrink-0" />
        <div>
          <h3 className="font-bold">小提示</h3>
          <div className="text-xs">数字表示周围八个格子中地雷的数量，利用这些数字可以推理出地雷的位置。</div>
        </div>
      </div>
    </div>
  );
}

export default GameRules;