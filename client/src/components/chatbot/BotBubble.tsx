import React, { useEffect, useState } from 'react';

const sampleChunks = [
  '혹시 가족 구성원 중 ',
  '**만 18세 이하의',
  ' 청소년 자녀**가 ',
  '있으신가요? ',
  '있으시다면 ',
  '**추가 결합 혜택**도 ',
  '안내해드릴게요!',
  '\n줄바꿈 처리도 해보았습니다. ',
  '**나눈 강조 중간에 줄바꿈이\n 있다면..?',
  ' 청소년 자녀**가 ',
  '있으신가요? ',
  '있으시다면 ',
  '**추가 결합 혜택**도 ',
  '안내\n해드릴게요!',
];

// 강조 텍스트, 줄바꿈 유지하면서 글자 단위로 나누기
const parseMarkedTextToChars = (text: string) => {
  // 기존 parseMarkedText를 글자 단위로 변환
  // 1) **강조** 처리
  // 2) 줄바꿈 \n 처리

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
    }, 100);

    return () => clearTimeout(timer);
  }, [currentIndex, buffer]);

  // displayText를 글자단위로 파싱해서 fade-in 효과
  const chars = parseMarkedTextToChars(displayText);

  return (
    <div className="bot-bubble" style={{ whiteSpace: 'pre-wrap' }}>
      {chars.map((item, idx) => {
        if (item.char === '\n') {
          return <br key={idx} />;
        }

        return (
          <span
            key={idx}
            className={item.isBold ? 'text-primary-pink fade-in' : 'fade-in'}
            style={{ animationDelay: `${idx * 30}ms` }}
          >
            {item.char}
          </span>
        );
      })}
    </div>
  );
};

export default BotBubble;
