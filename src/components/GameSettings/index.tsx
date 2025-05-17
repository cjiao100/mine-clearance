import React, { useState, useEffect } from 'react';
import { useAudio } from '@/contexts/AudioContext';
import { useLeaderboard } from '@/hooks';

const GameSettings: React.FC = () => {
  // 使用音效钩子
  const audio = useAudio();
  const soundEnabled = audio.soundEnabled;
  const toggleSound = audio.toggleSound;
  
  // 使用排行榜钩子获取和设置玩家名称
  const { playerName, savePlayerName } = useLeaderboard();
  const [nameInput, setNameInput] = useState(playerName);

  // 本地状态
  const [settings, setSettings] = useState({
    boardScale: 1,
    highContrast: false,
  });

  // 从本地存储加载设置
  useEffect(() => {
    const savedSettings = localStorage.getItem('minesweeper_settings');
    if (savedSettings) {
      try {
        const parsed = JSON.parse(savedSettings);
        setSettings(prev => ({...prev, ...parsed}));
      } catch (e) {
        console.error('设置解析失败:', e);
      }
    }
  }, []);

  // 更新设置
  const handleSettingChange = (key: string, value: boolean | number) => {
    setSettings(prev => {
      const newSettings = { ...prev, [key]: value };
      localStorage.setItem('minesweeper_settings', JSON.stringify(newSettings));

      // 应用设置
      if (key === 'boardScale') {
        document.documentElement.style.setProperty('--board-scale', value.toString());
      }

      return newSettings;
    });
  };

  // 处理声音开关
  const handleSoundToggle = (e: React.ChangeEvent<HTMLInputElement>) => {
    toggleSound(e.target.checked);
  };

  // 处理缩放值变更
  const handleScaleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseFloat(e.target.value);
    handleSettingChange('boardScale', value);
  };

  return (
    <div className="mt-2 space-y-3">
      {/* 玩家名称设置 */}
      <div className="form-control">
        <label className="label pb-1">
          <span className="label-text">玩家名称</span>
        </label>
        <div className="flex gap-2">
          <input
            type="text"
            className="input input-sm input-bordered flex-1"
            placeholder="输入玩家名称"
            value={nameInput}
            onChange={(e) => setNameInput(e.target.value)}
            maxLength={16}
          />
          <button 
            className="btn btn-sm btn-primary" 
            onClick={() => savePlayerName(nameInput)}
            disabled={!nameInput.trim() || nameInput === playerName}
          >
            保存
          </button>
        </div>
        <div className="text-xs text-base-content/70 mt-1">
          用于排行榜显示
        </div>
      </div>
      
      <div className="form-control">
        <label className="label cursor-pointer justify-start gap-2">
          <input
            type="checkbox"
            className="checkbox checkbox-sm checkbox-primary"
            checked={soundEnabled}
            onChange={handleSoundToggle}
          />
          <span className="label-text">启用音效</span>
        </label>
      </div>

      <div className="form-control">
        <label className="label pb-1">
          <span className="label-text">棋盘大小缩放</span>
          <span className="label-text-alt">{settings.boardScale.toFixed(1)}x</span>
        </label>
        <input
          type="range"
          min="0.8"
          max="1.2"
          step="0.1"
          value={settings.boardScale}
          onChange={handleScaleChange}
          className="range range-xs range-primary"
        />
        <div className="flex justify-between text-xs px-1 mt-1">
          <span>小</span>
          <span>默认</span>
          <span>大</span>
        </div>
      </div>

      <div className="flex justify-end mt-4">
        <button
          className="btn btn-sm btn-ghost"
          onClick={() => {
            // 重置所有设置
            handleSettingChange('boardScale', 1);
            toggleSound(true);
          }}
        >
          恢复默认
        </button>
      </div>
    </div>
  );
};

export default GameSettings;