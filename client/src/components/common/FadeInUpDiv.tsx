import { motion } from 'framer-motion';
import type { Variants, HTMLMotionProps } from 'framer-motion';

const fadeInUp = (
  custom: number,
  delayUnit = 0.2,
  duration = 0.6,
): Variants => ({
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      delay: custom * delayUnit,
      duration,
      ease: 'easeOut',
    },
  },
});

interface FadeInUpDivProps extends HTMLMotionProps<'div'> {
  custom: number;
  children: React.ReactNode;
  delayUnit?: number;
  duration?: number;
}

const FadeInUpDiv = ({
  custom,
  delayUnit = 0.2,
  duration = 0.6,
  children,
  ...rest
}: FadeInUpDivProps) => (
  <motion.div
    initial="hidden"
    animate="visible"
    custom={custom}
    variants={fadeInUp(custom, delayUnit, duration)}
    {...rest}
  >
    {children}
  </motion.div>
);

export default FadeInUpDiv;
