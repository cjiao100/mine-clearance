import { useState, useEffect } from 'react';
import { useLeaderboard } from '@/hooks';
import type { LeaderboardItem } from '@/types/leaderboard';

interface LeaderboardProps {
  onClose?: () => void;
  onNameSave?: (name: string) => void;
  showNameInput?: boolean;
  activeTab?: string;
}

const Leaderboard: React.FC<LeaderboardProps> = ({
  onClose,
  onNameSave,
  showNameInput = false,
  activeTab = 'all'
}) => {
  // 使用自定义钩子
  const {
    leaderboard,
    playerName,
    filter,
    updateFilter,
    savePlayerName,
    clearRecords,
    formatDifficulty,
    formatTime,
    formatDate
  } = useLeaderboard();

  // 编辑玩家名称状态
  const [editName, setEditName] = useState(showNameInput);
  const [nameInput, setNameInput] = useState(playerName);

  // 当传入的activeTab变化时，更新过滤器
  useEffect(() => {
    if (activeTab === 'all') {
      updateFilter({ difficulty: null });
    } else if (['easy', 'medium', 'hard'].includes(activeTab)) {
      updateFilter({ difficulty: activeTab });
    }
  }, [activeTab, updateFilter]);

  // 保存玩家名称
  const handleSaveName = () => {
    savePlayerName(nameInput);
    setEditName(false);
    if (onNameSave) {
      onNameSave(nameInput);
    }
  };

  // 渲染排行榜项
  const renderLeaderboardItem = (item: LeaderboardItem, index: number) => {
    return (
      <tr key={item.id} className={`${index % 2 === 0 ? 'bg-base-100' : 'bg-base-200'}`}>
        <td className="py-2 px-4 text-center">{index + 1}</td>
        <td className="py-2 px-4">{item.playerName}</td>
        <td className="py-2 px-4 text-center">{formatDifficulty(item.difficulty)}</td>
        <td className="py-2 px-4 text-center font-mono">{formatTime(item.time)}</td>
        <td className="py-2 px-4 text-center hidden sm:table-cell">{item.mines}</td>
        <td className="py-2 px-4 text-center hidden md:table-cell text-xs">{formatDate(item.date)}</td>
      </tr>
    );
  };

  // 当没有数据时显示的内容
  const renderEmptyState = () => {
    return (
      <tr>
        <td colSpan={6} className="py-8 text-center text-base-content/60">
          <div className="flex flex-col items-center gap-2">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 opacity-40" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
            </svg>
            <p className="text-lg">暂无记录</p>
            <p className="text-sm">完成一局游戏来创建记录</p>
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
    <div className="w-full max-w-3xl mx-auto bg-base-100 rounded-box overflow-hidden">
      {/* 标题栏 */}
      <div className="flex justify-between items-center p-4 bg-base-200">
        <h3 className="text-xl font-bold">🏆 扫雷排行榜</h3>
        <div className="flex gap-2">
          {onClose && (
            <button
              className="btn btn-sm btn-circle"
              onClick={onClose}
              aria-label="关闭"
            >
              ✕
            </button>
          )}
        </div>
      </div>

      {/* 玩家名称编辑 */}
      {(showNameInput || editName) && (
        <div className="p-4 bg-base-200/50 border-b border-base-300">
          <div className="flex items-center gap-3 flex-wrap">
            <span>玩家名称:</span>
            <input
              type="text"
              className="input input-sm input-bordered flex-1 min-w-[150px]"
              value={nameInput}
              onChange={e => setNameInput(e.target.value)}
              placeholder="输入你的名字"
              maxLength={16}
            />
            <button
              className="btn btn-sm btn-primary"
              onClick={handleSaveName}
              disabled={!nameInput.trim()}
            >
              保存
            </button>
          </div>
        </div>
      )}

      {/* 难度选项卡 */}
      <div className="tabs tabs-boxed bg-base-200 rounded-none justify-center p-1 gap-1">
        <button
          className={`tab ${filter.difficulty === null ? 'tab-active' : ''}`}
          onClick={() => updateFilter({ difficulty: null })}
        >
          全部
        </button>
        <button
          className={`tab ${filter.difficulty === 'easy' ? 'tab-active' : ''}`}
          onClick={() => updateFilter({ difficulty: 'easy' })}
        >
          简单
        </button>
        <button
          className={`tab ${filter.difficulty === 'medium' ? 'tab-active' : ''}`}
          onClick={() => updateFilter({ difficulty: 'medium' })}
        >
          中等
        </button>
        <button
          className={`tab ${filter.difficulty === 'hard' ? 'tab-active' : ''}`}
          onClick={() => updateFilter({ difficulty: 'hard' })}
        >
          困难
        </button>
      </div>

      {/* 排序和工具按钮 */}
      <div className="flex flex-wrap justify-between items-center p-2 sm:px-4 bg-base-200/50 border-t border-b border-base-300">
        <div className="flex items-center gap-2">
          <span className="text-sm text-base-content/70 break-keep">排序:</span>
          <select
            className="select select-sm select-bordered"
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
            className="btn btn-sm btn-outline btn-error"
            onClick={handleClearRecords}
          >
            清除记录
          </button>
        </div>
      </div>

      {/* 排行榜表格 */}
      <div className="overflow-x-auto">
        <table className="table table-compact w-full">
          <thead className="bg-base-200">
            <tr>
              <th className="py-3 text-center w-12">排名</th>
              <th className="py-3">玩家</th>
              <th className="py-3 text-center">难度</th>
              <th className="py-3 text-center">时间</th>
              <th className="py-3 text-center hidden sm:table-cell">雷数</th>
              <th className="py-3 text-center hidden md:table-cell">日期</th>
            </tr>
          </thead>
          <tbody>
            {leaderboard.length > 0 ? leaderboard.map(renderLeaderboardItem) : renderEmptyState()}
          </tbody>
        </table>
      </div>

      {/* 底部提示 */}
      <div className="p-3 text-center text-xs text-base-content/50 bg-base-200">
        显示前 {filter.limit} 条记录 · 共 {leaderboard.length} 条记录
      </div>
    </div>
  );
};

export default Leaderboard;
