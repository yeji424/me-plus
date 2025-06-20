import { useState } from 'react';
import DraggableScroll from '@/components/common/DraggableScroll';
import ChatButton from '../ChatButton';
import type { CarouselItem } from '../BotBubbleFrame';

interface CarouselButtonGroupProps {
  options: CarouselItem[];
  onButtonClick?: (message: string) => void;
}

const CarouselButtonGroup = ({
  options,
  onButtonClick,
}: CarouselButtonGroupProps) => {
  const [clickedButton, setClickedButton] = useState<string | null>(null);

  const handleButtonClick = (label: string) => {
    if (clickedButton) return; // 이미 클릭된 버튼이 있으면 무시

    setClickedButton(label);
    onButtonClick?.(label);
  };

  return (
    <DraggableScroll className="flex flex-nowrap gap-1 hide-scrollbar overflow-visible mx-1.5">
      {options.map((option, idx) => (
        <ChatButton
          key={idx}
          label={option.label}
          disabled={clickedButton !== null && clickedButton !== option.label}
          onClick={() => handleButtonClick(option.label)}
        />
      ))}
    </DraggableScroll>
  );
};

export default CarouselButtonGroup;
