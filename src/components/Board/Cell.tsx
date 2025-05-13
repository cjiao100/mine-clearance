type CellState = 0 | 1 | 2;

interface CellProps {
  value: number;
  state: CellState;
  onClick: () => void;
  onContextMenu: (e: React.MouseEvent) => void;
}

// 根据数字获取对应颜色类名
const getCellColorClass = (value: number): string => {
  const colors = [
    "", "text-blue-600", "text-green-600", "text-red-600",
    "text-purple-800", "text-red-800", "text-teal-600", "text-black", "text-gray-600"
  ];
  return colors[value] || "";
};

const Cell: React.FC<CellProps> = ({ value, state, onClick, onContextMenu }) => {
  const isRevealed = state === 1;
  const isFlagged = state === 2;

  return (
    <div
      className={`w-8 h-8 border flex items-center justify-center text-primary-content cursor-pointer bg-primary ${isRevealed && "bg-primary-content"}`}
      onClick={onClick}
      onContextMenu={onContextMenu}
    >
      {isRevealed && value > 0 && (
        <span className={`font-bold ${getCellColorClass(value)}`}>
          {value}
        </span>
      )}
      {isFlagged && <span>🚩</span>}
    </div>
  );
}

export default Cell;