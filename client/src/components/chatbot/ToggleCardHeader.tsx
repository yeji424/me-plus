import ToggleIcon from '@/assets/icon/toggle_icon.svg?react';
import type { ColorTheme } from './ToggleCard';

interface ToggleHeaderProps {
  title: string;
  price: string;
  isOpen: boolean;
  isPopular: boolean;
  colorTheme: ColorTheme;
}

const ToggleCardHeader = ({
  title,
  price,
  isOpen,
  isPopular,
  colorTheme,
}: ToggleHeaderProps) => {
  // 배경색 결정 로직
  const getBackgroundColor = () => {
    if (!isOpen) return '';
    return `${colorTheme.bgColor} text-white`;
  };

  return (
    <div
      className={`flex justify-between items-center px-4 py-5 transition-colors duration-200 ${getBackgroundColor()}`}
    >
      <div>
        <div className="flex flex-row justify-center items-center">
          {isPopular && (
            <div
              className={`w-auto h-full flex justify-center items-center font-bold text-center px-1.5 py-0.5 rounded-full text-[9px] z-10 mr-1 ${
                isOpen
                  ? 'bg-white text-primary-pink'
                  : 'bg-primary-pink text-white'
              }`}
            >
              ★ 인기
            </div>
          )}
          <h3
            className={`text-s font-semibold ${
              isOpen ? 'text-white' : colorTheme.textColor
            }`}
          >
            {title}
          </h3>
        </div>
        <p
          className={`text-xs mt-[2px] ${isOpen ? 'text-background-40' : 'text-gray700'}`}
        >
          월정액 {price}
        </p>
      </div>
      <ToggleIcon
        className={`w-3 transition-transform duration-200 ${
          isOpen ? 'rotate-180 text-white' : 'text-gray500'
        }`}
      />
    </div>
  );
};

export default ToggleCardHeader;
