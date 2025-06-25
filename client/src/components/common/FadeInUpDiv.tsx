import { motion } from 'framer-motion';
import type { Variants, HTMLMotionProps } from 'framer-motion';

const fadeInY = (
  custom: number,
  reverse: boolean,
  delayUnit = 0.2,
  duration = 0.6,
): Variants => {
  const offsetY = reverse ? -20 : 20;
  return {
    hidden: { opacity: 0, y: offsetY },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        delay: custom * delayUnit,
        duration,
        ease: 'easeOut',
      },
    },
  };
};

interface FadeInUpDivProps extends HTMLMotionProps<'div'> {
  custom: number;
  children: React.ReactNode;
  delayUnit?: number;
  duration?: number;
  reverse?: boolean;
}

const FadeInUpDiv = ({
  custom,
  delayUnit = 0.2,
  duration = 0.6,
  reverse = false,
  children,
  ...rest
}: FadeInUpDivProps) => (
  <motion.div
    initial="hidden"
    animate="visible"
    custom={custom}
    variants={fadeInY(custom, reverse, delayUnit, duration)}
    {...rest}
  >
    {children}
  </motion.div>
);

export default FadeInUpDiv;
