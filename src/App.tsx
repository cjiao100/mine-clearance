import { useState } from 'react';
import Modal from '@/components/Modal';
import Board from '@/components/Board';
import SidePanel from '@/components/SidePanel';
import ThemeToggle from '@/components/ThemeToggle';
import Leaderboard from '@/components/Leaderboard';
import WelcomePage from '@/components/WelcomePage';
import GameRules from '@/components/GameRules';
import { useMineSweeper } from '@/hooks';

import { ReactComponent as MenuIcon } from "@/assets/icons/menu.svg";

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
          <GameRules />
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
            <MenuIcon className="h-5 w-5" />
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
              {gameStatus !== 'idle' && gameState.total > 0 && (
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
              )}
            </div>

            {/* 欢迎页面或扫雷棋盘 */}
            {gameStatus === 'idle' ? (
              <WelcomePage
                onStartGame={startGame}
                onShowLeaderboard={showLeaderboard}
              />
            ) : (
              <Board
                gameState={gameState}
                handleCellClick={handleCellClick}
                handleCellRightClick={handleCellRightClick}
                difficulty={boardConfig.width >= 22 ? 'hard' : boardConfig.width >= 16 ? 'medium' : 'easy'}
              />
            )}

            {/* 游戏状态提示（只在模态框不可见时显示） */}
            {gameStatus === 'won' && !modalState.visible && (
              <div className="mt-4 py-3 px-6 bg-success/20 text-success rounded-lg animate-fadeIn flex items-center gap-2">
                <span className="text-xl">🎉</span>
                <span>恭喜你赢了！</span>
                <button onClick={() => showLeaderboard()} className="btn btn-sm btn-ghost ml-2">查看排行榜</button>
              </div>
            )}
            {gameStatus === 'lost' && !modalState.visible && (
              <div className="mt-4 py-3 px-6 bg-error/20 text-error rounded-lg animate-shake flex items-center gap-2">
                <span className="text-xl">💣</span>
                <span>游戏结束，再接再厉！</span>
                <button onClick={resetGame} className="btn btn-sm btn-ghost ml-2">再来一局</button>
              </div>
            )}

            {/* 模态窗口 */}
            <Modal {...modalState} onClose={closeModal}>
              {modalState.type === 'success' && (
                <div className="flex flex-col items-center">
                  <div className="w-20 h-20 bg-success/10 rounded-full flex items-center justify-center mb-4 animate-bounce">
                    <span className="text-4xl">🏆</span>
                  </div>
                  <p className="text-center text-lg mb-4">{modalState.message}</p>
                  <div className="flex gap-3 w-full justify-center mt-4">
                    <button onClick={() => {closeModal(); resetGame();}} className="btn btn-outline">再来一局</button>
                    <button onClick={() => {closeModal(); showLeaderboard();}} className="btn btn-primary">查看排行榜</button>
                  </div>
                </div>
              )}
              {modalState.type === 'error' && (
                <div className="flex flex-col items-center">
                  <div className="w-20 h-20 bg-error/10 rounded-full flex items-center justify-center mb-4 animate-pulse">
                    <span className="text-4xl">💣</span>
                  </div>
                  <p className="text-center text-lg mb-4">{modalState.message}</p>
                  <div className="flex gap-3 w-full justify-center mt-4">
                    <button onClick={() => {closeModal();}} className="btn btn-ghost">关闭</button>
                    <button onClick={() => {closeModal(); resetGame();}} className="btn btn-primary">再来一局</button>
                  </div>
                </div>
              )}
              {(modalState.type !== 'success' && modalState.type !== 'error') && renderModalContent()}
            </Modal>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
