import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { rules } from '@/utils/rules';
// import { planResults } from '@/data/TestResult';
import { getAllPlans } from '@/api/testPlan';
import { questions } from '@/data/Questions';
import Modal from '@/components/common/Modal';
import Button from '@/components/common/Button';
import SelectButton from '@/components/testPage/SelectButton';
import SelectButton3 from '@/components/testPage/SelectButton3';
import Header from '@/components/common/Header';
import ProgressBar from '../components/testPage/ProgressBar';
import moonerImage from '../assets/image/mooner_hmm.png';
import moonerAhaImage from '../assets/image/mooner_aha.png';
import tips from '../assets/icon/tips.png';
import next from '../assets/icon/next_icon.svg';
import back from '../assets/icon/back_icon.svg';
import { useRef } from 'react';
import type { PlanResult } from '@/components/types/TestResult';

// 컴포넌트 외부로 이동하여 재생성 방지
const localFallbackPlans: PlanResult[] = [
  {
    _id: '6858ee7ffc03f10c86710103',
    id: 'ott-plus',
    name: '5G 프리미어 플러스',
    description:
      'U⁺5G 서비스는 물론, 스마트 기기 2개와 다양한 콘텐츠까지 마음껏 이용할 수 있는 5G 요금제\n프리미엄 서비스 기본 제공(택1)\n음악 구독 서비스 지니, 벅스, FLO 중 선택 가능',
    priority: 2,
    dataUsage: 100,
    callUsage: 100,
    messageUsage: 100,
    price: 105000,
    tagLine: '넷플릭스 / 왓챠 제휴 결합',
    link: 'https://www.lguplus.com/plan/limit-plans/Z202205254',
    isActive: true,
  },
  {
    _id: '6858ee7ffc03f10c86710105',
    id: 'youth1-special',
    name: '5G 라이트 청소년',
    description:
      '저렴한 요금으로 실속있게 U⁺5G 서비스를 이용할 수 있는 청소년 전용 5G 요금제\n최대 1Mbps 속도로 데이터 무제한 이용 가능\n만 18세 이하만 가입가능',
    priority: 1,
    dataUsage: 15,
    callUsage: 100,
    messageUsage: 100,
    price: 45000,
    tagLine: '데이터 무제한 최대 1Mbps 속도',
    link: 'https://www.lguplus.com/mobile/plan/mplan/5g-all/5g-youth/LPZ0000417',
    isActive: true,
  },
  {
    _id: '6858ee7ffc03f10c86710106',
    id: 'youth2-special',
    name: '유스 5G 스탠다드',
    description:
      '일반 5G요금제보다 더 넉넉한 데이터를 이용할 수 있는 청년 전용 5G요금제\n만 19세 이상 만 34세 이하 청년만 가입가능',
    priority: 1,
    dataUsage: 90,
    callUsage: 100,
    messageUsage: 100,
    price: 75000,
    tagLine: '데이터 무제한 최대 5Mbps 속도',
    link: 'https://www.lguplus.com/mobile/plan/mplan/5g-all/5g-young/LPZ1000232',
    isActive: true,
  },
  {
    _id: '6858ee7ffc03f10c86710107',
    id: 'youth3-special',
    name: 'LTE 데이터 시니어 33',
    description:
      '음성통화와 문자메시지는 기본으로 사용하고 저렴한 요금으로 데이터를 이용할 수 있는 실속형 시니어 전용 LTE 요금제\n1시간~3시간마다 문자메시지로 내 위치를 보호자에게 알려주는 실버지킴이 서비스',
    priority: 1,
    dataUsage: 5,
    callUsage: 100,
    messageUsage: 100,
    price: 33000,
    tagLine: '실버지킴이 서비스',
    link: 'https://www.lguplus.com/mobile/plan/mplan/lte-all/lte-senior/LPZ0000296',
    isActive: true,
  },
  {
    _id: '6858ee7ffc03f10c86710103',
    id: 'ott-plus',
    name: '5G 프리미어 플러스',
    description:
      'U⁺5G 서비스는 물론, 스마트 기기 2개와 다양한 콘텐츠까지 마음껏 이용할 수 있는 5G 요금제\n프리미엄 서비스 기본 제공(택1)\n음악 구독 서비스 지니, 벅스, FLO 중 선택 가능',
    priority: 2,
    dataUsage: 100,
    callUsage: 100,
    messageUsage: 100,
    price: 105000,
    tagLine: '넷플릭스 / 왓챠 제휴 결합',
    link: 'https://www.lguplus.com/plan/limit-plans/Z202205254',
    isActive: true,
  },
  {
    _id: '6858ee7ffc03f10c86710102',
    id: 'music-plus',
    name: '5G 프리미어 레귤러',
    description:
      'U⁺5G 서비스는 물론, 스마트기기 1개와 다양한 콘텐츠까지 마음껏 이용할 수 있는 5G 요금제\n미디어 서비스 기본 제공(택1)\n지니, 벅스, FLO 중 선택 가능',
    priority: 3,
    dataUsage: 100,
    callUsage: 100,
    messageUsage: 100,
    price: 95000,
    tagLine: '지니뮤직 제휴 결합',
    link: 'https://www.lguplus.com/mobile/plan/mplan/5g-all/5g-unlimited/LPZ0000433',
    isActive: true,
  },
  {
    _id: '6858ee7ffc03f10c86710104',
    id: 'family',
    name: '5G 프리미어 에센셜',
    description:
      'U⁺5G 서비스를 마음껏 즐길 수 있는 5G 요금제\n친구, 가족과 결합하면 데이터 무제한 요금제를 최대 20,000원 할인',
    priority: 4,
    dataUsage: 100,
    callUsage: 100,
    messageUsage: 100,
    price: 85000,
    tagLine: 'U+ 투게더 결합',
    link: 'https://www.lguplus.com/mobile/plan/mplan/5g-all/5g-unlimited/LPZ0000409',
    isActive: true,
  },
  {
    _id: '6858ee7ffc03f10c86710108',
    id: 'max-data',
    name: '5G 프리미어 에센셜',
    description:
      'U⁺5G 서비스를 마음껏 즐길 수 있는 5G 요금제\nU+ 투게더 결합\n프리미어 요금제 약정할인\n로밍 혜택 프로모션',
    priority: 5,
    dataUsage: 100,
    callUsage: 100,
    messageUsage: 100,
    price: 85000,
    tagLine: '데이터 무제한',
    link: 'https://www.lguplus.com/mobile/plan/mplan/5g-all/5g-unlimited/LPZ0000409',
    isActive: true,
  },
  {
    _id: '6858ee7ffc03f10c86710109',
    id: 'data-high',
    name: '5G 스탠다드',
    description:
      '넉넉한 데이터로 U⁺5G 서비스를 이용할 수 있는 5G 표준 요금제\n최대 5Mbps 속도로 데이터 무제한 이용 가능',
    priority: 5,
    dataUsage: 80,
    callUsage: 100,
    messageUsage: 100,
    price: 75000,
    tagLine: '데이터 무제한 최대 5Mbps 속도',
    link: 'https://www.lguplus.com/mobile/plan/mplan/5g-all/5g-unlimited/LPZ0000415',
    isActive: true,
  },
  {
    _id: '6858ee7ffc03f10c8671010a',
    id: 'data-medium',
    name: '5G 데이터 플러스',
    description:
      '필요한 만큼만 데이터를 선택할 수 있고, 다 쓰고 난 후에도 추가 요금 없이 데이터를 사용할 수 있는 요금제\n최대 1Mbps 속도로 데이터 무제한 이용 가능',
    priority: 5,
    dataUsage: 60,
    callUsage: 100,
    messageUsage: 100,
    price: 66000,
    tagLine: '데이터 무제한 최대 1Mbps 속도',
    link: 'https://www.lguplus.com/mobile/plan/mplan/5g-all/5g-unlimited/LPZ0000782',
    isActive: true,
  },
];

const TestPage = () => {
  const navigate = useNavigate();
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [isTransitioning, setIsTransitioning] = useState(false);

  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedOptions, setSelectedOptions] = useState<{
    [id: number]: string;
  }>({});
  const [showBackModal, setShowBackModal] = useState(false);

  const currentQuestion = questions[currentIndex];
  const selected = selectedOptions[currentQuestion.id];
  const isAnswered = selected !== undefined;
  const moonerSrc = isAnswered ? moonerAhaImage : moonerImage;
  const [fetchedPlans, setFetchedPlans] = useState<PlanResult[]>([]);

  useEffect(() => {
    const fetchPlans = async () => {
      // setIsLoading(true);
      try {
        const res = await getAllPlans();
        setFetchedPlans(res.planResults); // or res if 직접 리턴 시
      } catch (error) {
        console.error('요금제 가져오기 실패:', error);
        setFetchedPlans(localFallbackPlans);
      }
      // setIsLoading(false);
    };

    fetchPlans();
  }, []);

  // const handleGoHome = () => {
  //   navigate('/'); // 메인페이지로 이동
  // };

  const handleBackClick = () => {
    setShowBackModal(true);
  };

  const handleSelect = (value: string) => {
    setSelectedOptions((prev) => ({ ...prev, [currentQuestion.id]: value }));
    setIsTransitioning(true);
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    timeoutRef.current = setTimeout(() => {
      if (currentIndex < questions.length - 1) {
        setCurrentIndex((prev) => prev + 1);
      }
      setIsTransitioning(false);
    }, 1000);
  };

  const handleNext = () => {
    if (currentIndex < questions.length - 1) {
      setCurrentIndex((prev) => prev + 1);
    }
  };

  const handleBack = () => {
    if (currentIndex > 0) {
      setCurrentIndex((prev) => prev - 1);
    }
  };

  const allAnswered = questions.every(
    (q) => selectedOptions[q.id] !== undefined,
  );

  return (
    <div className="px-5 flex flex-col">
      <Header
        title="나에게 잘 어울리는 요금제는?"
        onBackClick={handleBackClick}
      />

      <ProgressBar
        currentStep={currentIndex + 1}
        totalSteps={questions.length}
      />

      <div className="flex flex-col items-center justify-between flex-1 py-6">
        <div className="flex flex-col items-center gap-4 w-full">
          <img src={moonerSrc} alt="무너" className="w-[140px]" />

          <div className="relative w-full flex justify-center">
            <p className="text-center text-gray800 text-[20px] font-semibold w-[calc(100%-64px)]">
              {currentQuestion.text}
            </p>

            <button
              onClick={handleBack}
              disabled={currentIndex === 0 || isTransitioning}
              className="absolute left-0 top-1/2 -translate-y-1/2 p-3 cursor-pointer"
            >
              <img src={back} alt="이전질문" className="w-[8px] h-[16px]" />
            </button>

            <button
              onClick={handleNext}
              disabled={
                currentIndex === questions.length - 1 || isTransitioning
              }
              className="absolute right-0 top-1/2 -translate-y-1/2 p-3 cursor-pointer"
            >
              <img src={next} alt="다음질문" className="w-[8px] h-[16px]" />
            </button>
          </div>

          {currentQuestion.type === 'binary' ? (
            <div className="flex gap-4 mt-3">
              <SelectButton
                label="그렇다"
                selected={selected === 'yes'}
                onClick={() => handleSelect('yes')}
                type="yes"
                disabled={isTransitioning}
              />
              <SelectButton
                label="아니다"
                selected={selected === 'no'}
                onClick={() => handleSelect('no')}
                type="no"
                disabled={isTransitioning}
              />
            </div>
          ) : (
            <div className="flex flex-col gap-3 w-full mt-4">
              {currentQuestion.options?.map((opt) => (
                <SelectButton3
                  key={opt}
                  label={opt}
                  selected={selected === opt}
                  onClick={() => handleSelect(opt)}
                  disabled={isTransitioning}
                />
              ))}
            </div>
          )}

          <div className="flex flex-col items-start mt-6 w-full px-4">
            <div className="flex items-center gap-2">
              <img src={tips} alt="꿀팁" className="w-[17px]" />
              <p className="text-primary text-[12px] font-semibold">꿀팁</p>
            </div>
            <p className="text-gray500 text-[11px] font-medium leading-snug mt-2">
              <span className="text-secondary-purple-80">
                “{currentQuestion.tip.highlight}”
              </span>
              {currentQuestion.tip.rest}
            </p>{' '}
            {allAnswered && (
              <div className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-md px-4 pb-6 z-50">
                <Button
                  onClick={() => {
                    const matchedRules = rules.filter((rule) =>
                      rule.condition(selectedOptions),
                    );

                    const matchedPlans = matchedRules
                      .map((rule) => {
                        if (!rule?.resultId) return undefined;
                        return fetchedPlans.find((p) => p.id === rule.resultId);
                      })
                      .filter((p): p is PlanResult => !!p); // null/undefined 제거

                    const sortedPlans = matchedPlans.sort(
                      (a, b) => a.priority - b.priority,
                    );

                    const bestPlan = sortedPlans[0];

                    if (bestPlan) {
                      navigate('/test-wait', {
                        state: { planId: bestPlan.id },
                      });
                    } else {
                      alert('조건에 맞는 요금제를 찾을 수 없어요.');
                    }
                  }}
                  fullWidth
                  size="large"
                  variant="custom"
                  className="bg-secondary-purple-60 text-white text-[14px] px-4 py-[10px] rounded-[10px] font-medium w-full"
                >
                  Me플러스 맞춤 추천 받기
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
      <Modal
        isOpen={showBackModal}
        onClose={() => setShowBackModal(false)}
        modalTitle="맞춤형 요금제 찾기를 그만두시겠어요?"
        modalDesc="홈으로 이동하면 현재 진행 중인 테스트는 초기화됩니다."
      >
        <Button
          variant="secondary"
          size="medium"
          fullWidth
          onClick={() => setShowBackModal(false)}
        >
          계속할래요
        </Button>

        <Button
          variant="primary"
          size="medium"
          fullWidth
          onClick={() => {
            navigate('/');
            setShowBackModal(false);
          }}
        >
          그만둘래요
        </Button>
      </Modal>
    </div>
  );
};

export default TestPage;
