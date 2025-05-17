import type { GameState } from "@/types";
import Cell from "./Cell";

interface BoardProps {
  gameState: GameState;
  handleCellClick: (row: number, col: number) => void;
  handleCellRightClick: (row: number, col: number) => void;
  difficulty?: string;
}

const Board: React.FC<BoardProps> = ({ 
  gameState, 
  handleCellClick, 
  handleCellRightClick, 
  difficulty = 'easy' 
}) => {
  // 根据难度设置不同的类名
  const boardClassByDifficulty = difficulty === 'hard' 
    ? 'hard-mode' 
    : difficulty === 'medium' 
      ? 'medium-mode'
      : 'easy-mode';

  return (
    <div className={`board-container animate-reveal ${boardClassByDifficulty}`} role="grid" aria-label="扫雷棋盘">
      {/* 这里是棋盘的内容 */}
      <div className="flex flex-col gap-1">
        {/* 根据游戏状态渲染棋盘 */}
        {gameState.board.map((row, rowIndex) => (
          <div key={rowIndex} className="flex gap-1">
            {row.map((cell: number, colIndex: number) => {
              const state = gameState.revealed[rowIndex][colIndex]
              return (
              <Cell
                key={colIndex}
                value={cell}
                state={state}
                onClick={() => handleCellClick(rowIndex, colIndex)}
                onContextMenu={(e) => { e.preventDefault(); handleCellRightClick(rowIndex, colIndex); }}
              />
            )})}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Board;