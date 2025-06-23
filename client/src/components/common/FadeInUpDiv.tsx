import { motion } from 'framer-motion';
import type { Variants, HTMLMotionProps } from 'framer-motion';

const fadeInUp = (custom: number): Variants => ({
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { delay: custom * 0.2, duration: 0.6, ease: 'easeOut' },
  },
});

interface FadeInUpDivProps extends HTMLMotionProps<'div'> {
  custom: number;
  children: React.ReactNode;
}

const FadeInUpDiv = ({ custom, children, ...rest }: FadeInUpDivProps) => (
  <motion.div
    initial="hidden"
    animate="visible"
    custom={custom}
    variants={fadeInUp(custom)}
    {...rest}
  >
    {children}
  </motion.div>
);

export default FadeInUpDiv;
