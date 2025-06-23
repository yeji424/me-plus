import type { ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';
import BackIcon from '@/assets/icon/header_back_icon.svg?react';
import TintedWrapper from './TintedWrapper';

interface HeaderProps {
  title: string;
  onBackClick?: () => void;
  iconButtons?: {
    icon: ReactNode;
    onClick: () => void;
  }[];
  isTransparent?: boolean;
  className?: string;
}

const Header = ({
  title,
  onBackClick,
  iconButtons,
  isTransparent = false,
  className = '',
}: HeaderProps) => {
  const navigate = useNavigate();
  const backPage = () => {
    if (onBackClick) {
      onBackClick();
    } else {
      navigate('/');
    }
  };
  return (
    <>
      <header
        className={`fixed top-0 left-1/2 transform -translate-x-1/2 w-full max-w-[600px] px-3 pt-3 pb-3 flex items-center justify-between z-50 ${
          isTransparent ? 'bg-transparent' : 'bg-white'
        } ${className}`}
      >
        <TintedWrapper>
          <BackIcon onClick={backPage} className="icon-button" />
        </TintedWrapper>
        {title && (
          <p className=" absolute left-1/2 -translate-x-1/2 text-base text-gray700">
            {title}
          </p>
        )}
        {iconButtons && (
          <div className="flex items-center gap-3">
            {iconButtons.map((btn, index) => (
              <TintedWrapper key={index}>
                <button onClick={btn.onClick} className="icon-button">
                  {btn.icon}
                </button>
              </TintedWrapper>
            ))}
          </div>
        )}
      </header>
    </>
  );
};

export default Header;
