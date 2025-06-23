import { motion } from 'framer-motion';
import TypingDots from './TypingDots';

interface LoadingBubbleProps {
  type?: 'searching' | 'waiting' | 'dbcalling';
}

const loadingMessages = {
  searching: '정확한 정보를 찾고 있어요',
  waiting: '잠시만 기다려주세요',
  dbcalling: '데이터를 불러오는 중이예요',
};

const LoadingBubble = ({ type }: LoadingBubbleProps) => {
  return (
    <motion.div
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      exit={{ scale: 0, opacity: 0 }}
      transition={{ duration: 0.4, ease: 'easeOut' }}
      style={{ originX: 0, originY: 0 }}
      className="w-fit flex items-center max-w-[309px] p-[10px] rounded-tr-xl rounded-br-xl rounded-bl-xl text-sm text-gray700 leading-5 whitespace-pre-wrap break-words overflow-hidden mr-auto bg-white"
    >
      {type && <span>{loadingMessages[type]}</span>}
      <div className={type ? 'ml-[7px] mr-[2px] my-1' : 'my-1 mx-[1px]'}>
        <TypingDots />
      </div>
    </motion.div>
  );
};

export default LoadingBubble;
