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
        title: '游戏胜利',
        visible: true,
        hiddenBtn: true,
        message: `用时 ${time} 秒`,
      });
    }, 50);
  }, [updateModalState]);

  // 显示失败模态框
  const showLoseModal = useCallback((time: number, minesLeft: number, revealedCount: number) => {
    // 使用setTimeout轻微延迟，确保游戏状态已更新
    setTimeout(() => {
      updateModalState({
        type: 'error',
        title: '游戏失败',
        visible: true,
        hiddenBtn: true,
        message: `用时 ${time} 秒，剩余雷数 ${minesLeft}，已揭示格子数 ${revealedCount}`,
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
