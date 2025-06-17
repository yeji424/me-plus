import React, { useEffect, useState, useRef, useLayoutEffect } from 'react';
import { useSpring, animated } from '@react-spring/web';

const sampleChunks = [
  '혹시 가족 구성원 중 ',
  '**만 18세 이하의',
  ' 청소년 자녀**가 ',
  '있으신가요? ',
  '\n있으시다면 ',
  '**추가 결합 혜택**도 ',
  '안내해드릴게요!',
];

const parseMarkedTextToChars = (text: string) => {
  const parts = text.split(/(\*\*[^*]+\*\*)/g);
  const chars: { char: string; isBold: boolean }[] = [];

  parts.forEach((part) => {
    const isBold = part.startsWith('**') && part.endsWith('**');
    const content = isBold ? part.slice(2, -2) : part;

    for (const ch of content) {
      if (ch === '\n') {
        chars.push({ char: '\n', isBold });
      } else {
        chars.push({ char: ch, isBold });
      }
    }
  });

  return chars;
};

const BotBubble = () => {
  const [buffer, setBuffer] = useState('');
  const [displayText, setDisplayText] = useState('');
  const [currentIndex, setCurrentIndex] = useState(0);
  const ghostRef = useRef<HTMLDivElement>(null);

  const [boxSize, setBoxSize] = useState({ width: 0, height: 0 });

  const chars = parseMarkedTextToChars(displayText);

  // 텍스트 렌더 함수
  const renderText = (
    charList: { char: string; isBold: boolean }[],
    withAnimation = false,
  ) => {
    return charList.map((item, idx) =>
      item.char === '\n' ? (
        <br key={idx} />
      ) : (
        <span
          key={idx}
          className={`${item.isBold ? 'text-primary-pink' : ''} ${withAnimation ? 'fade-in' : ''}`}
          style={
            withAnimation ? { animationDelay: `${idx * 30}ms` } : undefined
          }
        >
          {item.char}
        </span>
      ),
    );
  };

  // measure text size
  useLayoutEffect(() => {
    if (ghostRef.current) {
      const { offsetWidth, offsetHeight } = ghostRef.current;
      setBoxSize({ width: offsetWidth, height: offsetHeight });
    }
  }, [displayText]);

  const springStyles = useSpring({
    width: boxSize.width,
    height: boxSize.height,
    config: { tension: 180, friction: 22 },
  });

  useEffect(() => {
    if (currentIndex >= sampleChunks.length) return;

    const timer = setTimeout(() => {
      const chunk = sampleChunks[currentIndex];

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

  return (
    <>
      {/* 숨겨진 텍스트로 크기 측정 (애니메이션용)*/}
      <div
        ref={ghostRef}
        className="absolute invisible max-w-[309px] p-2 text-xs leading-5 whitespace-pre-wrap break-words"
      >
        {renderText(chars)}
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
        {renderText(chars, true)}
      </animated.div>
    </>
  );
};

export default BotBubble;
