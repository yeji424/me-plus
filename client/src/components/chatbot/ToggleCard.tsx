import { useState, useRef, useEffect } from 'react';
import { useSpring, animated } from 'react-spring';
import ToggleCardHeader from './ToggleCardHeader';
import ToggleCardContent from './ToggleCardContent';

const dummyDetails = [
  { key: '요금제명', value: '5G 프리미어 플러스' },
  { key: '가격', value: '95,000원' },
  {
    key: '요금제설명',
    value:
      'U⁺5G 서비스는 물론, 스마트 기기 2개와 다양한 콘텐츠까지 마음껏 이용할 수 있는 5G 요금제',
  },
  { key: '데이터', value: '무제한' },
  { key: '공유데이터', value: '테더링 + 쉐어링 100GB' },
  { key: '음성통화', value: '집/이동전화 무제한\n부가 통화 300분' },
  { key: '결합 할인', value: 'U+ 투게더 할인' },
  { key: '기본 혜택', value: 'U+ 모바일tv, U+ 멤버십 VVIP 등급 혜택' },
  {
    key: '특별 혜택',
    value: '프리미엄 서비스 기본 제공(택1)\n미디어 서비스 기본 제공(택1)',
  },
];

function ToggleCard() {
  const [isOpen, setIsOpen] = useState(false);
  const contentRef = useRef<HTMLDivElement>(null);
  const [contentHeight, setContentHeight] = useState(0);
  // header에 보여줄 요금제명, 가격 데이터
  const title =
    dummyDetails.find((item) => item.key === '요금제명')?.value || '';
  const price = dummyDetails.find((item) => item.key === '가격')?.value || '';

  // content에 보여줄 상세 데이터
  const contentDetails = dummyDetails.filter(
    (item) => item.key !== '요금제명' && item.key !== '가격',
  );

  useEffect(() => {
    if (!contentRef.current) return;
    setContentHeight(contentRef.current.scrollHeight + 40);
  }, [isOpen]);

  const animationStyles = useSpring({
    maxHeight: isOpen ? contentHeight : 0,
    opacity: isOpen ? 1 : 0,
    paddingTop: isOpen ? 8 : 0,
    paddingBottom: isOpen ? 12 : 0,
    transform: isOpen ? 'translateY(0)' : 'translateY(20px)',
    overflow: 'hidden',
    config: { tension: 250, friction: 25 },
  });

  return (
    <div
      className="w-[309px] bg-background-40 rounded-lg relative cursor-pointer overflow-hidden"
      onClick={() => setIsOpen(!isOpen)}
    >
      <div className="absolute top-0 left-0 w-[5px] h-full bg-secondary-purple-60" />
      <ToggleCardHeader title={title} price={price} isOpen={isOpen} />
      <animated.div
        style={{
          ...animationStyles,
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
        }}
        className="px-4"
      >
        <div ref={contentRef} className="">
          <ToggleCardContent details={contentDetails} />
        </div>
      </animated.div>
    </div>
  );
}

export default ToggleCard;
