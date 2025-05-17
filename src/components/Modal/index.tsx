// 实现一个模态窗
import { useEffect, useRef, useState } from 'react';
import CloseIcon from "@/assets/icons/close.svg";

interface ModalProps {
  visible: boolean;
  title: string;
  message?: string;
  onClose: () => void;
  hiddenBtn?: boolean;
  children: React.ReactNode;
}

const Modal: React.FC<ModalProps> = ({ visible, title, message, onClose, children, hiddenBtn = false }) => {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const [isAnimating, setIsAnimating] = useState(false);

  // 处理dialog原生的关闭事件
  useEffect(() => {
    const dialogElement = dialogRef.current;

    if (dialogElement) {
      const handleClose = () => {
        if (visible) {
          // 如果visible仍为true但dialog关闭了，同步状态
          onClose();
        }
      };

      dialogElement.addEventListener('close', handleClose);
      return () => {
        dialogElement.removeEventListener('close', handleClose);
      };
    }
  }, [dialogRef, visible, onClose]);

  // 处理模态窗的显示
  useEffect(() => {
    if (visible) {
      // 显示模态窗
      setIsAnimating(true);
      requestAnimationFrame(() => {
        dialogRef.current?.showModal();
      });

      // 添加键盘事件监听，支持ESC键关闭
      const handleKeyDown = (e: KeyboardEvent) => {
        if (e.key === 'Escape') {
          e.preventDefault(); // 阻止默认的ESC关闭行为，使用我们自己的动画
          onClose();
        }
      };
      window.addEventListener('keydown', handleKeyDown);

      return () => {
        window.removeEventListener('keydown', handleKeyDown);
      };
    } else if (dialogRef.current?.open) {
      // 关闭模态窗，添加延迟以便动画完成
      setIsAnimating(false);
      const timer = setTimeout(() => {
        if (dialogRef.current) {
          dialogRef.current.close();
        }
      }, 250); // 略小于动画持续时间

      return () => clearTimeout(timer);
    }
  }, [visible, onClose]);

  // 处理点击模态窗背景时的关闭
  const handleBackdropClick = (e: React.MouseEvent<HTMLDialogElement>) => {
    // 只有在点击dialog元素自身时才关闭模态框
    if (e.target === dialogRef.current) {
      onClose();
    }
  };

  return (
    <dialog
      ref={dialogRef}
      className="modal modal-backdrop:bg-base-200/70 modal-backdrop:backdrop-blur-sm"
      onClick={handleBackdropClick}
      aria-labelledby="modal-title"
    >
      <div
        className={`bg-base-100 rounded-xl p-5 card-shadow max-w-md w-full transform transition-all duration-300 ease-out ${
          isAnimating
            ? 'opacity-100 scale-100 translate-y-0'
            : 'opacity-0 scale-95 translate-y-4'
        }`}
        onClick={(e) => e.stopPropagation()} // 阻止内容区域的点击事件冒泡
        role="dialog"
        aria-modal="true"
      >
        <div className="flex justify-between items-center mb-3">
          <h2 className="text-xl font-bold text-base-content" id="modal-title">{title}</h2>
          <button
            className="btn btn-circle btn-sm btn-ghost hover:bg-base-200/80"
            onClick={onClose}
            aria-label="关闭"
          >
            <img src={CloseIcon} width="18" height="18" alt="关闭" />
          </button>
        </div>
        {children && (
          <div className="my-4 text-base-content">
            {children}
          </div>
        )}
        {message && (
          <div className="my-4">
            <p className="text-base-content/90">{message}</p>
          </div>
        )}
        <div className={`flex justify-end gap-3 mt-6 ${hiddenBtn ? "hidden" : ""}`}>
          <button
            className="btn btn-ghost"
            onClick={onClose}
          >
            取消
          </button>
          <button
            className="btn btn-primary"
            onClick={onClose}
          >
            确定
          </button>
        </div>
      </div>
    </dialog>
  );
}

export default Modal;