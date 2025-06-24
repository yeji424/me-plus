import React from 'react';
import YesIcon from '@/assets/icon/yes.svg?react';
import NoIcon from '@/assets/icon/no.svg?react';

interface SelectButtonProps {
  label: string;
  selected: boolean;
  onClick: () => void;
  type: 'yes' | 'no';
  disabled?: boolean;
}

const SelectButton: React.FC<SelectButtonProps> = ({
  label,
  selected,
  onClick,
  type,
  disabled,
}) => {
  const baseClass =
    'w-[153px] h-[153px] flex flex-col items-center justify-center text-[16px] transition-all rounded-[20px] bg-white';

  const textColor = selected ? 'text-[var(--color-gray700)]' : 'text-gray-400';
  const iconColor = selected
    ? 'text-[var(--color-primary-pink)]'
    : 'text-gray-300';

  const fadeClass =
    !selected && disabled ? 'opacity-50 cursor-not-allowed' : '';

  const selectedStyle = selected
    ? {
        // borderWidth: '3px',
        // borderStyle: 'solid',
        // borderImage: 'var(--color-gradation)',
        borderImageSlice: 1,
        backgroundImage: 'var(--color-gradation-20)',
        // borderRadius: '20px',
      }
    : {};

  const IconComponent = type === 'yes' ? YesIcon : NoIcon;

  const selectedBorder = selected ? 'bg-gradation' : 'bg-gray200';

  return (
    <div className={`p-[2px] rounded-[22px] ${selectedBorder}`}>
      <button
        onClick={onClick}
        disabled={disabled}
        className={`${baseClass} ${textColor} ${
          selected ? '' : ' bg-white'
        } ${fadeClass}`}
        style={selectedStyle}
      >
        <IconComponent className={`w-[50px] h-[50px] mb-1 ${iconColor}`} />
        <span>{label}</span>
      </button>
    </div>
  );
};

export default SelectButton;
