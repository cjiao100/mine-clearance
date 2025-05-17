import { useState, useEffect } from 'react';

// 游戏配置接口
interface GameConfig {
  soundEnabled: boolean;
  boardScale: number;
}

// 默认配置
const defaultConfig: GameConfig = {
  soundEnabled: true,
  boardScale: 1
};

export function useGameConfig() {
  // 从本地存储加载配置，如果没有则使用默认配置
  const [config, setConfig] = useState<GameConfig>(() => {
    const savedConfig = localStorage.getItem('minesweeper_config');
    if (savedConfig) {
      try {
        return JSON.parse(savedConfig);
      } catch (e) {
        console.error('游戏配置解析失败:', e);
        return defaultConfig;
      }
    }
    return defaultConfig;
  });

  // 更新单个配置项
  const updateConfig = <K extends keyof GameConfig>(key: K, value: GameConfig[K]) => {
    setConfig(prevConfig => {
      const newConfig = { ...prevConfig, [key]: value };
      // 保存到本地存储
      localStorage.setItem('minesweeper_config', JSON.stringify(newConfig));
      return newConfig;
    });
  };

  // 重置配置
  const resetConfig = () => {
    setConfig(defaultConfig);
    localStorage.setItem('minesweeper_config', JSON.stringify(defaultConfig));
  };

  // 当配置变化时，应用一些全局设置
  useEffect(() => {
    // 应用棋盘缩放
    document.documentElement.style.setProperty('--board-scale', config.boardScale.toString());

  }, [config]);

  return {
    config,
    updateConfig,
    resetConfig
  };
}
