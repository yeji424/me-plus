import versusIcon from '@/assets/icon/versus_icon.svg';
import type { Plan } from '@/components/types/Plan';

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
    <div className="flex justify-center my-[29px]">
      <div className="flex justify-between w-full">
        <div
          onClick={() => onSelectSlot('left')}
          className={`flex-[2] flex w-full aspect-square rounded-[17px] cursor-pointer bg-background-40 py-4 px-3 justify-center  ${selectedLeft ? 'outline outline-primary-pink flex-col gap-[clamp(0px,2vw,8px)]' : 'shadow-basic items-center '}`}
        >
          {selectedLeft ? (
            <>
              <p className="text-[15px] font-semibold text-gradation w-fit">
                {selectedLeft.name}
              </p>
              <p className="text-xs font-semibold text-gray500 w-fit">
                {selectedLeft.dataGb === -1
                  ? '무제한'
                  : selectedLeft.dataGb + 'GB'}
              </p>
              <p className="font-semibold text-primary-pink w-fit">
                {selectedLeft.monthlyFee.toLocaleString()}원
              </p>
            </>
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
          className={`flex-[2] flex w-full aspect-square rounded-[17px] cursor-pointer bg-background-40 py-4 px-3 justify-center  ${selectedRight ? 'outline outline-primary-pink flex-col gap-[8px]' : 'shadow-basic items-center '}`}
        >
          {selectedRight ? (
            <>
              <p className="text-[15px] font-semibold text-gradation w-fit">
                {selectedRight.name}
              </p>
              <p className="text-xs font-semibold text-gray500 w-fit">
                {selectedRight.dataGb === -1
                  ? '무제한'
                  : selectedRight.dataGb + 'GB'}
              </p>
              <p className="font-semibold text-primary-pink w-fit">
                {selectedRight.monthlyFee.toLocaleString()}원
              </p>
            </>
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
