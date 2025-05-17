import React, { createContext, useContext, useState, useEffect, useRef } from 'react';
import { setupAudioContext, tryPlaySound } from '../utils/soundUtils';

// 定义音频上下文类型
interface AudioContextType {
  soundEnabled: boolean;
  toggleSound: (enabled: boolean) => void;
  playClickSound: () => void;
  playFlagSound: () => void;
  playExplosionSound: () => void;
  playVictorySound: () => void;
}

// 创建音频上下文
const AudioContext = createContext<AudioContextType | undefined>(undefined);

// 音效文件路径
const soundPaths = {
  click: '/sounds/click.mp3',
  flag: '/sounds/flag.mp3',
  explosion: '/sounds/explosion.mp3',
  victory: '/sounds/victory.mp3'
};

// 音频上下文提供者组件
export const AudioProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // 音效是否启用
  const [soundEnabled, setSoundEnabled] = useState<boolean>(true);

  // 音效引用
  const clickSoundRef = useRef<HTMLAudioElement | null>(null);
  const flagSoundRef = useRef<HTMLAudioElement | null>(null);
  const explosionSoundRef = useRef<HTMLAudioElement | null>(null);
  const victorySoundRef = useRef<HTMLAudioElement | null>(null);

  // 从本地存储加载音效设置
  useEffect(() => {
    // 初始化音频上下文
    setupAudioContext();

    // 加载音效状态
    const savedSetting = localStorage.getItem('minesweeper_sound_enabled');
    if (savedSetting !== null) {
      setSoundEnabled(savedSetting === 'true');
    }

    // 加载音效
    loadSounds();

    // 组件卸载时释放资源
    return () => {
      // 清理音频资源
    };
  }, []);

  // 加载音效
  const loadSounds = () => {
    if (typeof window !== 'undefined') {
      try {
        // 尝试预加载音效
        if (!clickSoundRef.current) {
          clickSoundRef.current = new Audio(soundPaths.click);
          clickSoundRef.current.volume = 0.5;
          clickSoundRef.current.load();
        }

        if (!flagSoundRef.current) {
          flagSoundRef.current = new Audio(soundPaths.flag);
          flagSoundRef.current.volume = 0.5;
          flagSoundRef.current.load();
        }

        if (!explosionSoundRef.current) {
          explosionSoundRef.current = new Audio(soundPaths.explosion);
          explosionSoundRef.current.volume = 0.6;
          explosionSoundRef.current.load();
        }

        if (!victorySoundRef.current) {
          victorySoundRef.current = new Audio(soundPaths.victory);
          victorySoundRef.current.volume = 0.7;
          victorySoundRef.current.load();
        }

        console.log('音效加载成功');
      } catch (error) {
        console.error('加载音效失败:', error);
      }
    }
  };

  // 通用播放函数
  const playSound = (soundRef: React.RefObject<HTMLAudioElement | null>) => {
    // 如果音效已关闭，则不播放
    if (!soundEnabled) {
      console.log('音效已关闭，不播放音效');
      return;
    }

    if (soundRef.current) {
      tryPlaySound(
        soundRef.current,
        () => {
          // 播放成功
          console.log('音效播放成功');
        },
        (error) => {
          // 播放失败
          console.log('音效播放失败:', error);

          if (error.name === 'NotAllowedError') {
            setupAudioContext();
          }
        }
      );
    }
  };

  // 切换音效
  const toggleSound = (enabled: boolean) => {
    setSoundEnabled(enabled);
    localStorage.setItem('minesweeper_sound_enabled', String(enabled));
    console.log('音效已' + (enabled ? '启用' : '关闭'));
  };

  // 各类音效播放函数
  const playClickSound = () => playSound(clickSoundRef);
  const playFlagSound = () => playSound(flagSoundRef);
  const playExplosionSound = () => playSound(explosionSoundRef);
  const playVictorySound = () => playSound(victorySoundRef);

  // 提供上下文值
  const contextValue: AudioContextType = {
    soundEnabled,
    toggleSound,
    playClickSound,
    playFlagSound,
    playExplosionSound,
    playVictorySound
  };

  return (
    <AudioContext.Provider value={contextValue}>
      {children}
    </AudioContext.Provider>
  );
};

// 自定义钩子用于访问音频上下文
export const useAudio = (): AudioContextType => {
  const context = useContext(AudioContext);
  if (context === undefined) {
    throw new Error('useAudio 必须在 AudioProvider 内部使用');
  }
  return context;
};
