import {
  useRef,
  useEffect,
  useState,
  useCallback,
  type ReactNode,
} from 'react';
import { motion } from 'framer-motion';

type Props = {
  children: ReactNode;
  className?: string;
};

const DraggableScroll = ({ children, className = '' }: Props) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const innerRef = useRef<HTMLDivElement>(null);
  const [constraints, setConstraints] = useState({ left: 0, right: 0 });

  const updateConstraints = useCallback(() => {
    const container = containerRef.current;
    const inner = innerRef.current;
    if (container && inner) {
      const containerWidth = container.offsetWidth;
      const innerWidth = inner.scrollWidth;
      const scrollDistance = innerWidth - containerWidth;
      const newConstraints = {
        left: -Math.max(scrollDistance, 0),
        right: 0,
      };

      // 실제로 변경된 경우에만 업데이트
      setConstraints((prev) => {
        if (
          prev.left !== newConstraints.left ||
          prev.right !== newConstraints.right
        ) {
          return newConstraints;
        }
        return prev;
      });
    }
  }, []);

  useEffect(() => {
    updateConstraints();
    window.addEventListener('resize', updateConstraints);
    return () => window.removeEventListener('resize', updateConstraints);
  }, [updateConstraints]);

  useEffect(() => {
    // children이 변경된 후 DOM이 업데이트될 시간을 주기 위해 약간의 지연
    const timer = setTimeout(updateConstraints, 0);
    return () => clearTimeout(timer);
  }, [children, updateConstraints]);

  return (
    <div
      ref={containerRef}
      className={`overflow-hidden max-w-full -ml-1`}
      style={{ maxWidth: 'calc(min(100vw, 600px) - 74px)' }}
    >
      <div className="overflow-hidden">
        <motion.div
          ref={innerRef}
          className={`flex pl-1 py-[10px] ${className}`}
          style={{ maxWidth: 'calc(min(100vw, 600px) - 90px)', cursor: 'grab' }}
          drag="x"
          dragConstraints={constraints}
          dragElastic={0.1}
          whileTap={{ cursor: 'grabbing' }}
        >
          {children}
          <div className="w-[1px] shrink-0" />
        </motion.div>
      </div>
    </div>
  );
};

export default DraggableScroll;
