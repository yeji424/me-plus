import { useEffect, useState, useRef, useLayoutEffect } from 'react';
import { useSpring, animated } from '@react-spring/web';
import { parseMarkedTextToChars } from '@/utils/parseMarkedTextToChars';
import MarkedText from './MarkedText';

interface BotBubbleProps {
  messageChunks: string[];
}

const BotBubble = ({ messageChunks }: BotBubbleProps) => {
  const [buffer, setBuffer] = useState('');
  const [displayText, setDisplayText] = useState('');
  const [currentIndex, setCurrentIndex] = useState(0);
  const [boxSize, setBoxSize] = useState({ width: 0, height: 0 });
  const ghostRef = useRef<HTMLDivElement>(null);
  const springStyles = useSpring({
    width: boxSize.width,
    height: boxSize.height,
    config: { tension: 180, friction: 22 },
  });

  useLayoutEffect(() => {
    if (ghostRef.current) {
      const { offsetWidth, offsetHeight } = ghostRef.current;
      setBoxSize({ width: offsetWidth, height: offsetHeight });
    }
  }, [displayText]);

  useEffect(() => {
    if (currentIndex >= messageChunks.length) return;

    const timer = setTimeout(() => {
      const chunk = messageChunks[currentIndex];

      if (buffer || chunk.includes('**')) {
        const combined = buffer + chunk;
        const match = combined.match(/\*\*[^*]+\*\*/);

        if (match) {
          setDisplayText((prev) => prev + combined);
          setBuffer('');
        } else {
          setBuffer(combined);
        }
      } else {
        setDisplayText((prev) => prev + chunk);
      }

      setCurrentIndex((i) => i + 1);
    }, 300);

    return () => clearTimeout(timer);
  }, [currentIndex, buffer]);

  const chars = parseMarkedTextToChars(displayText);

  return (
    <>
      {/* 숨겨진 텍스트로 크기 측정용 박스*/}
      <div
        ref={ghostRef}
        className="absolute invisible max-w-[309px] p-2 text-xs leading-5 whitespace-pre-wrap break-words"
      >
        <MarkedText chars={chars} />
      </div>

      {/* 애니메이션 되는 박스 */}
      <animated.div
        style={springStyles}
        className="
      max-w-[309px]
      p-2
      rounded-tr-lg rounded-br-lg rounded-bl-lg
      bg-background-40
      text-xs
      leading-5
      whitespace-pre-wrap
      break-words
      overflow-hidden
    "
      >
        <MarkedText chars={chars} withAnimation />
      </animated.div>
    </>
  );
};

export default BotBubble;
