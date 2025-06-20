import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
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

const questions = [
  {
    id: 1,
    text: 'Wi-Fi 환경보다는 모바일 데이터를 더 자주 사용하시나요?',
    tag: '고용량 데이터',
    type: 'binary',
    tip: {
      highlight: '그렇다',
      rest: '를 선택했을 경우, 데이터 사용량이 많은 가능성이 높아요!',
    },
  },
  {
    id: 2,
    text: '음악이나 영상처럼 데이터 사용량이 큰 콘텐츠를 자주 이용하시나요?',
    tag: '고용량 데이터',
    type: 'binary',
    tip: {
      highlight: '그렇다',
      rest: '를 선택했을 경우, 데이터 사용량이 많은 가능성이 높아요!',
    },
  },
  {
    id: 3,
    text: '음악 스트리밍 서비스를 자주 사용하시나요?',
    tag: '음악 구독 결합',
    type: 'binary',
    tip: {
      highlight: '그렇다',
      rest: '를 선택했을 경우, 음악 구독 결합 혜택이 좋을 것 같아요!',
    },
  },
  {
    id: 4,
    text: 'OTT(구독형 영상 서비스)를 자주 사용하시나요?',
    tag: 'OTT 구독 결합',
    type: 'binary',
    tip: {
      highlight: '그렇다',
      rest: '를 선택했을 경우, OTT 구독 결합 혜택이 좋을 것 같아요!',
    },
  },
  {
    id: 5,
    text: '연락할 때는 어떤 소통 방식을 선호하시나요?',
    tag: '고용량 데이터',
    type: 'multiple',
    options: [
      '전화 및 문자',
      '메신저, SNS 등의 모바일 앱',
      '화상 통화 및 영상 회의',
    ],
    tip: {
      highlight: '메신저, SNS 등의 모바일 앱',
      rest: '을 선택했을 경우, 데이터 사용량이 많을 가능성이 높아요!',
    },
  },
  {
    id: 6,
    text: '해외 여행이나 출장이 자주 있으신가요?',
    tag: '로밍 결합',
    type: 'binary',
    tip: {
      highlight: '그렇다',
      rest: '를 선택했을 경우, 해외로밍 비용이 저렴한게 좋아요!',
    },
  },
  {
    id: 7,
    text: '통화 시간이 긴 편인가요?',
    tag: '통화량',
    type: 'binary',
    tip: {
      highlight: '그렇다',
      rest: '를 선택했을 경우, 음성통화량 무제한이 좋아요!',
    },
  },
];

const TestPage = () => {
  const navigate = useNavigate();

  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedOptions, setSelectedOptions] = useState<{
    [id: number]: string;
  }>({});

  const currentQuestion = questions[currentIndex];
  const selected = selectedOptions[currentQuestion.id];
  const isAnswered = selected !== undefined;
  const moonerSrc = isAnswered ? moonerAhaImage : moonerImage;

  const handleGoHome = () => {
    navigate('/'); // 메인페이지로 이동
  };

  const handleSelect = (value: string) => {
    setSelectedOptions((prev) => ({ ...prev, [currentQuestion.id]: value }));
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
    <div className="h-screen flex flex-col">
      <Header title="나에게 잘 어울리는 요금제는?" onBackClick={handleGoHome} />
      <ProgressBar
        currentStep={currentIndex + 1}
        totalSteps={questions.length}
      />

      <div className="flex flex-col items-center justify-between flex-1 px-4 py-6">
        <div className="flex flex-col items-center gap-4 w-full">
          <img src={moonerSrc} alt="무너" className="w-[140px]" />

          <div className="relative w-full px-4">
            <p className="text-center text-gray800 text-[20px] font-semibold">
              {currentQuestion.text}
            </p>

            <button
              onClick={handleBack}
              disabled={currentIndex === 0}
              className="absolute left-0 top-1/2 -translate-y-1/2"
            >
              <img src={back} alt="이전질문" className="w-[8px] h-[16px]" />
            </button>

            <button
              onClick={handleNext}
              disabled={currentIndex === questions.length - 1}
              className="absolute right-0 top-1/2 -translate-y-1/2"
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
              />
              <SelectButton
                label="아니다"
                selected={selected === 'no'}
                onClick={() => handleSelect('no')}
                type="no"
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
              <div className="w-full mt-10">
                <Button
                  fullWidth
                  variant="primary"
                  size="large"
                  onClick={() => navigate('/test-wait')}
                >
                  Me플러스 맞춤 추천 받기
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TestPage;
