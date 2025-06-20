import { useEffect, useState, useRef, useLayoutEffect } from 'react';
import { useSpring, animated } from '@react-spring/web';
import { parseMarkedTextToChars } from '@/utils/parseMarkedTextToChars';
import MarkedText from './MarkedText';

interface BotBubbleProps {
  messageChunks: string[];
}

const BotBubble = ({ messageChunks }: BotBubbleProps) => {
  const [displayText, setDisplayText] = useState('');
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

  // 스트리밍 응답에 맞게 단순화
  useEffect(() => {
    if (messageChunks.length > 0) {
      setDisplayText(messageChunks[0]);
    }
  }, [messageChunks]);

  const chars = parseMarkedTextToChars(displayText);

  return (
    <>
      {/* 숨겨진 텍스트로 크기 측정용 박스*/}
      <div
        ref={ghostRef}
        className="absolute invisible max-w-[309px] p-2 text-[14px] leading-5 whitespace-pre-wrap break-words"
      >
        <MarkedText chars={chars} />
      </div>

      {/* 애니메이션 되는 박스 */}
      <animated.div
        style={springStyles}
        className="
      max-w-[309px]
      p-[10px]
      rounded-tr-xl rounded-br-xl rounded-bl-xl
      bg-background-40
      text-[14px]
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
