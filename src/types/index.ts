export type CellState = 0 | 1 | 2; // 0=未揭示, 1=已揭示, 2=标记为地雷
export type RevealedType = CellState[][];

export type BoardType = readonly number[][];

export interface GameState {
  board: BoardType;
  revealed: RevealedType;
  gameOver: number; // 0=进行中, 1=胜利, -1=失败
  timer: number; // 游戏计时器
  total: number; // 总格子数
  mines: number; // 地雷数
  revealedCount: number; // 已揭示的格子数
  flaggedCount: number; // 已标记的地雷数
}

export interface ModalState {
  type: string;
  title: string;
  visible: boolean;
  hiddenBtn: boolean;
  message?: string;
}