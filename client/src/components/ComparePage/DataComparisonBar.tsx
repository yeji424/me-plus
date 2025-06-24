interface DataComparisonBarProps {
  leftValue: number;
  rightValue: number;
  leftLabel: string;
  rightLabel: string;
  title: string;
}

const DataComparisonBar: React.FC<DataComparisonBarProps> = ({
  leftValue,
  rightValue,
  leftLabel,
  rightLabel,
  title,
}) => {
  const maxValue = Math.max(leftValue, rightValue);
  const leftRatio = (leftValue / maxValue) * 100;
  const rightRatio = (rightValue / maxValue) * 100;

  return (
    <div className="flex w-full">
      <div className="flex-[2] relative flex flex-col items-end gap-1">
        <div
          className="bg-gradation rounded-l-full h-5 transition-all duration-800"
          style={{ width: `${leftRatio}%` }}
        />
        <div className="text-xs text-gray500">{leftLabel}</div>
      </div>
      <div className="w-20 text-sm flex justify-center">{title}</div>
      <div className="flex-[2] relative flex flex-col items-start gap-1">
        <div
          className="bg-gradation rounded-r-full h-5 transition-all duration-800"
          style={{ width: `${rightRatio}%` }}
        />
        <div className="text-xs text-gray500">{rightLabel}</div>
      </div>
    </div>
  );
};

export default DataComparisonBar;
