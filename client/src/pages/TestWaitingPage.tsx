import React, { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import moonerImage from '../assets/image/mooner_hmm.png';
import FloatingIcon from '@/components/common/FloatingIcon';

const TestWaitingPage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const planId = location.state?.planId;

  useEffect(() => {
    const timer = setTimeout(() => {
      navigate('/test-result', { state: { planId } });
    }, 1500);

    return () => clearTimeout(timer);
  }, [navigate, planId]);

  return (
    <>
      {/* 전체 배경 */}
      <div className="absolute inset-0 z-0 bg-gradient-to-b from-[#dfe4fd] to-white" />
      {/* 가운데 콘텐츠 */}
      <div className="absolute inset-0 z-10 flex items-center justify-center">
        <div className="flex flex-col items-center justify-center gap-6">
          <FloatingIcon
            variant="large"
            src={moonerImage}
            alt="무너흠"
            className="w-[200px]"
          />
          <p className="shimmer-text text-center text-gradation text-2xl font-semibold mb-8">
            잠시만 기다려주세요.
          </p>
          <p className="text-center text-gray400 text-[13px] font-medium tracking-tight leading-relaxed">
            고객님에게 어울리는 요금제를 찾고있습니다.
            <br />
            통신 상황에 따라 최대 1분 정도의 시간이 소요될 수 있습니다.
          </p>
        </div>
      </div>
    </>
  );
};

export default TestWaitingPage;
