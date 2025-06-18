import ChatButton from '../ChatButton';
import OIcon from '@/assets/icon/o_icon.svg';
import XIcon from '@/assets/icon/x_icon.svg';
import DraggableScroll from '@/components/common/DraggableScroll';
import type { OXOption } from '../BotBubbleFrame';

interface OXButtonGroupProps {
  options: OXOption[];
}

const iconMap = {
  o: <OIcon />,
  x: <XIcon />,
};

const OXButtonGroup = ({ options }: OXButtonGroupProps) => {
  return (
    <DraggableScroll className="flex flex-nowrap gap-1 hide-scrollbar overflow-visible">
      {options.map((option) => (
        <ChatButton
          key={option.id}
          label={option.label}
          icon={iconMap[option.id]}
        />
      ))}
    </DraggableScroll>
  );
};

export default OXButtonGroup;
