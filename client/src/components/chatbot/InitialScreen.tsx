import FirstCardList from './FirstCardList';

export const InitialScreen = ({
  onButtonClick,
}: {
  onButtonClick: (message: string) => void;
}) => {
  return (
    <div className="flex flex-col items-center space-y-6 pt-8">
      {/* 안내 멘트 */}
      <div className="w-full max-w-[400px] text-center space-y-3">
        <div className="text-xl font-bold text-gray-800">
          안녕하세요! 요금제 추천 AI 챗봇 Me+입니다 👋
        </div>
        <div className="text-sm text-gray-600 leading-relaxed">
          고객님의 사용 패턴과 요구사항을 바탕으로
          <br />
          최적의 요금제를 추천해드립니다.
        </div>
        <div className="text-xs text-gray-500">
          아래 카드 중 하나를 선택하거나 직접 질문해주세요!
        </div>
      </div>

      {/* FirstCardList */}
      <div className="w-full">
        <FirstCardList onButtonClick={onButtonClick} />
      </div>
    </div>
  );
};
