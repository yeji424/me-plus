import { useState } from 'react';
import ChatButton from '../ChatButton';
import type { TextItem } from '../BotBubbleFrame';

interface TextButtonGroupProps {
  options: TextItem[];
  onButtonClick?: (message: string) => void;
}

const TextButtonGroup = ({ options, onButtonClick }: TextButtonGroupProps) => {
  const [clickedButton, setClickedButton] = useState<string | null>(null);

  const handleButtonClick = (label: string) => {
    if (clickedButton) return;

    setClickedButton(label);
    onButtonClick?.(label);
  };

  return (
    <div className="overflow-visible inline-flex flex-col gap-1 items-start px-1 mx-1.5">
      {options.map((option, idx) => (
        <ChatButton
          key={idx}
          label={option.label}
          disabled={clickedButton !== null && clickedButton !== option.label}
          onClick={() => handleButtonClick(option.label)}
        />
      ))}
    </div>
  );
};

export default TextButtonGroup;
