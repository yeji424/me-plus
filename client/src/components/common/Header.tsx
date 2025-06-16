import type { ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';
import BackIcon from '@/assets/icon/back_icon.svg?react';

interface HeaderProps {
  title: string;
  iconButtons?: {
    icon: ReactNode;
    onClick: () => void;
  }[];
}

const Header = ({ title, iconButtons }: HeaderProps) => {
  const navigate = useNavigate();
  const backPage = () => {
    navigate(-1);
  };
  return (
    <div className="fixed top-0 left-1/2 transform -translate-x-1/2 w-full max-w-[600px] px-5 pt-5 pb-3 bg-transparent flex items-center justify-between z-50">
      <BackIcon onClick={backPage} className="icon-button" />
      {title && (
        <p className=" absolute left-1/2 -translate-x-1/2 text-base text-secondary-purple-80">
          {title}
        </p>
      )}
      {iconButtons && (
        <div className="flex items-center gap-4">
          {iconButtons.map((btn, index) => (
            <button key={index} onClick={btn.onClick} className="icon-button">
              {btn.icon}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default Header;
