import React from 'react';
import moonerImage from '../assets/image/mooner_main.png';

const TestFirstPage: React.FC = () => {
  return (
    <>
      {/* 배경 그라데이션 */}
      <div className="fixed inset-0 -z-10 bg-gradient-to-b from-[#E7ECFC] to-white" />

      {/* 실제 콘텐츠 */}
      <div className="flex flex-col items-center justify-center min-h-screen px-4">
        <img
          src={moonerImage}
          alt="무너 알려줄게 이미지"
          className="w-[262px] mb-4"
        />
        <p className="text-center text-gray-800 text-2xl font-medium">
          나와{' '}
          <span className="text-primary-pink font-bold">딱 맞는 요금제</span>를
          알아봐요!
        </p>
      </div>
    </>
  );
};

export default TestFirstPage;
