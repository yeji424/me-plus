import { useRef, useEffect, useState, type ReactNode } from 'react';
import { motion } from 'framer-motion';

type Props = {
  children: ReactNode;
  className?: string;
};

const DraggableScroll = ({ children, className = '' }: Props) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const innerRef = useRef<HTMLDivElement>(null);
  const [constraints, setConstraints] = useState({ left: 0, right: 0 });

  const updateConstraints = () => {
    const container = containerRef.current;
    const inner = innerRef.current;
    if (container && inner) {
      const containerWidth = container.offsetWidth;
      const innerWidth = inner.scrollWidth;
      const scrollDistance = innerWidth - containerWidth;
      setConstraints({
        left: -Math.max(scrollDistance, 0),
        right: 0,
      });
    }
  };

  useEffect(() => {
    updateConstraints();
    window.addEventListener('resize', updateConstraints); // 리사이즈 대응
    return () => window.removeEventListener('resize', updateConstraints);
  }, []);

  useEffect(() => {
    updateConstraints();
  }, [children]);

  return (
    <div
      ref={containerRef}
      className={`${className.includes('overflow-') ? '' : 'overflow-hidden'} ${className}`}
    >
      <motion.div
        ref={innerRef}
        className={`flex ${className}`}
        drag="x"
        dragConstraints={constraints}
        dragElastic={0.1}
        whileTap={{ cursor: 'grabbing' }}
        style={{ cursor: 'grab' }}
      >
        {children}
      </motion.div>
    </div>
  );
};

export default DraggableScroll;
