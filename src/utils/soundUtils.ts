/**
 * 处理浏览器自动播放限制的工具函数
 * 添加一次性事件监听器，在用户首次交互时启用音效
 */

let audioContext: AudioContext | null = null;
let userInteractionListenerAdded = false;

/**
 * 在用户首次交互后初始化AudioContext
 * 这有助于解决浏览器的自动播放政策问题
 */
export function setupAudioContext() {
  if (typeof window === 'undefined' || userInteractionListenerAdded) return;

  const handleInteraction = () => {
    // 创建并解锁AudioContext
    if (!audioContext) {
      try {
        const AudioContextClass = window.AudioContext || ((window as Window & { webkitAudioContext?: typeof AudioContext }).webkitAudioContext);
        if (AudioContextClass) {
          audioContext = new AudioContextClass();

          // 在iOS上，需要通过播放静音缓冲区来解锁音频
          if (audioContext.state === 'suspended') {
            const buffer = audioContext.createBuffer(1, 1, 22050);
            const source = audioContext.createBufferSource();
            source.buffer = buffer;
            source.connect(audioContext.destination);
            source.start(0);
          }

          console.log('AudioContext已初始化');
        }
      } catch (e) {
        console.error('无法初始化AudioContext:', e);
      }
    }

    // 删除事件监听器
    document.removeEventListener('click', handleInteraction);
    document.removeEventListener('touchstart', handleInteraction);
    document.removeEventListener('keydown', handleInteraction);
  };

  // 添加事件监听器等待用户交互
  document.addEventListener('click', handleInteraction, { once: true });
  document.addEventListener('touchstart', handleInteraction, { once: true });
  document.addEventListener('keydown', handleInteraction, { once: true });

  userInteractionListenerAdded = true;
  console.log('已添加用户交互监听器以启用音效');
}

/**
 * 尝试播放音效，处理浏览器自动播放政策问题
 * @param audio Audio元素引用
 * @param onSuccess 成功播放时的回调
 * @param onError 播放失败时的回调
 */
export function tryPlaySound(
  audio: HTMLAudioElement | null,
  onSuccess?: () => void,
  onError?: (error: Error | DOMException) => void
) {
  if (!audio) return;

  // 重置音频到开始
  audio.currentTime = 0;

  const playPromise = audio.play();
  if (playPromise !== undefined) {
    playPromise
      .then(() => {
        if (onSuccess) onSuccess();
      })
      .catch((error) => {
        console.log('播放音效失败:', error);
        if (onError) onError(error);

        // 如果是自动播放限制，确保设置了AudioContext
        if (error.name === 'NotAllowedError') {
          setupAudioContext();
        }
      });
  }
}
