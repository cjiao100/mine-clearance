import Modal from './components/Modal';
import Board from './components/Board';
import { useMineSweeper } from './hooks';

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
function App() {
  const {
    gameState,
    modalState,
    startGame,
    handleCellClick,
    handleCellRightClick,
    showDifficultyModal,
    closeModal,
  } = useMineSweeper();

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
      <Board
        gameState={gameState}
        handleCellClick={handleCellClick}
        handleCellRightClick={handleCellRightClick}
      />
      <div className="flex gap-4">
        <button className="btn btn-primary" onClick={showDifficultyModal}>开始游戏</button>
      </div>

      <Modal {...modalState} onClose={closeModal}>
        {renderModalContent()}
      </Modal>

    </div>
  )
}

export default App
