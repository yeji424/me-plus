import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

interface BounceIconProps {
  src: string;
  alt?: string;
  className?: string;
  playAnimation?: boolean;
}

const BounceIcon: React.FC<BounceIconProps> = ({
  src,
  alt = 'bounce icon',
  className = '',
  playAnimation = true,
}) => {
  const [shouldAnimate, setShouldAnimate] = useState(false);

  useEffect(() => {
    if (playAnimation) {

      const timeout = setTimeout(() => setShouldAnimate(true), 50);
      return () => clearTimeout(timeout);
    } else {
      setShouldAnimate(false);
    }
  }, [playAnimation]);

  return (
    <motion.img
      src={src}
      alt={alt}
      className={className}
      initial={{ scale: 1 }}
      animate={
        shouldAnimate
          ? {
              scale: [1, 0.9, 1.1, 1],
            }
          : {}
      }
      transition={{
        duration: 0.6,
        ease: 'easeInOut',
      }}
    />
  );
};

export default BounceIcon;
