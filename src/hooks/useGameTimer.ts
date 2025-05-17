// useGameTimer.ts
import { useRef } from 'react';

export function useGameTimer(onTick: () => void) {
  // 时间对象
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // 开始计时器
  const startTimer = () => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
    }

    timerRef.current = setInterval(() => {
      onTick();
    }, 1000);
  };

  // 停止计时器
  const stopTimer = () => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
  };

  // 重置并开始计时器
  const resetAndStartTimer = () => {
    stopTimer();
    startTimer();
  };

  // 清理计时器（用于组件卸载时）
  const cleanupTimer = () => {
    stopTimer();
  };

  return {
    startTimer,
    stopTimer,
    resetAndStartTimer,
    cleanupTimer
  };
}
