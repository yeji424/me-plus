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
  const timersRef = useRef<number[]>([]);

  const springStyles = useSpring({
    width: boxSize.width,
    height: boxSize.height,
    config: { tension: 180, friction: 22 },
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

  const chars = parseMarkedTextToChars(displayText);

  return (
    <>
      {/* 숨겨진 텍스트로 크기 측정용 박스 (패딩 추가로 여유공간 확보) */}
      <div
        ref={ghostRef}
        className="absolute invisible max-w-[309px] p-3 text-[14px] leading-5 whitespace-pre-wrap break-words"
        style={{ padding: '12px' }} // 더 여유로운 패딩
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
