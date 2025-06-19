import { useState, useRef, useEffect } from 'react';
import { useSpring, animated } from 'react-spring';
import ToggleCardHeader from './ToggleCardHeader';
import ToggleCardContent from './ToggleCardContent';
import type { PlanData } from './BotBubbleFrame';

interface ToggleCardProps {
  plan: PlanData;
}

function ToggleCard({ plan }: ToggleCardProps) {
  const [isOpen, setIsOpen] = useState(false);
  const contentRef = useRef<HTMLDivElement>(null);
  const [contentHeight, setContentHeight] = useState(0);

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

  return (
    <div
      className="w-[309px] bg-background-40 rounded-lg relative cursor-pointer overflow-hidden"
      onClick={() => setIsOpen(!isOpen)}
    >
      <div className="absolute top-0 left-0 w-[5px] h-full bg-secondary-purple-60" />
      {plan.isPopular && (
        <div className="absolute -top-2 -right-2 bg-gradient-to-r from-red-500 to-pink-500 text-white text-xs font-bold px-3 py-1 rounded-full shadow-lg z-10">
          인기
        </div>
      )}
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
          <ToggleCardContent
            details={contentDetails}
            detailUrl={plan.detailUrl}
          />
        </div>
      </animated.div>
    </div>
  );
}

export default ToggleCard;
