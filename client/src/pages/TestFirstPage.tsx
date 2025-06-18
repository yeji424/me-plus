import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import moonerImage from '../assets/image/mooner_main.png';

const TestFirstPage: React.FC = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setTimeout(() => {
      navigate('/test1');
    }, 1500);

    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <>
      <div className="absolute inset-0 z-0 bg-gradient-to-b from-[#dfe4fd] to-white" />

      <div className="relative z-10 flex flex-col items-center justify-center min-h-screen px-4">
        <img
          src={moonerImage}
          alt="무너 알려줄게 이미지"
          className="w-[262px] mb-4"
        />
        <p className="text-center text-gray-800 text-2xl font-semibold">
          나와{' '}
          <span className="text-primary-pink font-semibold">
            딱 맞는 요금제
          </span>
          를 알아봐요!
        </p>
      </div>
    </>
  );
};

export default TestFirstPage;
