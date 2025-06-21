import React from 'react';

interface SelectButton3Props {
  label: string;
  selected: boolean;
  onClick: () => void;
  disabled?: boolean;
}

const SelectButton3: React.FC<SelectButton3Props> = ({
  label,
  selected,
  onClick,
  disabled,
}) => {
  const baseClass =
    'w-full px-[27px] py-[25px] text-[16px] rounded-xl font-medium transition-all text-left flex justify-start';

  const selectedClass = selected
    ? 'text-[var(--color-gray700)]'
    : 'text-gray500 bg-white border border-gray200';

  const fadeClass =
    !selected && disabled ? 'opacity-50 cursor-not-allowed' : '';

  const style = selected
    ? {
        borderWidth: '3px',
        borderStyle: 'solid',
        borderImage: 'var(--color-gradation)',
        borderImageSlice: 1,
        backgroundImage: 'var(--color-gradation-20)',
        borderRadius: '20px',
      }
    : {};

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`${baseClass} ${selectedClass} ${fadeClass}`}
      style={style}
    >
      {label}
    </button>
  );
};

export default SelectButton3;
