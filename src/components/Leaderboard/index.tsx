import { useEffect } from 'react';
import { useLeaderboard } from '@/hooks';
import type { LeaderboardItem } from '@/types/leaderboard';

// 导入SVG图标
import { ReactComponent as PlayerIcon } from '@/assets/icons/leaderBoard/player.svg';
import { ReactComponent as EasyIcon } from '@/assets/icons/leaderBoard/easy.svg';
import { ReactComponent as MediumIcon } from '@/assets/icons/leaderBoard/medium.svg';
import { ReactComponent as HardIcon } from '@/assets/icons/leaderBoard/hard.svg';
import { ReactComponent as SortIcon } from '@/assets/icons/leaderBoard/sort.svg';
import { ReactComponent as TrashIcon } from '@/assets/icons/leaderBoard/trash.svg';
import { ReactComponent as RankIcon } from '@/assets/icons/leaderBoard/rank.svg';
import { ReactComponent as DifficultyIcon } from '@/assets/icons/leaderBoard/difficulty.svg';
import { ReactComponent as TimeIcon } from '@/assets/icons/leaderBoard/time.svg';
import { ReactComponent as DateIcon } from '@/assets/icons/leaderBoard/date.svg';
import { ReactComponent as EmptyBoxIcon } from '@/assets/icons/leaderBoard/empty-box.svg';

interface LeaderboardProps {
  onClose?: () => void;
  // onNameSave?: (name: string) => void;
  // showNameInput?: boolean;
  activeTab?: string;
}

const Leaderboard: React.FC<LeaderboardProps> = ({
  onClose,
  // onNameSave,
  // showNameInput = true,
  activeTab = 'all'
}) => {
  // 使用自定义钩子
  const {
    leaderboard,
    filter,
    updateFilter,
    clearRecords,
    formatDifficulty,
    formatTime,
    formatDate
  } = useLeaderboard();

  // 编辑玩家名称状态
  // const [editName, setEditName] = useState(showNameInput);
  // const [nameInput, setNameInput] = useState(playerName);

  // 当传入的activeTab变化时，更新过滤器
  useEffect(() => {
    if (activeTab === 'all') {
      updateFilter({ difficulty: null });
    } else if (['easy', 'medium', 'hard'].includes(activeTab)) {
      updateFilter({ difficulty: activeTab });
    }
  }, [activeTab, updateFilter]);

  // 保存玩家名称
  // const handleSaveName = () => {
  //   savePlayerName(nameInput);
  //   setEditName(false);
  //   if (onNameSave) {
  //     onNameSave(nameInput);
  //   }
  // };

  // 渲染排行榜项
  const renderLeaderboardItem = (item: LeaderboardItem, index: number) => {
    // 根据难度设置颜色
    const getDifficultyBadge = (difficulty: string) => {
      switch(difficulty) {
        case 'easy':
          return <span className="badge badge-success badge-xs text-[10px]">{formatDifficulty(difficulty)}</span>;
        case 'medium':
          return <span className="badge badge-warning badge-xs text-[10px]">{formatDifficulty(difficulty)}</span>;
        case 'hard':
          return <span className="badge badge-error badge-xs text-[10px]">{formatDifficulty(difficulty)}</span>;
        default:
          return <span className="badge badge-ghost badge-xs text-[10px]">{formatDifficulty(difficulty)}</span>;
      }
    };

    // 为前三名添加特殊样式
    const getRankStyle = (rank: number) => {
      if (rank === 0) return "font-bold text-amber-500";
      if (rank === 1) return "font-bold text-slate-400";
      if (rank === 2) return "font-bold text-amber-700";
      return "";
    };

    // 根据排名添加特殊行样式
    const getRowClass = (rank: number) => {
      if (rank === 0) return "rank-first";
      if (rank === 1) return "rank-second";
      if (rank === 2) return "rank-third";
      return "hover";
    };

    return (
      <tr key={item.id} className={getRowClass(index)}>
        <td className="py-1 text-center">
          <span className={`${getRankStyle(index)} text-xs`}>
            {index < 3 ?
              <div className="flex justify-center items-center">
                <div className="w-4 h-4 flex items-center justify-center">
                  {index === 0 && <span className="text-sm">🥇</span>}
                  {index === 1 && <span className="text-sm">🥈</span>}
                  {index === 2 && <span className="text-sm">🥉</span>}
                </div>
              </div> :
              index + 1
            }
          </span>
        </td>
        <td className="py-1 text-xs">
          <div className="flex items-center gap-1">
            <div className="avatar placeholder">
              <div className="bg-neutral-focus text-neutral-content rounded-full w-4 h-4">
                <span className="text-[9px]">{item.playerName.charAt(0).toUpperCase()}</span>
              </div>
            </div>
            <span>{item.playerName}</span>
          </div>
        </td>
        <td className="py-1 text-center">{getDifficultyBadge(item.difficulty)}</td>
        <td className="py-1 text-center font-mono text-xs">
          <div className="flex items-center justify-center">
            <span>{formatTime(item.time)}</span>
          </div>
        </td>
        <td className="py-1 text-center hidden sm:table-cell text-xs">
          <span>{item.mines}</span>
        </td>
        <td className="py-1 text-center hidden md:table-cell text-[10px] opacity-70">{formatDate(item.date)}</td>
      </tr>
    );
  };

  // 当没有数据时显示的内容
  const renderEmptyState = () => {
    return (
      <tr>
        <td colSpan={6} className="py-4 text-center text-base-content/60">
          <div className="flex flex-col items-center gap-2 py-3">
            <div className="mask mask-squircle bg-base-200 p-3">
              <EmptyBoxIcon className="h-10 w-10 opacity-30" />
            </div>
            <div className="text-center">
              <p className="text-sm font-medium mb-1">暂无记录</p>
              <p className="text-xs opacity-70">
                完成游戏来创建排行榜记录
                <span className="inline-block ml-1 animate-bounce">🎮</span>
              </p>
            </div>
          </div>
        </td>
      </tr>
    );
  };

  // 处理清除记录
  const handleClearRecords = () => {
    if (confirm('确定要清除所有记录吗？此操作无法撤销。')) {
      clearRecords(filter.difficulty || undefined);
    }
  };

  return (
    <div className="w-full animate-fadeIn">
      {/* 标题栏 */}
      <div className="flex justify-between items-center mb-3">
        {/* <div className="flex items-center gap-2">
          <TrophyIcon className="w-6 h-6 text-yellow-400" />
          <h3 className="text-xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">扫雷排行榜</h3>
        </div> */}
        <div className="flex gap-2">
          {onClose && (
            <button
              className="btn btn-sm btn-circle btn-ghost"
              onClick={onClose}
              aria-label="关闭"
            >
              ✕
            </button>
          )}
        </div>
      </div>

      {/* 玩家名称编辑
      {(showNameInput || editName) && (
        <div className="mb-3 bg-base-200/30 rounded-lg p-2">
          <div className="flex items-center gap-2 flex-wrap">
            <div className="badge badge-xs badge-primary">玩家名</div>
            <input
              type="text"
              className="input input-xs input-bordered flex-1 min-w-[120px] focus:input-primary"
              value={nameInput}
              onChange={e => setNameInput(e.target.value)}
              placeholder="输入你的名字"
              maxLength={16}
            />
            <button
              className="btn btn-primary btn-sm gap-1"
              onClick={handleSaveName}
              disabled={!nameInput.trim()}
            >
              <SaveIcon className="h-3 w-3" />
              保存
            </button>
          </div>
        </div>
      )} */}

      {/* 难度选项卡 */}
      <div className="tabs tabs-boxed bg-base-200/50 rounded-lg justify-center p-2 mb-3 gap-1">
        <button
          className={`tab tab-sm ${filter.difficulty === null ? 'tab-active bg-primary text-primary-content font-medium' : ''}`}
          onClick={() => updateFilter({ difficulty: null })}
        >
          全部
        </button>
        <button
          className={`tab tab-sm ${filter.difficulty === 'easy' ? 'tab-active bg-success text-success-content font-medium' : ''}`}
          onClick={() => updateFilter({ difficulty: 'easy' })}
        >
          <EasyIcon className="h-3 w-3 mr-1" />
          简单
        </button>
        <button
          className={`tab tab-sm ${filter.difficulty === 'medium' ? 'tab-active bg-warning text-warning-content font-medium' : ''}`}
          onClick={() => updateFilter({ difficulty: 'medium' })}
        >
          <MediumIcon className="h-3 w-3 mr-1" />
          中等
        </button>
        <button
          className={`tab tab-sm ${filter.difficulty === 'hard' ? 'tab-active bg-error text-error-content font-medium' : ''}`}
          onClick={() => updateFilter({ difficulty: 'hard' })}
        >
          <HardIcon className="h-3 w-3 mr-1" />
          困难
        </button>
      </div>

      {/* 排序和工具按钮 */}
      <div className="flex flex-wrap justify-between items-center p-2 mb-3 bg-base-200/30 rounded-lg">
        <div className="join">
          <span className="join-item flex items-center px-2 bg-base-300/70 text-xs font-medium rounded-l-lg break-keep">
            <SortIcon className="h-3 w-3 mr-1" />
            排序
          </span>
          <select
            className="select select-xs select-bordered join-item rounded-r-lg focus:outline-primary"
            value={`${filter.sortBy}-${filter.sortDirection}`}
            onChange={(e) => {
              const [sortBy, sortDirection] = e.target.value.split('-');
              updateFilter({
                sortBy: sortBy as 'time' | 'date',
                sortDirection: sortDirection as 'asc' | 'desc'
              });
            }}
          >
            <option value="time-asc">时间 (快到慢)</option>
            <option value="time-desc">时间 (慢到快)</option>
            <option value="date-desc">日期 (最新)</option>
            <option value="date-asc">日期 (最早)</option>
          </select>
        </div>

        <div>
          <button
            className="btn btn-xs btn-error btn-outline gap-1"
            onClick={handleClearRecords}
          >
            <TrashIcon className="h-3 w-3" />
            清除记录
          </button>
        </div>
      </div>

      {/* 排行榜表格 */}
      <div className="overflow-x-auto rounded-lg border border-base-300/50">
        <table className="table table-zebra table-xs">
          <thead className="bg-base-200/70 text-base-content/80">
            <tr>
              <th className="py-2 text-center w-8">
                <div className="tooltip tooltip-right" data-tip="排名">
                  <RankIcon className="h-3 w-3" />
                </div>
              </th>
              <th className="py-2">
                <div className="flex items-center gap-1">
                  <PlayerIcon className="h-3 w-3" />
                  <span className="text-xs">玩家</span>
                </div>
              </th>
              <th className="py-2 text-center">
                <div className="flex items-center justify-center gap-1">
                  <DifficultyIcon className="h-3 w-3" />
                  <span className="text-xs">难度</span>
                </div>
              </th>
              <th className="py-2 text-center">
                <div className="flex items-center justify-center gap-1">
                  <TimeIcon className="h-3 w-3" />
                  <span className="text-xs">时间</span>
                </div>
              </th>
              <th className="py-2 text-center hidden sm:table-cell">
                <div className="flex items-center justify-center gap-1">
                  <HardIcon className="h-3 w-3" />
                  <span className="text-xs">雷数</span>
                </div>
              </th>
              <th className="py-2 text-center hidden md:table-cell">
                <div className="flex items-center justify-center gap-1">
                  <DateIcon className="h-3 w-3" />
                  <span className="text-xs">日期</span>
                </div>
              </th>
            </tr>
          </thead>
          <tbody className="table-row-animate">
            {leaderboard.length > 0 ? leaderboard.map(renderLeaderboardItem) : renderEmptyState()}
          </tbody>
        </table>
      </div>

      {/* 底部提示 */}
      <div className="mt-3 text-center flex justify-center items-center gap-2">
        <div className="badge badge-xs badge-neutral">
          共 {leaderboard.length} 条记录
        </div>
        {leaderboard.length > 0 && (
          <div className="badge badge-xs badge-outline">
            显示前 {Math.min(filter.limit, leaderboard.length)} 条
          </div>
        )}
      </div>
    </div>
  );
};

export default Leaderboard;
