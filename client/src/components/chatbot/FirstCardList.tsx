import CardData from '@/assets/image/card_data.png';
import CardOtt from '@/assets/image/card_ott.png';
import CardMoney from '@/assets/image/card_money.png';
import CardFamily from '@/assets/image/card_family.png';
import DraggableScroll from '../common/DraggableScroll';

const cardData = [
  {
    id: 1,
    image: CardData,
    title: '고용량 데이터',
    content: '막힘없는 인터넷 사용을 원한다면',
    subcontent: '[ 고용량 데이터 ]',
    buttonText: '상담하기',
    message: '고용량 데이터 요금제를 추천해주세요.',
  },
  {
    id: 2,
    image: CardOtt,
    title: 'OTT 애청자',
    content: '평소 영상 시청 빈도가 잦다면',
    subcontent: '[ 고용량 데이터 + OTT 구독 결합 ]',
    buttonText: '상담하기',
    message: 'OTT 서비스가 포함된 요금제를 추천해주세요.',
  },
  {
    id: 3,
    image: CardMoney,
    title: '경제형 사용자',
    content: '통화와 데이터 사용량 모두 적다면',
    subcontent: '[ 저렴한 가격 ]',
    buttonText: '상담하기',
    message: '가장 저렴한 요금제를 추천해주세요.',
  },
  {
    id: 4,
    image: CardFamily,
    title: '가족 결합형',
    content: '가족이 U+를 사용중이라면',
    subcontent: '[ 최대 2만원 할인 ]',
    buttonText: '상담하기',
    message: '가족 결합 할인이 있는 요금제를 추천해주세요.',
  },
];

// 코드가 길지않아 그냥 한 파일에 넣었습니다
const CardItem = ({
  item,
  onButtonClick,
}: {
  item: (typeof cardData)[0];
  onButtonClick: (message: string) => void;
}) => {
  return (
    <div className="w-[152px] shrink-0 flex flex-col items-center gap-[18px] p-[10px] rounded-[12px] bg-gradation-background shadow-small">
      <img
        src={item.image}
        alt={item.title}
        draggable={false}
        className="w-full h-auto object-contain"
      />
      <div className="w-full flex flex-col items-center gap-2">
        <div className="text-[14px] font-semibold leading-[14px]">
          {item.title}
        </div>
        <div className="flex flex-col items-center text-[10px]">
          <div className="text-gray700">{item.content}</div>
          <div className=" font-semibold tracking-[-0.06em] text-secondary-purple-80">
            {item.subcontent}
          </div>
        </div>
      </div>
      <button
        className="cursor-pointer w-full px-[15px] py-[6px] rounded-[5.5px] bg-primary-pink text-white font-semibold text-[9px] text-center"
        onClick={() => onButtonClick(item.message)}
      >
        {item.buttonText}
      </button>
    </div>
  );
};

const FirstCardList = ({
  onButtonClick,
}: {
  onButtonClick?: (message: string) => void;
}) => {
  const handleButtonClick = (message: string) => {
    if (onButtonClick) {
      onButtonClick(message);
    }
  };

  return (
    <DraggableScroll className="mx-1 flex flex-nowrap gap-[6px] hide-scrollbar overflow-visible">
      {cardData.map((item) => (
        <CardItem key={item.id} item={item} onButtonClick={handleButtonClick} />
      ))}
    </DraggableScroll>
  );
};

export default FirstCardList;
