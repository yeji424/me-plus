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
    'w-full px-[27px] py-[25px] text-[16px] rounded-xl font-medium transition-all text-left flex justify-start bg-white';

  const selectedClass = selected
    ? 'text-[var(--color-gray700)] opacity-90 border-none'
    : 'text-gray500 bg-white border-[2px] border-none';

  const fadeClass =
    !selected && disabled ? 'opacity-50 cursor-not-allowed' : '';

  const style = selected
    ? {
        // borderWidth: '2px',
        // borderStyle: 'solid',
        // borderImage: 'var(--color-gradation)',
        borderImageSlice: 1,
        backgroundImage: 'var(--color-gradation-20)',
        // borderRadius: '20px',
      }
    : {};

  const selectedBorder = selected ? 'bg-gradation' : 'bg-gray200';

  return (
    <div className={`p-[2px] rounded-[14px] ${selectedBorder}`}>
      <button
        onClick={onClick}
        disabled={disabled}
        className={`${baseClass} ${selectedClass} ${fadeClass}`}
        style={style}
      >
        {label}
      </button>
    </div>
  );
};

export default SelectButton3;
