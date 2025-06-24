import type { ReactNode } from 'react';
import sorryRobotIcon from '@/assets/icon/sorry_robot_icon.png';

interface BenefitComparisonRowProps {
  leftContent: ReactNode | null;
  rightContent: ReactNode | null;
  title: string;
  leftIcon?: string;
  rightIcon?: string;
  iconAlt?: string;
  hasLeftPlan?: boolean;
  hasRightPlan?: boolean;
}
const ImageWrapper = ({ children }: { children: ReactNode }) => (
  <div className="w-[80px] h-[68px] flex items-center justify-center">
    {children}
  </div>
);

const TextWrapper = ({ children }: { children: ReactNode }) => (
  <div className="min-h-[32px] text-xs text-center">{children}</div>
);
const SorryMessage = ({ title }: { title: string }) => (
  <>
    <ImageWrapper>
      <img
        src={sorryRobotIcon}
        alt="sorry robot"
        // className="w-[80px] h-[68px]"
      />
    </ImageWrapper>
    <TextWrapper>
      <div className="text-gray400">
        {title.includes('혜택')
          ? '제공되는 혜택이 없습니다'
          : '제공되는 서비스가 없습니다'}
      </div>
    </TextWrapper>
  </>
);
const BenefitComparisonRow: React.FC<BenefitComparisonRowProps> = ({
  leftContent,
  rightContent,
  title,
  leftIcon,
  rightIcon,
  iconAlt = 'benefit icon',
  hasLeftPlan,
  hasRightPlan,
}) => {
  return (
    <div className="flex w-full">
      <div className="flex-[2] relative flex flex-col items-center gap-1 ">
        {leftIcon && leftContent && (
          <ImageWrapper>
            <img src={leftIcon} alt={iconAlt} />
          </ImageWrapper>
        )}
        {leftContent ? (
          <TextWrapper>
            <div className="text-gray500">{leftContent}</div>
          </TextWrapper>
        ) : hasLeftPlan ? (
          <SorryMessage title={title} />
        ) : (
          <TextWrapper>
            <div className="text-xs text-gray500"></div>
          </TextWrapper>
        )}
      </div>
      <div className="pt-[13%] w-25 text-sm flex justify-center">{title}</div>
      <div className="flex-[2] relative flex flex-col items-center gap-1 justify-center">
        {rightIcon && rightContent && (
          <ImageWrapper>
            <img src={rightIcon} alt={iconAlt} />
          </ImageWrapper>
        )}
        {rightContent ? (
          <TextWrapper>
            <div className="text-xs text-gray500">{rightContent}</div>
          </TextWrapper>
        ) : hasRightPlan ? (
          <SorryMessage title={title} />
        ) : (
          <TextWrapper>
            <div className="text-xs text-gray500"></div>
          </TextWrapper>
        )}
      </div>
    </div>
  );
};

export default BenefitComparisonRow;
