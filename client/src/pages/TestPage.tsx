import { useState } from 'react';
import SelectButton from '@/components/common/SelectButton';
import Header from '@/components/common/Header';
import ProgressBar from '../components/common/ProgressBar';
import moonerImage from '../assets/image/mooner_hmm.png';
import tips from '../assets/icon/tips.png';
import next from '../assets/icon/next_icon.svg';
import back from '../assets/icon/back_icon.svg';

const TestPage = () => {
  const currentStep = 1;
  const [selectedOption, setSelectedOption] = useState<'yes' | 'no' | null>(
    null,
  );

  return (
    <div className="h-screen overflow-hidden flex flex-col">
      <Header title="나에게 잘 어울리는 요금제는?" />
      <ProgressBar currentStep={currentStep} />

      <div className="flex flex-col items-center justify-between flex-1 px-4 py-6">
        <div className="flex flex-col items-center gap-4 w-full">
          <img src={moonerImage} alt="무너hmm" className="w-[140px]" />

          <div className="flex items-center justify-center w-full px-4 gap-3">
            <img src={back} alt="이전질문" className="w-[8px] h-[16px]" />
            <p className="text-center text-gray-800 text-[20px] font-semibold">
              Wi-Fi 환경보다는 모바일 데이터를 더 자주 사용하시나요?
            </p>
            <img src={next} alt="다음질문" className="w-[8px] h-[16px]" />
          </div>

          <div className="flex gap-4 mt-3">
            <SelectButton
              label="그렇다"
              selected={selectedOption === 'yes'}
              onClick={() => setSelectedOption('yes')}
              type="yes"
            />
            <SelectButton
              label="아니다"
              selected={selectedOption === 'no'}
              onClick={() => setSelectedOption('no')}
              type="no"
            />
          </div>

          <div className="flex flex-col items-start mt-6 w-full px-4">
            <div className="flex items-center gap-2">
              <img src={tips} alt="꿀팁" className="w-[17px]" />
              <p className="text-primary text-[12px] font-semibold leading-snug">
                꿀팁
              </p>
            </div>
            <p className="text-gray-500 text-[11px] font-semibold leading-snug mt-1">
              <span className="text-secondary-purple-80">“그렇다”</span>를
              선택했을 경우, 데이터 사용량이 많은 가능성이 높아요!
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TestPage;
