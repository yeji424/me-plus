import Button from '@/components/common/Button';

interface ComparisonActionButtonsProps {
  leftButtonText?: string;
  rightButtonText?: string;
  onLeftClick: () => void;
  onRightClick: () => void;
  className?: string;
}

const ComparisonActionButtons: React.FC<ComparisonActionButtonsProps> = ({
  leftButtonText,
  rightButtonText,
  onLeftClick,
  onRightClick,
  className = '',
}) => {
  return (
    <div
      className={`flex flex-col justify-center items-center text-center gap-6 ${className}`}
      style={{ width: 'calc(100% - 40px)' }}
    >
      <div className="flex w-full">
        <div className="flex-[2] relative flex flex-col items-center justify-center rounded-[10px]">
          {leftButtonText && (
            <Button
              onClick={onLeftClick}
              className="text-xs text-background-40 font-semibold bg-primary-pink w-full h-[38px] flex items-center justify-center rounded-[10px] cursor-pointer shadow-basic"
              variant="custom"
            >
              {leftButtonText}
            </Button>
          )}
        </div>
        <div className="flex-[1] text-sm flex items-center justify-center" />
        <div className="flex-[2] relative flex flex-col items-center gap-1 justify-center rounded-[10px]">
          {rightButtonText && (
            <Button
              onClick={onRightClick}
              className="text-xs text-background-40 font-semibold bg-primary-pink w-full h-[38px] flex items-center justify-center rounded-[10px] cursor-pointer shadow-basic"
              variant="custom"
            >
              {rightButtonText}
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

export default ComparisonActionButtons;
