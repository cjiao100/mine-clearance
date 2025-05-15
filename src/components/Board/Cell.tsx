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

  return (
    <div
      className={`
        board-cell
        ${isRevealed
          ? (isMine ? 'cell-revealed bg-error/30 animate-reveal' : 'cell-revealed animate-reveal')
          : (isFlagged ? 'cell-hidden bg-warning/20' : 'cell-hidden')
        }
      `}
      onClick={onClick}
      onContextMenu={onContextMenu}
    >
      {isRevealed && value > 0 && (
        <span className={`text-xl ${getCellColorClass(value)} animate-reveal`}>
          {value}
        </span>
      )}
      {isMine && (
        <span className="text-xl cell-mine animate-pulse">💣</span>
      )}
      {isFlagged && <span className="text-xl cell-flag animate-bounce-small">🚩</span>}
    </div>
  );
}

export default Cell;