import { useEffect } from 'react';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  modalTitle: string;
  modalDesc?: string;
  children: React.ReactNode;
}

const Modal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  modalTitle,
  modalDesc,
  children,
}) => {
  useEffect(() => {
    if (!isOpen) return;

    const handleEsc = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };

    window.addEventListener('keydown', handleEsc);

    return () => {
      window.removeEventListener('keydown', handleEsc);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 bg-black/50 flex justify-center items-center z-50 min-w-2xs"
      onClick={onClose}
    >
      <div
        className="bg-background rounded-[20px] p-6 w-[88%] max-w-[528px] flex flex-col gap-[20px]"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex flex-col gap-[15px]">
          <h2 className="font-semibold text-xl">{modalTitle}</h2>
          <p className="text-gray500 text-[13px]">{modalDesc}</p>
        </div>
        <div className="flex justify-center gap-[13px]">{children}</div>
      </div>
    </div>
  );
};

export default Modal;
