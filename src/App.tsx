import { useState } from 'react';
import Modal from '@/components/Modal';
import Board from '@/components/Board';
import SidePanel from '@/components/SidePanel';
import ThemeToggle from '@/components/ThemeToggle';
import Leaderboard from '@/components/Leaderboard';
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

  // 移动端侧边栏状态
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // 切换侧边栏显示/隐藏
  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  // 处理模态框渲染，根据不同类型渲染不同内容
  const renderModalContent = () => {
    switch (modalState.type) {
      // 游戏规则
      case 'rules':
        return (
          <div className="space-y-3">
            {[1, 2, 3, 4, 5, 6].map((num, index) => {
              const badges = ['badge', 'badge-primary', 'badge-secondary', 'badge-accent', 'badge-info', 'badge-success'];
              const texts = [
                '游戏开始，玩家可选择难度（简单、中等、困难）。',
                '游戏开始后，随机在棋盘上放置地雷，并开始计时，玩家可以查看剩余雷数和已用时间。',
                '玩家点击单元格，如果点击到地雷，游戏结束；如果点击到空白单元格，显示周围地雷的数量。',
                '玩家可以右键点击单元格进行标记。',
                '游戏结束后，玩家可以查看排行榜。',
                '玩家可以选择不同的难度重新开始游戏。'
              ];

              return (
                <div key={num} className="flex items-center gap-2">
                  <div className={`${badges[index]} w-6 h-6 flex items-center justify-center rounded-full text-sm font-bold`}>
                    {num}
                  </div>
                  <p className="text-base-content">{texts[index]}</p>
                </div>
              );
            })}
          </div>
        );
      // 排行榜
      case 'leaderboard':
        return (
          <Leaderboard />
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
      <div className="drawer lg:drawer-open">
        <input
          id="my-drawer"
          type="checkbox"
          className="drawer-toggle"
          checked={sidebarOpen}
          onChange={toggleSidebar}
        />

      {/* 侧边栏内容 */}
      <div className="drawer-side z-10">
        <label htmlFor="my-drawer" aria-label="close sidebar" className="drawer-overlay"></label>
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
      </div>

      {/* 页面内容 */}
      <div className="drawer-content flex flex-col bg-base-300 min-h-screen">
        {/* 移动端菜单按钮 */}
        <div className="lg:hidden fixed top-4 left-4 z-30">
          <label htmlFor="my-drawer" className="btn btn-sm btn-circle bg-primary hover:bg-primary-focus text-white border-none shadow-lg">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </label>
        </div>

        {/* 移动端主题切换按钮 */}
        <div className="lg:hidden fixed top-4 right-4 z-30">
          <ThemeToggle />
        </div>

        {/* 主要游戏区域 */}
        <div className="flex-1 overflow-auto">
          <div className={`flex flex-col items-center pt-16 lg:pt-10 p-2 sm:p-4 w-full ${getGameStateClass()}`}>

            {/* 游戏信息区 */}
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
            {gameStatus !== 'idle' && (
              <Board
                gameState={gameState}
                handleCellClick={handleCellClick}
                handleCellRightClick={handleCellRightClick}
                difficulty={boardConfig.width >= 22 ? 'hard' : boardConfig.width >= 16 ? 'medium' : 'easy'}
              />
            )}

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

            {/* 模态窗口 */}
            <Modal {...modalState} onClose={closeModal}>
              {renderModalContent()}
            </Modal>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
