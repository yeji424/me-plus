import { motion } from 'framer-motion';
import { useState } from 'react';

interface UserBubbleProps {
  message: string;
}

function UserBubble({ message }: UserBubbleProps) {
  const [isVisible, setIsVisible] = useState(false);

  return (
    <div className="space-y-2">
      <motion.div
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0, opacity: 0 }}
        transition={{ duration: 0.4, ease: 'easeOut' }}
        onAnimationComplete={() => setIsVisible(true)}
        style={{ originX: 1, originY: 0 }}
        className={`w-fit max-w-[265px] p-[10px] rounded-tl-xl rounded-br-xl rounded-bl-xl text-sm text-white leading-5 whitespace-pre-wrap break-words overflow-hidden ml-auto ${
          isVisible ? 'user-bubble' : 'bg-[#5732a1]'
        }`}
      >
        {message}
      </motion.div>
    </div>
  );
}

export default UserBubble;
