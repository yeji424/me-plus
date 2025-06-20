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
  const measureTimeoutRef = useRef<number | null>(null);

  const springStyles = useSpring({
    width: boxSize.width,
    height: boxSize.height,
    config: { tension: 120, friction: 20 }, // 더 부드러운 애니메이션
  });

  // 크기 측정 함수
  const measureSize = () => {
    if (ghostRef.current) {
      const { offsetWidth, offsetHeight } = ghostRef.current;
      setBoxSize((prev) => {
        // 크기가 이전보다 작아지지 않도록 보장 (텍스트가 줄어들 때만 예외)
        const newWidth = Math.max(offsetWidth, prev.width * 0.8);
        const newHeight = Math.max(offsetHeight, prev.height * 0.8);
        return { width: newWidth, height: newHeight };
      });
    }
  };

  // 여러 번 크기 측정을 시도하여 안정적인 크기 확보
  const scheduleMeasurement = () => {
    // 기존 타이머 클리어
    if (measureTimeoutRef.current) {
      clearTimeout(measureTimeoutRef.current);
    }

    // 즉시 한 번 측정
    measureSize();

    // 50ms 후 재측정 (렌더링 완료 후)
    measureTimeoutRef.current = setTimeout(() => {
      measureSize();

      // 추가로 100ms 후 한 번 더 측정 (안전장치)
      measureTimeoutRef.current = setTimeout(() => {
        measureSize();
      }, 100);
    }, 50);
  };

  useLayoutEffect(() => {
    scheduleMeasurement();
  }, [displayText]);

  // 스트리밍 응답에 맞게 단순화
  useEffect(() => {
    if (messageChunks.length > 0) {
      setDisplayText(messageChunks[0]);
    }
  }, [messageChunks]);

  // 컴포넌트 언마운트 시 타이머 정리
  useEffect(() => {
    return () => {
      if (measureTimeoutRef.current) {
        clearTimeout(measureTimeoutRef.current);
      }
    };
  }, []);

  const chars = parseMarkedTextToChars(displayText);

  return (
    <>
      {/* 숨겨진 텍스트로 크기 측정용 박스*/}
      <div
        ref={ghostRef}
        className="absolute invisible max-w-[309px] p-2 text-[14px] leading-5 whitespace-pre-wrap break-words"
        style={{ minHeight: '24px' }} // 최소 높이 보장
      >
        <MarkedText chars={chars} />
      </div>

      {/* 애니메이션 되는 박스 */}
      <animated.div
        style={{
          ...springStyles,
          minHeight: '44px', // 최소 높이 보장 (padding 포함)
        }}
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
