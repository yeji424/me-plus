import { useState, useEffect } from 'react';
import ChatButton from '../ChatButton';
import OIcon from '@/assets/icon/o_icon.svg?react';
import XIcon from '@/assets/icon/x_icon.svg?react';
import DraggableScroll from '@/components/common/DraggableScroll';
import type { OXOption } from '../BotBubbleFrame';

interface OXButtonGroupProps {
  options: OXOption[];
  onButtonClick?: (message: string) => void;
  onOxSelect?: (selectedOption: string) => void;
  selectedData?: { selectedOption: string; isSelected: boolean };
}

const iconMap = {
  o: <OIcon />,
  x: <XIcon />,
};

const OXButtonGroup = ({
  options,
  onButtonClick,
  onOxSelect,
  selectedData,
}: OXButtonGroupProps) => {
  const [clickedButton, setClickedButton] = useState<string | null>(
    selectedData?.isSelected ? selectedData.selectedOption : null,
  );

  // selectedData가 변경될 때마다 상태 업데이트
  useEffect(() => {
    if (selectedData?.isSelected && selectedData.selectedOption) {
      setClickedButton(selectedData.selectedOption);
    } else {
      setClickedButton(null);
    }
  }, [selectedData]);

  const handleButtonClick = (label: string) => {
    if (clickedButton) return;

    setClickedButton(label);
    onButtonClick?.(label);
    onOxSelect?.(label); // 선택 상태를 로컬스토리지에 저장하기 위해 호출
  };

  return (
    <>
      <DraggableScroll className="flex flex-nowrap gap-2">
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
    </>
  );
};

export default OXButtonGroup;
