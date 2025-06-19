import { useState } from 'react';
import ChatButton from '../ChatButton';
import OIcon from '@/assets/icon/o_icon.svg?react';
import XIcon from '@/assets/icon/x_icon.svg?react';
import DraggableScroll from '@/components/common/DraggableScroll';
import type { OXOption } from '../BotBubbleFrame';

interface OXButtonGroupProps {
  options: OXOption[];
  onButtonClick?: (message: string) => void;
}

const iconMap = {
  o: <OIcon />,
  x: <XIcon />,
};

const OXButtonGroup = ({ options, onButtonClick }: OXButtonGroupProps) => {
  const [clickedButton, setClickedButton] = useState<string | null>(null);

  const handleButtonClick = (label: string) => {
    if (clickedButton) return;

    setClickedButton(label);
    onButtonClick?.(label);
  };

  return (
    <DraggableScroll className="flex flex-nowrap gap-1 hide-scrollbar overflow-visible">
      {options.map((option) => (
        <ChatButton
          key={option.id}
          label={option.label}
          icon={iconMap[option.id]}
          disabled={clickedButton !== null && clickedButton !== option.label}
          onClick={() => handleButtonClick(option.label)}
        />
      ))}
    </DraggableScroll>
  );
};

export default OXButtonGroup;
