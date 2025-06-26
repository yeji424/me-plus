import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';

interface ToastAlertProps {
  message: string;
  onClose?: () => void;
}

function ToastAlert({ message, onClose }: ToastAlertProps) {
  const [visible, setVisible] = useState(true);
  const [isClosing, setIsClosing] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsClosing(true);
    }, 2500);

    return () => clearTimeout(timer);
  }, []);

  const handleAnimationEnd = () => {
    if (isClosing) {
      setVisible(false);
      if (onClose) onClose();
    }
  };

  if (!visible) return null;

  return createPortal(
    <div
      style={{
        position: 'fixed',
        top: '15px',
        left: '50%',
        transform: 'translateX(-50%)',
        width: 'calc(100% - 20px)',
        maxWidth: '560px',
        padding: '16px 20px',
        backgroundColor: 'rgba(255, 255, 255, 1)',
        borderRadius: '12px',
        boxShadow: '0 0 10px rgba(0, 0, 0, 0.08)',
        fontSize: '14px',
        lineHeight: '19px',
        textAlign: 'center',
        color: '#6B7280',
        zIndex: 9999,
        animation: isClosing
          ? 'slideUp 0.3s ease forwards'
          : 'slideDown 0.3s ease forwards',
        whiteSpace: 'pre-line',
      }}
      onAnimationEnd={handleAnimationEnd}
    >
      {message}
      <style>
        {`
          @keyframes slideDown {
            from {
              opacity: 0.7;
              transform: translate(-50%, -20px);
            }
            to {
              opacity: 1;
              transform: translate(-50%, 0);
            }
          }

          @keyframes slideUp {
            from {
              opacity: 1;
              transform: translate(-50%, 0);
            }
            to {
              opacity: 0;
              transform: translate(-50%, -20px);
            }
          }
        `}
      </style>
    </div>,
    document.body,
  );
}

export default ToastAlert;
