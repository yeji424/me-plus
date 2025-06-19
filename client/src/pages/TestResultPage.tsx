import UsageBar from '@/components/testPage/UsageBar';
import moonerFunImage from '../assets/image/mooner_fun.png';
import Header from '@/components/common/Header';
import confetti from '../assets/image/confetti.png';
import { useNavigate } from 'react-router-dom';
import plus from '@/assets/icon/plus.png';

const TestResultPage = () => {
  // const saved = localStorage.getItem('recommendedPlan');
  // const plan = saved ? JSON.parse(saved) : null;
  // const { id, name } = plan || {};
  const navigate = useNavigate();

  const handleBackClick = () => {
    navigate('/'); // 모달 없이 바로 홈으로 이동
  };

  return (
    <div className="h-screen flex flex-col items-center text-center px-4">
      <Header
        title="나에게 잘 어울리는 요금제는?"
        onBackClick={handleBackClick}
      />

      <div className="mt-4 text-[21.5px] font-bold text-secondary-purple-80">
        LG U+ 5G 프리미어 플러스 요금제
      </div>

      <div className="mt-2 px-4 py-1 bg-gradation rounded-full text-[17px] text-white font-semibold inline-flex items-center gap-1">
        <img src={plus} alt="더해서" className="w-[16px] h-[16px]" />
        넷플릭스 / 왓챠 제휴 결합
      </div>

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
        <UsageBar label="통화" percent={40} />
        <UsageBar label="메시지" percent={20} />
        <UsageBar label="데이터" percent={100} />
      </div>

      <ul className="text-sm text-gray500 mt-4 list-disc pl-6 w-full max-w-md text-left">
        <li>영상 콘텐츠를 즐겨요</li>
        <li>메시지 위주로 소통해요</li>
        <li>집에서도 데이터를 사용해요</li>
      </ul>

      <div className="mt-6 text-[32px] font-bold text-pink-500">
        월 130,000원
      </div>

      <div className="flex gap-4 mt-6 w-full max-w-md">
        <button
          onClick={() => navigate('/chatbot')}
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
