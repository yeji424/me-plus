interface BenefitComparisonRowProps {
  leftContent: string | null;
  rightContent: string | null;
  title: string;
  leftIcon?: string;
  rightIcon?: string;
  iconAlt?: string;
}

const BenefitComparisonRow: React.FC<BenefitComparisonRowProps> = ({
  leftContent,
  rightContent,
  title,
  leftIcon,
  rightIcon,
  iconAlt = 'benefit icon',
}) => {
  return (
    <div className="flex w-full">
      <div className="flex-[2] relative flex flex-col items-center gap-1 justify-center">
        {leftIcon && leftContent && <img src={leftIcon} alt={iconAlt} />}
        <div className="text-xs text-gray500">{leftContent || '-'}</div>
      </div>
      <div className="flex-[1] text-sm flex items-center justify-center">
        {title}
      </div>
      <div className="flex-[2] relative flex flex-col items-center gap-1 justify-center">
        {rightIcon && rightContent && <img src={rightIcon} alt={iconAlt} />}
        <div className="text-xs text-gray500">{rightContent || '-'}</div>
      </div>
    </div>
  );
};

export default BenefitComparisonRow;
