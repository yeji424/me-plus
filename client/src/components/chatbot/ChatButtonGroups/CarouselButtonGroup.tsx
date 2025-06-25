import { useState } from 'react';
import DraggableScroll from '@/components/common/DraggableScroll';
import ChatButton from '../ChatButton';
import type { CarouselItem } from '../BotBubbleFrame';

interface CarouselButtonGroupProps {
  options: CarouselItem[];
  onButtonClick?: (message: string) => void;
  onCarouselSelect?: (
    carouselData: CarouselItem[],
    selectedItem: CarouselItem,
  ) => void;
  selectedData?: {
    selectedItem?: CarouselItem;
    selectedServices?: string[];
    isSelected: boolean;
  }; // 새로 추가
}

const CarouselButtonGroup = ({
  options,
  onButtonClick,
  onCarouselSelect,
  selectedData, // 새로 추가
}: CarouselButtonGroupProps) => {
  const [clickedButton, setClickedButton] = useState<string | null>(
    selectedData?.isSelected && selectedData.selectedItem
      ? selectedData.selectedItem.label
      : null,
  );

  const handleButtonClick = (option: CarouselItem) => {
    if (clickedButton) return; // 이미 클릭된 버튼이 있으면 무시

    setClickedButton(option.label);
    onButtonClick?.(option.label);

    onCarouselSelect?.(options, option);
  };

  return (
    <>
      <DraggableScroll className="flex flex-nowrap gap-2">
        {options.map((option, idx) => (
          <ChatButton
            key={idx}
            label={option.label}
            disabled={clickedButton !== null && clickedButton !== option.label}
            onClick={() => handleButtonClick(option)}
          />
        ))}
      </DraggableScroll>
    </>
  );
};

export default CarouselButtonGroup;
