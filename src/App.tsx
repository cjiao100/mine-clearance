import Modal from '@/components/Modal';
import Board from '@/components/Board';
import SidePanel from '@/components/SidePanel';
import { useMineSweeper } from '@/hooks';

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
    gameStatus,
    gameState,
    gameStats,
    boardConfig,
    modalState,
    startGame,
    resetGame,
    pauseGame,
    resumeGame,
    handleCellClick,
    handleCellRightClick,
    showRules,
    showLeaderboard,
    closeModal,
  } = useMineSweeper();


  // 处理模态框渲染，根据不同类型渲染不同内容
  const renderModalContent = () => {
    switch (modalState.type) {
      // 游戏规则
      case 'rules':
        return (
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <div className="badge badge-primary w-6 h-6 flex items-center justify-center rounded-full text-sm font-bold">1</div>
              <p>游戏开始，玩家可选择难度（简单、中等、困难）。</p>
            </div>
            <div className="flex items-center gap-2">
              <div className="badge badge-secondary w-6 h-6 flex items-center justify-center rounded-full text-sm font-bold">2</div>
              <p>游戏开始后，随机在棋盘上放置地雷，并开始计时，玩家可以查看剩余雷数和已用时间。</p>
            </div>
            <div className="flex items-center gap-2">
              <div className="badge badge-accent w-6 h-6 flex items-center justify-center rounded-full text-sm font-bold">3</div>
              <p>玩家点击单元格，如果点击到地雷，游戏结束；如果点击到空白单元格，显示周围地雷的数量。</p>
            </div>
            <div className="flex items-center gap-2">
              <div className="badge w-6 h-6 flex items-center justify-center rounded-full text-sm font-bold">4</div>
              <p>玩家可以右键点击单元格进行标记。</p>
            </div>
            <div className="flex items-center gap-2">
              <div className="badge badge-info w-6 h-6 flex items-center justify-center rounded-full text-sm font-bold">5</div>
              <p>游戏结束后，玩家可以查看排行榜。</p>
            </div>
            <div className="flex items-center gap-2">
              <div className="badge badge-success w-6 h-6 flex items-center justify-center rounded-full text-sm font-bold">6</div>
              <p>玩家可以选择不同的难度重新开始游戏。</p>
            </div>
          </div>
        );
      // 排行榜
      case 'leaderboard':
        return (
          <div>
          </div>
        );
      default:
        return null;
    }
  }

  // 根据游戏状态确定样式类
  const getGameStateClass = () => {
    if (gameStatus === 'won') return 'game-won';
    if (gameStatus === 'lost') return 'game-lost';
    return '';
  };

  return (
    <div className="min-h-screen bg-base-300 flex">
      {/* <Navbar /> */}
      {/* <div className=""> */}
        <SidePanel
          gameStatus={gameStatus}
          boardInfo={boardConfig}
          gameStats={gameStats}
          onStartGame={startGame}
          onResetGame={resetGame}
          onPauseGame={pauseGame}
          onResumeGame={resumeGame}
          onShowRules={showRules}
          onShowLeaderboard={showLeaderboard}
        />
        <div className={`flex flex-col items-center pt-10 p-4 max-w-xl mx-auto ${getGameStateClass()}`}>
          {/* 游戏标题 */}
          <div className="flex flex-col items-center w-full">

            {gameState.total > 0 ? (
              <div className="flex justify-between w-full max-w-md mb-4 bg-base-100 rounded-xl p-4 card-shadow gap-3 animate-fadeIn">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-error/20 hover:bg-error/30 transition-colors rounded-full flex items-center justify-center shadow-sm">
                    <span className="text-lg">💣</span>
                  </div>
                  <span className="font-mono font-bold text-xl text-base-content">{gameState.mines - gameState.flaggedCount}</span>
                </div>
                <div className="bg-base-200 px-5 py-2 rounded-lg shadow-inner flex items-center hover:bg-base-200/70 transition-colors">
                  <span className="font-mono font-bold text-lg text-base-content">{gameState.timer}s</span>
                </div>
              </div>
            ) : (
              <div className="bg-base-200/50 px-6 py-3 rounded-xl mb-4 animate-fadeIn">
                <p className="text-base text-base-content/80">点击开始游戏，选择难度</p>
              </div>
            )}
          </div>
          {/* 扫雷棋盘 */}
          <Board
            gameState={gameState}
            handleCellClick={handleCellClick}
            handleCellRightClick={handleCellRightClick}
          />
          {/* <div className="flex gap-4 mt-6">
            <button
              className="btn btn-primary btn-lg shadow-md hover:shadow-lg transition-shadow"
              onClick={showDifficultyModal}
            >
              {gameState.total === 0 ? '开始游戏' : '重新开始'}
            </button>
          </div> */}

          {/* 游戏状态提示 */}
          {gameStatus === 'won' && (
            <div className="mt-4 py-2 px-4 bg-success/20 text-success rounded-lg animate-fadeIn">
              恭喜你赢了！
            </div>
          )}
          {gameStatus === 'lost' && (
            <div className="mt-4 py-2 px-4 bg-error/20 text-error rounded-lg animate-shake">
              游戏结束，再接再厉！
            </div>
          )}

          <Modal {...modalState} onClose={closeModal}>
            {renderModalContent()}
          </Modal>

        </div>
      {/* </div> */}
    </div>
  )
}

export default App
