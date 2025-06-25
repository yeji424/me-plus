import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import FloatingIcon from '@/components/common/FloatingIcon';
import moonerImage from '../assets/image/mooner_main.png';

const TestFirstPage: React.FC = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setTimeout(() => {
      navigate('/test');
    }, 1500);

    return () => clearTimeout(timer);
  }, [navigate]);

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
            className="w-[262px]"
          />

          <p className="text-center text-2xl font-semibold mt-6 shimmer-text text-gray-800">
            나와 <span className="text-primary-pink">딱 맞는 요금제</span>를
            알아봐요!
          </p>
        </div>
      </div>
    </>
  );
};
export default TestFirstPage;
