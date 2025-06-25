import { useState, useRef, useEffect } from 'react';
import { useSpring, animated } from 'react-spring';
import ToggleCardHeader from './ToggleCardHeader';
import ToggleCardContent from './ToggleCardContent';
import type { PlanData } from './BotBubbleFrame';

export interface ColorTheme {
  textColor: string;
  borderColor: string;
  bgColor: string;
  hoverBgColor: string;
}

interface ToggleCardProps {
  plan: PlanData;
  onToggleClick?: (cardRef: HTMLDivElement) => void;
}

function ToggleCard({ plan, onToggleClick }: ToggleCardProps) {
  const [isOpen, setIsOpen] = useState(false);
  const contentRef = useRef<HTMLDivElement>(null);
  const [contentHeight, setContentHeight] = useState(0);
  const cardRef = useRef<HTMLDivElement>(null);

  // 색상 테마 중앙 관리
  const colorTheme = {
    textColor: plan.isPopular
      ? 'text-primary-pink'
      : 'text-secondary-purple-60',
    borderColor: plan.isPopular
      ? 'border-primary-pink'
      : 'border-secondary-purple-60',
    bgColor: plan.isPopular ? 'bg-primary-pink' : 'bg-secondary-purple-60',
    hoverBgColor: plan.isPopular
      ? 'hover:bg-primary-pink'
      : 'hover:bg-secondary-purple-60',
  };

  // 데이터 포맷팅 함수들
  const formatPrice = (price: number) => {
    return price.toLocaleString('ko-KR') + '원';
  };

  const formatData = (dataGb: number) => {
    if (dataGb === -1) return '무제한';
    return `${dataGb}GB`;
  };

  const formatVoice = (voiceMinutes: number, addonVoiceMinutes: number) => {
    const base =
      voiceMinutes === -1 ? '집/이동전화 무제한' : `${voiceMinutes}분`;
    const addon =
      addonVoiceMinutes > 0 ? `\n부가 통화 ${addonVoiceMinutes}분` : '';
    return base + addon;
  };

  // header에 보여줄 요금제명, 가격 데이터
  const title = plan.name;
  const price = formatPrice(plan.monthlyFee);

  // content에 보여줄 상세 데이터 생성
  const contentDetails = [
    { key: '요금제설명', value: plan.description },
    { key: '데이터', value: formatData(plan.dataGb) },
    { key: '공유데이터', value: `테더링 + 쉐어링 ${plan.sharedDataGb}GB` },
    {
      key: '음성통화',
      value: formatVoice(plan.voiceMinutes, plan.addonVoiceMinutes),
    },
    ...(plan.bundleBenefit
      ? [{ key: '결합 할인', value: plan.bundleBenefit }]
      : []),
    { key: '기본 혜택', value: plan.basicService },
    ...(plan.mediaAddons
      ? [{ key: '미디어 서비스', value: plan.mediaAddons }]
      : []),
    ...(plan.premiumAddons
      ? [{ key: '프리미엄 서비스', value: plan.premiumAddons }]
      : []),
    ...(plan.optionalDiscountAmount > 0
      ? [
          {
            key: '할인 혜택',
            value: `최대 ${formatPrice(plan.optionalDiscountAmount)} 할인 가능`,
          },
        ]
      : []),
    ...(plan.ageGroup !== 'ALL'
      ? [
          {
            key: '대상',
            value: plan.ageGroup === 'YOUTH' ? '청년 전용' : plan.ageGroup,
          },
        ]
      : []),
  ];

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

  const handleClick = () => {
    const wasOpen = isOpen;
    setIsOpen(!isOpen);

    // 카드가 닫혀있다가 열릴 때만 스크롤 요청
    if (!wasOpen && onToggleClick && cardRef.current) {
      // 애니메이션이 완료된 후 스크롤하도록 지연
      setTimeout(() => {
        onToggleClick(cardRef.current!);
      }, 300); // 애니메이션 duration과 맞춤
    }
  };

  return (
    <div
      ref={cardRef}
      className="w-[265px] bg-background-40 rounded-lg relative cursor-pointer overflow-hidden"
      onClick={handleClick}
    >
      <div
        className={`absolute top-0 left-0 w-[5px] h-full ${colorTheme.bgColor}`}
      />

      <ToggleCardHeader
        title={title}
        price={price}
        isOpen={isOpen}
        isPopular={plan.isPopular}
        colorTheme={colorTheme}
      />
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
          <ToggleCardContent
            details={contentDetails}
            detailUrl={plan.detailUrl}
            colorTheme={colorTheme}
          />
        </div>
      </animated.div>
    </div>
  );
}

export default ToggleCard;
