import DraggableScroll from '@/components/common/DraggableScroll';
import ChatButton from '../ChatButton';
import type { CarouselItem } from '../BotBubbleFrame';

interface CarouselButtonGroupProps {
  options: CarouselItem[];
}

const CarouselButtonGroup = ({ options }: CarouselButtonGroupProps) => {
  return (
    <DraggableScroll className="flex flex-nowrap gap-1 hide-scrollbar overflow-visible">
      {options.map((option, idx) => (
        <ChatButton key={idx} label={option.label} />
      ))}
    </DraggableScroll>
  );
};

export default CarouselButtonGroup;
