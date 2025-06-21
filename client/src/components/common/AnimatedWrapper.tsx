import { motion, useAnimation } from 'framer-motion';
import React from 'react';
import { useNavigate } from 'react-router-dom';

interface AnimatedCardWrapperProps {
  className?: string;
  children: React.ReactNode;
  to: string;
}
const AnimatedCardWrapper: React.FC<AnimatedCardWrapperProps> = ({
  className = '',
  children,
  to,
}) => {
  const controls = useAnimation();
  const navigate = useNavigate();

  const handleTapStart = () => {
    controls.start({
      scaleX: 2,
      opacity: 0.15,
      transition: { duration: 0.2, ease: 'easeOut' },
    });
  };

  const handleTapEnd = () => {
    controls.start({
      opacity: 0,
      transition: { duration: 0.3, ease: 'easeIn' },
    });
  };

  const handleTap = () => {
    setTimeout(() => {
      navigate(to);
    }, 400);
  };

  return (
    <motion.div
      whileHover={{
        scale: 0.97,
        transition: { duration: 0.2, ease: 'easeInOut' },
      }}
      whileTap={{ scale: 0.95, transition: { duration: 0.2, ease: 'easeOut' } }}
      onTapStart={handleTapStart}
      onTapCancel={handleTapEnd}
      onTap={() => {
        handleTap();
        handleTapEnd();
      }}
      className={`relative rounded-[17px] p-[1px] overflow-hidden cursor-pointer ${className}`}
    >
      <motion.div
        style={{ transformOrigin: 'center' }}
        className="absolute top-0 bottom-0 left-[20px] right-[20px] z-20 bg-black/90 rounded-[16px]"
        initial={{ scaleX: 0, opacity: 0 }}
        animate={controls}
      />
      <div className="relative z-10 rounded-[16px]">{children}</div>
    </motion.div>
  );
};

export default AnimatedCardWrapper;
