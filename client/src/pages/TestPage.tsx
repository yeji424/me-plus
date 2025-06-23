import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { rules } from '@/utils/rules';
import { planResults } from '@/data/TestResult';
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

  // const getRecommendedPlan = (answers: { [key: number]: string }) => {
  //   return TestResult.find((plan) => plan.condition(answers))!;
  // };

  return (
    <div className="h-screen flex flex-col">
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

          <div className="relative w-full px-4">
            <p className="text-center text-gray800 text-[20px] font-semibold">
              {currentQuestion.text}
            </p>

            <button
              onClick={handleBack}
              disabled={currentIndex === 0 || isTransitioning}
              className="absolute left-0 top-1/2 -translate-y-1/2"
            >
              <img src={back} alt="이전질문" className="w-[8px] h-[16px]" />
            </button>

            <button
              onClick={handleNext}
              disabled={
                currentIndex === questions.length - 1 || isTransitioning
              }
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
                      .map((rule) =>
                        planResults.find((p) => p.id === rule.resultId),
                      )
                      .filter((p): p is PlanResult => !!p);

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
