import React, { useEffect, useRef, useState, useCallback } from 'react';
import { motion, useAnimation } from 'framer-motion';

interface AnimatedShakerProps {
  className?: string;
  children: React.ReactNode;
  idleTime?: number;
}

const AnimatedShaker: React.FC<AnimatedShakerProps> = ({
  className = '',
  children,
  idleTime = 3000,
}) => {
  const controls = useAnimation();
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [isIdle, setIsIdle] = useState(false);

  // 인터랙션 발생 시 타이머 초기화
  const resetTimer = useCallback(() => {
    setIsIdle(false);
    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => {
      setIsIdle(true);
    }, idleTime);
  }, [idleTime]);

  useEffect(() => {
    resetTimer();

    const events = ['click', 'keydown', 'mousemove', 'touchstart'];

    events.forEach((event) => {
      window.addEventListener(event, resetTimer);
    });

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
      events.forEach((event) => {
        window.removeEventListener(event, resetTimer);
      });
    };
  }, [idleTime, resetTimer]);

  useEffect(() => {
    if (isIdle) {
      controls.start({
        rotate: [0, -0.5, 0.5, -0.5, 0],
        transition: {
          duration: 1.5,
          repeat: Infinity,
          repeatDelay: 2,
          ease: 'easeInOut',
        },
      });
    } else {
      controls.start({
        rotate: 0,
        transition: { duration: 0.3, ease: 'easeOut' },
      });
    }
  }, [isIdle, controls]);

  return (
    <motion.div className={className} animate={controls}>
      {children}
    </motion.div>
  );
};

export default AnimatedShaker;
