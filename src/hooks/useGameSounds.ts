import { useRef, useState, useEffect } from 'react';
import { setupAudioContext, tryPlaySound } from '../utils/soundUtils';

export function useGameSounds() {
  // 音效是否启用
  const [soundEnabled, setSoundEnabled] = useState<boolean>(true);

  // 音效是否已加载
  const [soundsLoaded, setSoundsLoaded] = useState<boolean>(false);

  // 音效引用
  const clickSoundRef = useRef<HTMLAudioElement | null>(null);
  const flagSoundRef = useRef<HTMLAudioElement | null>(null);
  const explosionSoundRef = useRef<HTMLAudioElement | null>(null);
  const victorySoundRef = useRef<HTMLAudioElement | null>(null);

  // 在组件挂载时尝试加载音效
  useEffect(() => {
    // 初始化音频上下文，以支持浏览器自动播放政策
    setupAudioContext();

    // 加载音效
    loadSounds();

    // 从本地存储加载音效设置
    const savedSetting = localStorage.getItem('minesweeper_sound_enabled');
    if (savedSetting !== null) {
      setSoundEnabled(savedSetting === 'true');
    }
  }, []);

  // 音效文件路径（相对于public目录）
  const soundPaths = {
    click: '/sounds/click.mp3',
    flag: '/sounds/flag.mp3',
    explosion: '/sounds/explosion.mp3',
    victory: '/sounds/victory.mp3'
  };

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

        setSoundsLoaded(true);
        console.log('音效加载成功');
      } catch (error) {
        console.error('加载音效失败:', error);
      }
    }
  };

  // 通用播放函数，添加错误处理和音效开关控制
  const playSound = (soundRef: React.RefObject<HTMLAudioElement | null>, fallbackLoad = true) => {
    // 如果音效已关闭，则不播放
    if (!soundEnabled) return;

    if (soundRef.current) {
      // 使用我们的工具函数尝试播放声音
      tryPlaySound(
        soundRef.current,
        () => {
          // 播放成功
        },
        (error) => {
          // 播放失败
          if (error.name === 'NotAllowedError' && fallbackLoad) {
            // 确保音频上下文已设置，以便后续交互能播放声音
            setupAudioContext();
            loadSounds();
          }
        }
      );
    } else if (fallbackLoad) {
      // 如果音效尚未加载，尝试加载
      loadSounds();
    }
  };

  // 播放点击音效
  const playClickSound = () => {
    playSound(clickSoundRef);
  };

  // 播放旗标音效
  const playFlagSound = () => {
    playSound(flagSoundRef);
  };

  // 播放爆炸音效
  const playExplosionSound = () => {
    playSound(explosionSoundRef);
  };

  // 播放胜利音效
  const playVictorySound = () => {
    playSound(victorySoundRef);
  };

  // 设置音效开关
  const toggleSound = (enabled: boolean) => {
    setSoundEnabled(enabled);
    localStorage.setItem('minesweeper_sound_enabled', String(enabled));
  };

  return {
    soundEnabled,
    soundsLoaded,
    loadSounds,
    playClickSound,
    playFlagSound,
    playExplosionSound,
    playVictorySound,
    toggleSound
  };
}
