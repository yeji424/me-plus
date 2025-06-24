import React from 'react';
import { motion } from 'framer-motion';

interface FloatingIconProps {
  src: string;
  alt?: string;
  className?: string;
  variant?: 'default' | 'large';
}

const FloatingIcon: React.FC<FloatingIconProps> = ({
  src,
  alt = 'floating icon',
  className = '',
  variant = 'default',
}) => {
  const isLarge = variant === 'large';

  return (
    <motion.img
      src={src}
      alt={alt}
      className={className}
      animate={{
        y: isLarge ? [0, -10, 0] : [0, -5, 0],
        rotateY: isLarge ? [0, 0, 0] : [0, 15, 0],
      }}
      transition={{
        duration: isLarge ? 1.5 : 3,
        repeat: Infinity,
        ease: 'easeInOut',
      }}
    />
  );
};

export default FloatingIcon;
