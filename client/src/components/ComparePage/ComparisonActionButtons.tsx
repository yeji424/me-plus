interface ComparisonActionButtonsProps {
  leftButtonText: string;
  rightButtonText: string;
  onLeftClick: () => void;
  onRightClick: () => void;
}

const ComparisonActionButtons: React.FC<ComparisonActionButtonsProps> = ({
  leftButtonText,
  rightButtonText,
  onLeftClick,
  onRightClick,
}) => {
  return (
    <div
      className="flex flex-col justify-center items-center text-center gap-6 fixed bottom-[29px] max-w-[560px] overflow-visible h-[106px]"
      style={{ width: 'calc(100% - 40px)' }}
    >
      <div className="flex w-full overflow-visible">
        <div className="flex-[2] relative flex flex-col items-center gap-1 justify-center rounded-[10px] shadow-basic">
          <button
            onClick={onLeftClick}
            className="text-xs text-background-40 font-semibold bg-primary-pink w-full h-[38px] flex items-center justify-center rounded-[10px] cursor-pointer shadow-basic"
          >
            {leftButtonText}
          </button>
        </div>
        <div className="flex-[1] text-sm flex items-center justify-center" />
        <div className="flex-[2] relative flex flex-col items-center gap-1 justify-center rounded-[10px] shadow-basic">
          <button
            onClick={onRightClick}
            className="text-xs text-background-40 font-semibold bg-primary-pink w-full h-[38px] flex items-center justify-center rounded-[10px] cursor-pointer shadow-basic"
          >
            {rightButtonText}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ComparisonActionButtons;
