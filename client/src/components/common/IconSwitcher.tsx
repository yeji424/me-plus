import React from 'react';
import { motion } from 'framer-motion';

interface IconSwitcherProps {
  isAnswered: boolean;
  shouldBounce: boolean;
  srcAnswered: string;
  srcIdle: string;
  alt?: string;
  className?: string;
}

const IconSwitcher: React.FC<IconSwitcherProps> = ({
  isAnswered,
  shouldBounce,
  srcAnswered,
  srcIdle,
  alt = 'icon',
  className = '',
}) => {
  const isLarge = true;

  const animation = isAnswered
    ? shouldBounce
      ? { scale: [1, 0.9, 1.1, 1], y: 0, rotateY: 0 }
      : { scale: 1, y: [0, -10, 0], rotateY: 0 }
    : { scale: 1, y: [0, -10, 0], rotateY: [0, 15, 0] };

  return (
    <motion.img
      // key={isAnswered ? 'answered' : 'idle'}
      src={isAnswered ? srcAnswered : srcIdle}
      alt={alt}
      className={className}
      initial={{ scale: 1 }}
      animate={animation}
      transition={{
        duration: shouldBounce ? 0.6 : isLarge ? 1.5 : 3,
        repeat: shouldBounce ? 0 : Infinity,
        ease: 'easeInOut',
      }}
    />
  );
};

export default IconSwitcher;
