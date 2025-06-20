import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import type { PlanResult } from '@/components/types/TestResult';
import TestResult from '@/data/TestResult';

import UsageBar from '@/components/testPage/UsageBar';
import moonerFunImage from '../assets/image/mooner_fun.png';
import Header from '@/components/common/Header';
import confetti from '../assets/image/confetti.png';
import plus from '@/assets/icon/plus.png';

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
  const [plan, setPlan] = useState<PlanResult | null>(null);

  useEffect(() => {
    const savedId = localStorage.getItem('recommendedPlanId');
    if (savedId) {
      const result = TestResult.find((p) => p.result.id === savedId);
      if (result) {
        setPlan(result.result);
      }
    }
  }, []);

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

  if (!plan) {
    return <div>로딩 중...</div>; // 또는 로딩 UI
  }

  return (
    <div className="h-screen flex flex-col items-center text-center px-4">
      <Header
        title="나에게 잘 어울리는 요금제는?"
        onBackClick={handleBackClick}
      />

      <div className="mt-4 text-[21.5px] font-bold text-secondary-purple-80">
        {plan.name}
      </div>

      {plan.tagLine && (
        <div className="mt-2 px-4 py-1 bg-gradation rounded-full text-[17px] text-white font-semibold inline-flex items-center gap-1">
          <img src={plus} alt="더해서" className="w-[16px] h-[16px]" />
          {plan.tagLine}
        </div>
      )}

      <div className="relative w-full flex justify-center items-center mt-6">
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
      </div>

      <div className="mt-6 w-full max-w-md">
        <UsageBar label="통화" percent={plan.callUsage} />
        <UsageBar label="메시지" percent={plan.messageUsage} />
        <UsageBar label="데이터" percent={plan.dataUsage} />
      </div>

      <ul className="text-sm text-gray500 mt-4 list-disc pl-6 w-full max-w-md text-left">
        {plan.description.split('\n').map((line, idx) => (
          <li key={idx}>{line}</li>
        ))}
      </ul>

      <div className="mt-6 text-[32px] font-bold text-pink-500">
        월 {plan.price?.toLocaleString()}원
      </div>

      <div className="flex gap-4 mt-6 w-full max-w-md">
        <button
          onClick={handleChatbotClick}
          className="w-1/2 rounded-xl bg-secondary-purple-40 text-gray600 text-sm font-semibold py-3"
        >
          챗봇 상담하기
        </button>

        <button className="w-1/2 rounded-xl bg-secondary-purple-80 text-white text-[14px] font-semibold py-3">
          요금제 바꾸러가기
        </button>
      </div>
    </div>
  );
};

export default TestResultPage;
