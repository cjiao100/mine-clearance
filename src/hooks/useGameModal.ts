// useGameModal.ts
import { useState } from 'react';
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

  // 显示游戏规则
  const showRules = () => {
    setModalState({
      type: 'rules',
      title: '游戏规则',
      visible: true,
      hiddenBtn: false,
      message: '',
    });
  };

  // 显示排行榜
  const showLeaderboard = () => {
    setModalState({
      type: 'leaderboard',
      title: '排行榜',
      visible: true,
      hiddenBtn: false,
      message: '',
    });
  };

  // 显示胜利模态框
  const showWinModal = (time: number) => {
    setModalState({
      visible: true,
      hiddenBtn: true,
      type: 'success',
      title: '游戏胜利',
      message: `用时 ${time} 秒`,
    });
  };

  // 显示失败模态框
  const showLoseModal = (time: number, minesLeft: number, revealedCount: number) => {
    setModalState({
      visible: true,
      hiddenBtn: true,
      type: 'error',
      title: '游戏失败',
      message: `用时 ${time} 秒，剩余雷数 ${minesLeft}，已揭示格子数 ${revealedCount}`,
    });
  };

  // 关闭模态框
  const closeModal = () => {
    setModalState(prev => ({ ...prev, visible: false }));
  };

  return {
    modalState,
    showRules,
    showLeaderboard,
    showWinModal,
    showLoseModal,
    closeModal
  };
}
