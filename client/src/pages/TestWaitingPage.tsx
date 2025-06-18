import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import moonerImage from '../assets/image/mooner_hmm.png';

const TestWaitingPage: React.FC = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setTimeout(() => {
      navigate('/test-result');
    }, 1000000);

    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <>
      <div className="absolute inset-0 z-0 bg-gradient-to-b from-[#dfe4fd] to-white" />

      <div className="relative z-10 flex flex-col items-center justify-center min-h-screen px-4">
        <img src={moonerImage} alt="무너흠" className="w-[200px] mb-4" />
        <p className="text-center text-gradation text-2xl font-semibold mb-8">
          잠시만 기다려주세요.
        </p>

        <p className="text-center text-gray400 text-[13px] font-medium">
          고객님에게 어울리는 요금제를 찾고있습니다.
          <br></br>
          통신 상황에 따라 최대 1분 정도의 시간이 소요될 수 있습니다.
        </p>
      </div>
    </>
  );
};

export default TestWaitingPage;
