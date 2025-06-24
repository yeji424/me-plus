import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

interface BounceIconProps {
  src: string;
  alt?: string;
  className?: string;
  playAnimation?: boolean;
  animationType?: 'scaleIn' | 'bounce';
}

const BounceIcon: React.FC<BounceIconProps> = ({
  src,
  alt = 'bounce icon',
  className = '',
  playAnimation = true,
  animationType = 'scaleIn',
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

  const getScaleAnimation = () => {
    if (!shouldAnimate) return {};
    if (animationType === 'scaleIn') {
      return { scale: [0.4, 1.2, 1.1] };
    }
    if (animationType === 'bounce') {
      return { scale: [0.4, 1.3, 1.2] };
    }
    return {};
  };

  return (
    <motion.img
      src={src}
      alt={alt}
      className={className}
      initial={{ scale: 1 }}
      animate={getScaleAnimation()}
      transition={{
        duration: 1.2,
        ease: 'easeInOut',
      }}
    />
  );
};

export default BounceIcon;
