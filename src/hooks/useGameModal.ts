// useGameModal.ts
import { useCallback, useState } from 'react';
import type { ModalState } from '@/types';

export function useGameModal() {
  // 模态框状态
  const [modalState, setModalState] = useState<ModalState>({
    type: 'rules',
    title: '游戏规则',
    visible: false,
    hiddenBtn: false,
    message: '',
  });

  // 更新模态框状态 - 使用useCallback缓存函数
  const updateModalState = useCallback((newState: Partial<ModalState>) => {
    // 优化状态更新，避免不必要的重渲染
    setModalState(prev => ({
      ...prev,
      ...newState,
    }));
  }, []);

  // 显示难度选择
  const showDifficultyModal = useCallback(() => {
    updateModalState({
      type: 'difficulty',
      title: '选择游戏难度',
      visible: true,
      hiddenBtn: true,
      message: '',
    });
  }, [updateModalState]);

  // 显示游戏规则
  const showRules = useCallback(() => {
    updateModalState({
      type: 'rules',
      title: '游戏规则',
      visible: true,
      hiddenBtn: false,
      message: '',
    });
  }, [updateModalState]);

  // 显示排行榜
  const showLeaderboard = useCallback(() => {
    updateModalState({
      type: 'leaderboard',
      title: '排行榜',
      visible: true,
      hiddenBtn: false,
      message: '',
    });
  }, [updateModalState]);

  // 显示胜利模态框
  const showWinModal = useCallback((time: number) => {
    // 使用setTimeout轻微延迟，确保游戏状态已更新
    setTimeout(() => {
      updateModalState({
        type: 'success',
        title: '🎉 恭喜你赢了！',
        visible: true,
        hiddenBtn: true,
        message: `你以 ${time} 秒的成绩完成了游戏`,
      });
    }, 50);
  }, [updateModalState]);

  // 显示失败模态框
  const showLoseModal = useCallback((time: number, minesLeft: number, revealedCount: number) => {
    // 使用setTimeout轻微延迟，确保游戏状态已更新
    setTimeout(() => {
      const progressPercent = Math.round((revealedCount / (revealedCount + minesLeft)) * 100);
      updateModalState({
        type: 'error',
        title: '💣 游戏结束',
        visible: true,
        hiddenBtn: true,
        message: `坚持了 ${time} 秒 | 完成度 ${progressPercent}% | 还有 ${minesLeft} 个地雷未找到`,
      });
    }, 50);
  }, [updateModalState]);

  // 关闭模态框
  const closeModal = useCallback(() => {
    updateModalState({ visible: false });
  }, [updateModalState]);

  return {
    modalState,
    showDifficultyModal,
    showRules,
    showLeaderboard,
    showWinModal,
    showLoseModal,
    closeModal
  };
}
