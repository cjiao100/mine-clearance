import { useEffect, useRef, useState } from 'react';
// import Alter from './components/Alter';
import Modal from './components/Modal';

/**
 * 扫雷游戏
 *
 * 游戏规则：
 * 1. 游戏开始，玩家可选择难度（简单、中等、困难）。
 * 2. 游戏开始后，随机在棋盘上放置地雷，并开始计时，玩家可以查看剩余雷数和已用时间。
 * 3. 玩家点击单元格，如果点击到地雷，游戏结束；如果点击到空白单元格，显示周围地雷的数量。
 * 4. 玩家可以右键点击单元格进行标记。
 * 5. 游戏结束后，玩家可以查看排行榜。
 * 6. 玩家可以选择不同的难度重新开始游戏。
 */


type CellState = 0 | 1 | 2; // 0=未揭示, 1=已揭示, 2=标记为地雷
type RevealedType = CellState[][];

type BoardType = readonly number[][];

interface GameState {
  board: BoardType;
  revealed: RevealedType;
  gameOver: number; // 0=进行中, 1=胜利, -1=失败
  timer: number; // 游戏计时器
  total: number; // 总格子数
  mines: number; // 地雷数
  revealedCount: number; // 已揭示的格子数
  flaggedCount: number; // 已标记的地雷数
}

interface ModalState {
  type: string; // 模态框类型
  title: string; // 模态框标题
  visible: boolean; // 模态框是否可见
  hiddenBtn: boolean; // 是否隐藏按钮
  message?: string; // 模态框消息
}

function App() {
  // 时间对象
  const timerRef = useRef<ReturnType<typeof setInterval>>(null);
  // 游戏状态
  const [gameState, setGameState] = useState<GameState>({
    board: Array(0).fill(Array(0).fill(0)), // 示例棋盘状态
    revealed: Array(0).fill(Array(0).fill(0)), // 跟踪已点击的格子
    gameOver: 0,
    timer: 0,
    total: 0,
    mines: 0,
    revealedCount: 0,
    flaggedCount: 0,
  })
  // 模态框状态
  const [modalState, setModalState] = useState<ModalState>({
    type: 'rules',
    title: '游戏规则',
    visible: false,
    hiddenBtn: false,
    message: '',
  });

  // 根据选择游戏难度设置棋盘
  const setBoard = (difficulty: string) => {
    let rows, cols, mines;
    switch (difficulty) {
      case 'easy':
        rows = 10;
        cols = 10;
        mines = 10;
        break;
      case 'medium':
        rows = 16;
        cols = 16;
        mines = 40;
        break;
      case 'hard':
        rows = 16;
        cols = 30;
        mines = 99;
        break;
      default:
        rows = 10;
        cols = 10;
        mines = 20;
    }
    const board = Array.from({ length: rows }, () => Array(cols).fill(0));
    let mineCount = 0;
    while (mineCount < mines) {
      const row = Math.floor(Math.random() * rows);
      const col = Math.floor(Math.random() * cols);
      if (board[row][col] !== -1) {
        board[row][col] = -1; // 设置地雷
        mineCount++;
        // 更新周围的数字
        for (let i = -1; i <= 1; i++) {
          for (let j = -1; j <= 1; j++) {
            if (row + i >= 0 && row + i < rows && col + j >= 0 && col + j < cols && board[row + i][col + j] !== -1) {
              board[row + i][col + j]++;
            }
          }
        }
      }
    }
    setGameState({
      ...gameState,
      board,
      revealed: Array(rows).fill(Array(cols).fill(0)),
      gameOver: 0,
      timer: 0,
      total: rows * cols,
      mines,
    });
  }
  // 游戏开始时设置棋盘
  const startGame = (difficulty: string) => {
    if (!difficulty) return;
    if (!['easy', 'medium', 'hard'].includes(difficulty)) {
      alert("无效的难度选择，请重新开始游戏。");
      return;
    }
    setBoard(difficulty);
    setModalState((prev) => ({
      ...prev,
      visible: false,
    }));
    startTimer()
  }
  // 游戏结束时设置游戏状态
  const endGame = () => {
    stopTimer()
    setGameState({
      ...gameState,
      gameOver: -1,
    });
  }
  // 游戏计时器
  const startTimer = () => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
    }

    timerRef.current = setInterval(() => {
      setGameState((prevState) => ({
        ...prevState,
        timer: prevState.timer + 1,
      }));
    }, 1000);
  }

  // 清除定时器
  const stopTimer = () => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
  };

  // 计算已标记雷数和揭示的安全格子数
  const calculateFlaggedCount = (revealed: RevealedType): number[] => {
    const flaggedCells = revealed.flat().filter(cell => cell === 2).length;
    const safeCells = revealed.flat().filter(cell => cell === 1).length;
    return [flaggedCells, safeCells];
  }

  // 处理点击
  const handleCellClick = (row: number, col: number) => {
    console.log(`点击了单元格 (${row}, ${col})`);
    if (gameState.gameOver !== 0 || gameState.revealed[row][col]) {
      return;
    }

    if (gameState.board[row][col] === -1) {
      endGame();
    } else {
      // 处理点击逻辑
      setGameState(prevState => {
        const newRevealed = prevState.revealed.map(arr => [...arr]); // 深拷贝二维数组

        // 如果是空白格子(值为0)，则执行扩散
        if (prevState.board[row][col] === 0) {
          revealEmptyCells(row, col, prevState.board, newRevealed);
        } else {
          newRevealed[row][col] = 1; // 只显示当前格子
        }

        // 更新已标记雷数和揭示的安全格子数
        const [flaggedCount, revealedCount] = calculateFlaggedCount(newRevealed);

        return {
          ...prevState,
          revealed: newRevealed,
          flaggedCount,
          revealedCount,
          gameOver: prevState.total - prevState.mines === revealedCount ? 1 : 0,
        };
      });
    }
  }

  // 如果点击格子为空白格子，需将周围的格子都翻开
  const revealEmptyCells = (row: number, col: number, board: BoardType, revealed: RevealedType): void => {
    const rows = board.length;
    const cols = board[0].length;

    if (row < 0 || row >= rows || col < 0 || col >= cols || revealed[row][col] !== 0) {
      return;
    }

    // 当前格子置为已点击
    revealed[row][col] = 1;

    // 如果是空白格子，则递归检查周围的格子
    if (board[row][col] === 0) {
      // 遍历周边的格子
      for (let i = -1; i <= 1; i += 1) {
        for (let j = -1; j <= 1; j += 1) {
          if (i === 0 && j === 0) continue;
          revealEmptyCells(row + i, col + j, board, revealed);
        }
      }
    }
  }

  // 处理右键点击
  const handleCellRightClick = (row: number, col: number) => {
    console.log(`右键点击了单元格 (${row}, ${col})`);
    if (gameState.gameOver || gameState.revealed[row][col] === 1) {
      return;
    }

    setGameState(prevState => {
      const newRevealed = prevState.revealed.map(arr => [...arr]);
      const revealed = newRevealed[row][col]
      if (revealed === 0) {
        newRevealed[row][col] = 2
      } else if (revealed === 2) {
        newRevealed[row][col] = 0
      }

      // 更新已标记雷数和揭示的安全格子数
      const [flaggedCount, revealedCount] = calculateFlaggedCount(newRevealed);

      return {
        ...prevState,
        revealed: newRevealed,
        flaggedCount,
        revealedCount,
        gameOver: prevState.total - prevState.mines === revealedCount ? 1 : 0,
      };
    });
  }

  // 处理模态框渲染，根据不同类型渲染不同内容
  const renderModalContent = () => {
    switch (modalState.type) {
      // 游戏规则
      case 'rules':
        return (
          <div>
            <p>1. 游戏开始，玩家可选择难度（简单、中等、困难）。</p>
            <p>2. 游戏开始后，随机在棋盘上放置地雷，并开始计时，玩家可以查看剩余雷数和已用时间。</p>
            <p>3. 玩家点击单元格，如果点击到地雷，游戏结束；如果点击到空白单元格，显示周围地雷的数量。</p>
            <p>4. 玩家可以右键点击单元格进行标记。</p>
            <p>5. 游戏结束后，玩家可以查看排行榜。</p>
            <p>6. 玩家可以选择不同的难度重新开始游戏。</p>
          </div>
        );
      // 排行榜
      case 'leaderboard':
        return (
          <div>
          </div>
        );
      // 游戏难度选择
      case 'difficulty':
        return (
          <div className="flex flex-col items-center">
            <div className="flex gap-4">
              <button className="btn btn-soft btn-primary" onClick={() => startGame('easy')}>简单</button>
              <button className="btn btn-soft btn-primary" onClick={() => startGame('medium')}>中等</button>
              <button className="btn btn-soft btn-primary" onClick={() => startGame('hard')}>困难</button>
            </div>
          </div>
        );
      default:
        return null;
    }
  }

  useEffect(() => {
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    }
  }, [])

  useEffect(() => {
    if (gameState.gameOver === 1) {
      // 游戏胜利
      stopTimer();
      setModalState({
        visible: true,
        hiddenBtn: true,
        type: 'success',
        title: '游戏胜利',
        message: `用时 ${gameState.timer} 秒`,
      });
    } else if (gameState.gameOver === -1) {
      // 游戏失败
      stopTimer();
      setModalState({
        visible: true,
        hiddenBtn: true,
        type: 'error',
        title: '游戏失败',
        message: `用时 ${gameState.timer} 秒，剩余雷数 ${gameState.mines - gameState.flaggedCount}，已揭示格子数 ${gameState.revealedCount}`,
      });
    }
  }, [gameState.gameOver]);

  return (
    <div className="flex flex-col items-center pt-20">
      <div className="flex flex-col items-center">
        <h1 className="text-2xl font-bold mb-5">扫雷</h1>
        {gameState.total > 0 ? (
          <>
            <p>剩余雷数: {gameState.mines - gameState.flaggedCount}</p>
            <p>时间: {gameState.timer}秒</p>
          </>
        ) : (
          <p>点击开始游戏，选择难度</p>
        )}
      </div>
      {/* 扫雷棋盘 */}
      <div className="my-8">
        {/* 这里是棋盘的内容 */}
        <div className="flex flex-col">
          {/* 根据游戏状态渲染棋盘 */}
          {gameState.board.map((row, rowIndex) => (
            <div key={rowIndex} className="flex">
              {row.map((cell: number, colIndex: number) => {
                const state = gameState.revealed[rowIndex][colIndex]
                const isRevealed = state === 1;
                const isFlagged = state === 2;
                return (
                <div
                  key={colIndex}
                  className={`w-8 h-8 border flex items-center justify-center text-primary-content cursor-pointer bg-primary ${isRevealed && "bg-primary-content"}`}
                  onClick={() => handleCellClick(rowIndex, colIndex)}
                  onContextMenu={(e) => {
                    e.preventDefault();
                    handleCellRightClick(rowIndex, colIndex);
                  }}
                >
                  <span className="text-primary">
                    {isRevealed && cell}
                    {isFlagged && "🚩"}
                  </span>
                  {/* <span className="text-black">{cell}</span> */}
                </div>
              )})}
            </div>
          ))}
        </div>
      </div>
      <div className="flex gap-4">
        <button className="btn btn-primary" onClick={() => {
          setModalState({
            type: 'difficulty',
            title: '选择游戏难度',
            visible: true,
            hiddenBtn: true,
            message: '',
          });
        }}>开始游戏</button>
      </div>

      <Modal {...modalState} onClose={() => {setModalState({...modalState, visible: false})}}>
        {renderModalContent()}
      </Modal>

    </div>
  )
}

export default App
