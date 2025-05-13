// 实现一个模态窗
import { useEffect, useRef } from 'react';

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
      <div className="modal-box">
        <div className="flex justify-between items-center">
          <h2 className="text-lg font-bold">{title}</h2>
          <button className="btn btn-sm btn-circle" onClick={onClose}>
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>
        </div>
        {children && (
          <div className="my-4">
            {children}
          </div>
        )}
        {message && (
          <div className="my-4">
            <p>{message}</p>
          </div>
        )}
        <div className={`modal-action ${hiddenBtn && "hidden"}`}>
          <button className="btn btn-primary" onClick={onClose}>确定</button>
          <button className="btn ml-2" onClick={onClose}>取消</button>
        </div>
      </div>
      <form method="dialog" className="modal-backdrop" onClick={onClose}>
        <button>关闭</button>
      </form>
    </dialog>
  );
}

export default Modal;