import React from 'react';
import { useAudio } from '@/contexts/AudioContext';

type CellState = 0 | 1 | 2;

interface CellProps {
  value: number;
  state: CellState;
  onClick: () => void;
  onContextMenu: (e: React.MouseEvent) => void;
}

// 根据数字获取对应颜色类名
const getCellColorClass = (value: number): string => {
  return value > 0 && value <= 8 ? `cell-number-${value}` : "";
};

const Cell: React.FC<CellProps> = ({ value, state, onClick, onContextMenu }) => {
  const isRevealed = state === 1;
  const isFlagged = state === 2;
  const isMine = isRevealed && value === -1;

  // 获取音效函数
  const audio = useAudio();

  // 触摸长按定时器引用
  const touchTimeoutRef = React.useRef<ReturnType<typeof setTimeout> | null>(null);
  
  // 自定义点击处理
  const handleClick = () => {
    if (!isRevealed && !isFlagged) {
      // 根据点击内容播放不同音效
      if (value === -1) {
        // 如果点击到的是地雷
        if (audio.playExplosionSound) audio.playExplosionSound();
      } else {
        if (audio.playClickSound) audio.playClickSound();
      }
      onClick();
    }
  };
  
  // 自定义右键点击处理
  const handleRightClick = (e: React.MouseEvent) => {
    if (!isRevealed) {
      // 不在这里播放旗标音效，因为已在useMineSweeper中处理
      onContextMenu(e);
    }
  };

  // 使用键盘访问格子
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      handleClick();
    } else if (e.key === 'f' || e.key === 'F') {
      e.preventDefault();
      // 模拟右键点击旗标功能
      const fakeEvent = new MouseEvent('contextmenu', { bubbles: true });
      handleRightClick(fakeEvent as unknown as React.MouseEvent);
    }
  };

  // 处理触摸开始事件，为移动设备启动长按定时器
  const handleTouchStart = () => {
    if (touchTimeoutRef.current) clearTimeout(touchTimeoutRef.current);

    touchTimeoutRef.current = setTimeout(() => {
      // 模拟右键点击
      const fakeEvent = new MouseEvent('contextmenu', { bubbles: true });
      handleRightClick(fakeEvent as unknown as React.MouseEvent);
    }, 500); // 500毫秒长按触发右键操作
  };

  // 处理触摸结束事件，清除长按定时器
  const handleTouchEnd = () => {
    if (touchTimeoutRef.current) {
      clearTimeout(touchTimeoutRef.current);
      touchTimeoutRef.current = null;
    }
  };

  // 组件卸载时清理定时器
  React.useEffect(() => {
    return () => {
      if (touchTimeoutRef.current) {
        clearTimeout(touchTimeoutRef.current);
      }
    };
  }, []);

  return (
    <div
      className={`
        board-cell
        ${isRevealed
          ? (isMine
              ? 'cell-revealed bg-error/30 dark:bg-error/40 animate-reveal'
              : 'cell-revealed animate-reveal')
          : (isFlagged
              ? 'cell-hidden bg-warning/20 dark:bg-warning/30'
              : 'cell-hidden')
        }
        touch:active:scale-90
        focus:outline-none focus:ring-2 focus:ring-primary/50 focus:z-10
      `}
      onClick={handleClick}
      onContextMenu={handleRightClick}
      onKeyDown={handleKeyDown}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
      onTouchCancel={handleTouchEnd}
      aria-label={isMine ? "地雷" : isFlagged ? "旗标" : isRevealed && value > 0 ? `周围有${value}个地雷` : "未翻开"}
      role="button"
      tabIndex={0}
    >
      {isRevealed && !isMine && value > 0 && (
        <span className={`font-bold ${getCellColorClass(value)}`}>
          {value}
        </span>
      )}
      {isRevealed && isMine && (
        <span className="text-lg">💣</span>
      )}
      {isFlagged && !isRevealed && (
        <span className="text-md">🚩</span>
      )}
    </div>
  );
};

export default Cell;