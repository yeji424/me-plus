import {
  useEffect,
  useState,
  useRef,
  useLayoutEffect,
  useCallback,
} from 'react';
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
  const measureTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const timersRef = useRef<ReturnType<typeof setTimeout>[]>([]);

  const springStyles = useSpring({
    width: boxSize.width,
    height: boxSize.height,
    config: { tension: 120, friction: 20 }, // 더 부드러운 애니메이션
  });

  // 다단계 크기 측정 함수
  const measureSize = useCallback(() => {
    if (!ghostRef.current) return;

    const measure = () => {
      if (ghostRef.current) {
        const { offsetWidth, offsetHeight } = ghostRef.current;
        const newSize = { width: offsetWidth, height: offsetHeight };

        // 최소 크기 보장 (더 여유롭게)
        const minWidth = 120;
        const minHeight = 40;

        const finalSize = {
          width: Math.max(newSize.width, minWidth),
          height: Math.max(newSize.height, minHeight),
        };

        // 크기가 실제로 변경된 경우에만 업데이트
        setBoxSize((prevBoxSize) => {
          if (
            prevBoxSize.width !== finalSize.width ||
            prevBoxSize.height !== finalSize.height
          ) {
            return finalSize;
          }
          return prevBoxSize;
        });
      }
    };

    // 타이머 정리
    timersRef.current.forEach((timer) => clearTimeout(timer));
    timersRef.current = [];

    // 다단계 측정 (즉시, 50ms 후, 100ms 후)
    measure(); // 즉시 측정

    timersRef.current.push(
      setTimeout(measure, 50), // 50ms 후 재측정
      setTimeout(measure, 100), // 100ms 후 최종 측정
    );
  }, []); // 의존성 배열 비움

  // 여러 번 크기 측정을 시도하여 안정적인 크기 확보
  const scheduleMeasurement = () => {
    // 기존 타이머 클리어
    if (measureTimeoutRef.current !== null) {
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
  useLayoutEffect(() => {
    measureSize();

    // 컴포넌트 언마운트 시 타이머 정리
    return () => {
      timersRef.current.forEach((timer) => clearTimeout(timer));
    };
  }, [displayText, measureSize]);

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
      {/* 숨겨진 텍스트로 크기 측정용 박스 (패딩 추가로 여유공간 확보) */}
      <div
        ref={ghostRef}
        className="absolute invisible max-w-[309px] p-2 text-[14px] leading-5 whitespace-pre-wrap break-words"
        style={{ minHeight: '24px', padding: '12px' }}
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
