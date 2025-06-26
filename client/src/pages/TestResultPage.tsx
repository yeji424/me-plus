import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLocation } from 'react-router-dom';
import type { PlanResult } from '@/components/types/TestResult';
// import { planResults } from '@/data/TestResult';
import { getAllPlans } from '@/api/testPlan';
import UsageBar from '@/components/testPage/UsageBar';
import moonerFunImage from '../assets/image/mooner_fun.png';
import Header from '@/components/common/Header';
import confetti from '../assets/image/confetti.png';
import plus from '@/assets/icon/plus.png';
import TestWaitingPage from './TestWaitingPage';
import Modal from '@/components/common/Modal';

import Confetti from 'react-confetti';
import { useWindowSize } from 'react-use';
import { AnimatePresence, motion } from 'framer-motion';
import BounceIcon from '@/components/common/BounceIcon';
import Button from '@/components/common/Button';
import FadeInUpDiv from '@/components/common/FadeInUpDiv';

// 사용자 정보 타입 정의
interface UserProfile {
  plan: {
    id: string;
    name: string;
    monthlyFee: number;
    benefits: string[];
  };
  usage: {
    call: number;
    message: number;
    data: number;
  };
  preferences: string[];
  source: 'plan-test'; // 어디서 온 사용자인지 구분
}

// 사용자 정보를 URL 파라미터로 인코딩하는 함수
const generateChatbotURL = (userProfile: UserProfile): string => {
  try {
    // UTF-8 문자를 올바르게 인코딩하기 위한 방법
    const encodedProfile = btoa(
      unescape(encodeURIComponent(JSON.stringify(userProfile))),
    );
    return `/chatbot?profile=${encodedProfile}`;
  } catch (error) {
    console.error('URL 생성 실패:', error);
    return '/chatbot';
  }
};

const TestResultPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const planId = location.state?.planId as string | undefined;
  const [plan, setPlan] = useState<PlanResult | null>(null);
  const { width, height } = useWindowSize();
  const [showConfetti, setShowConfetti] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    const fetchPlan = async () => {
      if (!planId || typeof planId !== 'string') return;

      try {
        const res = await getAllPlans();
        const matched = res.planResults.find((p) => p.id === planId);
        if (matched) setPlan(matched);
        else console.warn('해당 ID에 맞는 요금제가 없습니다.');
      } catch (err) {
        console.error('요금제 조회 실패:', err);
      }
    };

    fetchPlan();
  }, [planId]);
  useEffect(() => {
    const timer = setTimeout(() => {
      setShowConfetti(false);
    }, 1500);
    return () => clearTimeout(timer);
  }, []);

  if (!planId) {
    return <div>추천 정보가 없습니다. 테스트를 다시 시작해주세요.</div>;
  }

  const handleBackClick = () => {
    navigate('/');
  };

  const handleChatbotClick = () => {
    if (!plan) return;

    // 플랜 ID에 따른 혜택 매핑
    const getBenefits = (planId: string): string[] => {
      switch (planId) {
        case 'ott-plus':
          return ['넷플릭스', '왓챠', '무제한 데이터'];
        case 'music-plus':
          return ['지니뮤직', '무제한 데이터'];
        case 'family':
          return ['U+ 투게더', '가족 할인'];
        case 'youth1-special':
        case 'youth2-special':
        case 'youth3-special':
          return ['청소년 전용', '데이터 무제한'];
        case 'max-data':
        case 'max-high':
          return ['데이터 무제한', '고속 인터넷'];
        default:
          return ['기본 혜택'];
      }
    };

    // 실제 플랜 데이터를 기반으로 UserProfile 생성
    const userProfile: UserProfile = {
      plan: {
        id: plan.id,
        name: plan.name,
        monthlyFee: plan.price || 0,
        benefits: getBenefits(plan.id),
      },
      usage: {
        call: plan.callUsage,
        message: plan.messageUsage,
        data: plan.dataUsage,
      },
      preferences: plan.description.split('\n').filter((line) => line.trim()),
      source: 'plan-test',
    };

    const chatbotURL = generateChatbotURL(userProfile);
    navigate(chatbotURL);
  };

  //여기까지 현훈님 작성코드

  if (!plan) {
    return <TestWaitingPage />;
  }

  return (
    <>
      {isModalOpen && (
        <Modal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          modalTitle="요금제 자세히 알아보기"
          modalDesc="요금제 상세 페이지는 LG U+외부 사이트로 연결됩니다. 계속 진행하시겠습니까?"
        >
          <Button
            variant="secondary"
            size="medium"
            fullWidth
            onClick={() => setIsModalOpen(false)}
          >
            취소
          </Button>

          <Button
            variant="primary"
            size="medium"
            fullWidth
            onClick={() => {
              if (plan?.link) window.open(plan.link, '_blank');
              setIsModalOpen(false);
            }}
          >
            이동하기
          </Button>
        </Modal>
      )}

      <div className="absolute inset-0 bg-gradient-to-b from-[#dfe4fd] to-white z-0" />
      <Header
        title="나에게 잘 어울리는 요금제는?"
        onBackClick={handleBackClick}
        isSpecialColor={true}
      />
      <div className=" z-10 p-5 flex flex-1 flex-col w-full items-center text-center bg-transparent">
        <motion.div
          initial={{ scale: 0.7, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{
            duration: 1.2,
            ease: 'easeOut',
          }}
        >
          <div className="z-10 flex flex-col justify-center mt-10 gap-2">
            <div className="z-10 text-[21.5px] font-semibold text-secondary-purple-80">
              {plan.name}
            </div>
            {plan.tagLine && (
              <div className="px-4 py-1 shimmer-text shimmer-text-slow bg-gradation rounded-full text-[17px] text-white font-semibold inline-flex items-center gap-1">
                <img src={plus} alt="더해서" className="w-[16px] h-[16px]" />
                {plan.tagLine}
              </div>
            )}
          </div>
        </motion.div>

        {/* <div className="relative w-full flex justify-center items-center mt-6">
        <img
          src={confetti}
          alt="컨페티"
          className="absolute top-0 left-1/2 -translate-x-1/2 w-full z-0"
        />
        <img
          src={moonerFunImage}
          alt="무너"
          className="relative z-10 w-[140px]"
        />
      </div> */}

        {plan && (
          <>
            <AnimatePresence>
              {showConfetti && (
                <motion.div
                  initial={{ opacity: 1 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 1 }}
                  style={{
                    position: 'absolute',
                    width: '100%',
                    inset: 0,
                    maxWidth: '600px',
                    margin: '0 auto',
                    overflow: 'hidden',
                    pointerEvents: 'none',
                    zIndex: 9999,
                  }}
                >
                  <Confetti
                    width={width}
                    height={height}
                    numberOfPieces={1200}
                    recycle={false}
                    gravity={1.0}
                    initialVelocityY={40}
                  />
                </motion.div>
              )}
            </AnimatePresence>

            <section className="relative w-full flex flex-col items-center justify-center min-h-[150px] mt-6">
              <BounceIcon
                src={confetti}
                alt="컨페티"
                className="absolute top-0 left-1/2 -translate-x-1/2 w-full z-0"
                animationType="scaleIn"
              />
              <BounceIcon
                src={moonerFunImage}
                alt="무너"
                className="bottom-[-30px] relative z-10 w-[140px]"
                animationType="bounce"
              />
            </section>
          </>
        )}
        <div className="mt-9 relative w-full">
          <div className="mt-4">
            <FadeInUpDiv custom={1}>
              <UsageBar label="통화" percent={plan.callUsage} />
            </FadeInUpDiv>
            <FadeInUpDiv custom={2}>
              <UsageBar label="메시지" percent={plan.messageUsage} />
            </FadeInUpDiv>
            <FadeInUpDiv custom={3}>
              <UsageBar label="데이터" percent={plan.dataUsage} />
            </FadeInUpDiv>
          </div>
          <FadeInUpDiv custom={4} className="mt-6">
            <ul className="pl-5 z-10 text-sm text-gray500 list-disc max-w-[600px] text-left">
              {plan.description.split('\n').map((line, idx) => (
                <li className="leading-[22px] py-[2px]" key={idx}>
                  {line}
                </li>
              ))}
            </ul>
          </FadeInUpDiv>
          <FadeInUpDiv
            custom={6}
            className="z-10 mt-[10px] text-[32px] font-semibold text-primary-pink pb-[50px]"
          >
            월 {plan.price?.toLocaleString()}원
          </FadeInUpDiv>
        </div>
      </div>
      <div className="fade-in-up fixed px-5 pb-6 bottom-0 w-full max-w-[600px] z-10 flex justify-center gap-[13px]">
        <Button
          fullWidth
          variant="secondary"
          size="large"
          onClick={handleChatbotClick}
        >
          챗봇 상담하기
        </Button>
        <Button fullWidth size="large" onClick={() => setIsModalOpen(true)}>
          요금제 자세히보기
        </Button>
      </div>
    </>
  );
};

export default TestResultPage;
