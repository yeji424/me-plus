import React from 'react';
import YesIcon from '@/assets/icon/yes.svg?react';
import NoIcon from '@/assets/icon/no.svg?react';

interface SelectButtonProps {
  label: string;
  selected: boolean;
  onClick: () => void;
  type: 'yes' | 'no';
}

const SelectButton: React.FC<SelectButtonProps> = ({
  label,
  selected,
  onClick,
  type,
}) => {
  const baseClass =
    'w-[153px] h-[153px] flex flex-col items-center justify-center text-lg transition-all rounded-[20px]';

  const textColor = selected ? 'text-[var(--color-gray700)]' : 'text-gray-400';
  const iconColor = selected
    ? 'text-[var(--color-primary-pink)]'
    : 'text-gray-300';

  const selectedStyle = selected
    ? {
        borderWidth: '3px',
        borderStyle: 'solid',
        borderImage: 'var(--color-gradation)',
        borderImageSlice: 1,
        backgroundImage: 'var(--color-gradation-20)',
        borderRadius: '20px',
      }
    : {};

  const IconComponent = type === 'yes' ? YesIcon : NoIcon;

  return (
    <button
      onClick={onClick}
      className={`${baseClass} ${textColor} ${
        selected ? '' : 'border border-gray300 bg-white'
      }`}
      style={selectedStyle}
    >
      <IconComponent className={`w-[50px] h-[50px] mb-1 ${iconColor}`} />
      <span>{label}</span>
    </button>
  );
};

export default SelectButton;
