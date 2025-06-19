import ToggleIcon from '@/assets/icon/toggle_icon.svg?react';

interface ToggleHeaderProps {
  title: string;
  price: string;
  isOpen: boolean;
}

const ToggleCardHeader = ({ title, price, isOpen }: ToggleHeaderProps) => {
  return (
    <div
      className={`flex justify-between items-center px-4 py-5 transition-colors duration-200 ${
        isOpen ? 'bg-secondary-purple-60 text-white' : ''
      }`}
    >
      <div>
        <h3
          className={`text-s font-semibold ${
            isOpen ? 'text-white' : 'text-secondary-purple-60'
          }`}
        >
          {title}
        </h3>
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
