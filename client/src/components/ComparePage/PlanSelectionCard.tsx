import versusIcon from '@/assets/icon/versus_icon.svg';

interface Plan {
  id: string;
  category: string;
  name: string;
  monthlyFee: number;
  bundleBenefit?: {
    _id: string;
    name: string;
  };
  basicBenefits?: Array<{
    _id: string;
    name: string;
    description: string;
  }>;
  specialBenefits?: {
    premiumServices: Array<{ _id: string; name: string }>;
    mediaServices: Array<{ _id: string; name: string }>;
  };
  benefits?: string;
}

interface PlanSelectionCardProps {
  selectedLeft: Plan | null;
  selectedRight: Plan | null;
  onSelectSlot: (slot: 'left' | 'right') => void;
}

const PlanSelectionCard: React.FC<PlanSelectionCardProps> = ({
  selectedLeft,
  selectedRight,
  onSelectSlot,
}) => {
  return (
    <div className="flex justify-center mt-[29px]">
      <div className="flex justify-between w-full max-w-[400px]">
        <div
          onClick={() => onSelectSlot('left')}
          className="flex-[2] flex justify-center items-center w-full aspect-square shadow-basic rounded-[17px] cursor-pointer"
        >
          {selectedLeft ? (
            <p>{selectedLeft.name}</p>
          ) : (
            <p className="text-gradation text-2xl font-semibold text-center">
              요금제
              <br />
              선택
            </p>
          )}
        </div>
        <div className="flex-[1] flex justify-center items-center">
          <img src={versusIcon} alt="versusIcon" />
        </div>
        <div
          onClick={() => onSelectSlot('right')}
          className="flex-[2] flex justify-center items-center w-full aspect-square shadow-basic rounded-[17px] cursor-pointer"
        >
          {selectedRight ? (
            <p>{selectedRight.name}</p>
          ) : (
            <p className="text-gradation text-2xl font-semibold text-center">
              요금제
              <br />
              선택
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default PlanSelectionCard;
