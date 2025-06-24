import React from 'react';
import { motion } from 'framer-motion';

interface FloatingIconProps {
  src: string;
  alt?: string;
  className?: string;
}

const FloatingIcon: React.FC<FloatingIconProps> = ({
  src,
  alt = 'floating icon',
  className = '',
}) => {
  return (
    <motion.img
      src={src}
      alt={alt}
      className={className}
      animate={{
        y: [0, -5, 0],
        rotateY: [0, 15, 0],
      }}
      transition={{
        duration: 3,
        repeat: Infinity,
        ease: 'easeInOut',
      }}
    />
  );
};

export default FloatingIcon;
