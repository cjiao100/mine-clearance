// 实现一个模态窗
import { useEffect, useRef } from 'react';
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
  useEffect(() => {
    if (visible) {
      dialogRef.current?.showModal();
    } else {
      dialogRef.current?.close();
    }
  }, [visible]);

  return (
    <dialog ref={dialogRef} className="modal modal-middle transition-all duration-300 ease-in-out">
      <div className="bg-base-100 rounded-xl p-5 card-shadow max-w-md w-full backdrop-blur-sm animate-fadeIn">
        <div className="flex justify-between items-center mb-3">
          <h2 className="text-xl font-bold text-base-content">{title}</h2>
          <button 
            className="btn btn-circle btn-sm btn-ghost" 
            onClick={onClose}
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
        <div className={`flex justify-end gap-3 mt-6 ${hiddenBtn && "hidden"}`}>
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
      <form method="dialog" className="modal-backdrop" onClick={onClose}>
        <button>关闭</button>
      </form>
    </dialog>
  );
}

export default Modal;