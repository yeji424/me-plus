import { motion } from 'framer-motion';
import React from 'react';
import { useNavigate } from 'react-router-dom';

interface AnimatedCardWrapperProps {
  className?: string;
  children: React.ReactNode;
  to?: string;
  onClick?: () => void;
  shouldHighlight?: boolean; // 반짝임 활성화 여부
}

const AnimatedCardWrapper: React.FC<AnimatedCardWrapperProps> = ({
  className = '',
  children,
  to,
  onClick,
  shouldHighlight = false,
}) => {
  const navigate = useNavigate();

  const handleTap = () => {
    if (onClick) {
      onClick();
    }
    if (to) {
      setTimeout(() => {
        navigate(to);
      }, 400);
    }
  };

  return (
    <motion.div
      className={className}
      whileHover={{
        scale: 0.97,
        transition: { duration: 0.2, ease: 'easeInOut' },
      }}
      whileTap={{ scale: 0.95, transition: { duration: 0.2, ease: 'easeOut' } }}
      onTap={handleTap}
    >
      {/* 반짝임 레이어 */}
      {shouldHighlight && (
        <motion.div
          className="absolute inset-0 rounded-[17px] pointer-events-none z-0"
          style={{ boxShadow: '0 0 6px 1.5px rgba(255, 192, 203, 0.6)' }}
          animate={{
            scale: [1, 1.01, 1],
            boxShadow: [
              '0 0 6px 1.5px rgba(255, 192, 203, 0.6)',
              '0 0 8px 2px rgba(255, 192, 203, 0.9)',
              '0 0 6px 1.5px rgba(255, 192, 203, 0.6)',
            ],
          }}
          transition={{
            repeat: Infinity,
            duration: 1.5,
            ease: 'easeInOut',
          }}
        />
      )}

      <div className="relative z-10 w-full">{children}</div>
    </motion.div>
  );
};

export default AnimatedCardWrapper;
