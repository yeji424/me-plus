import versusIcon from '@/assets/icon/versus_icon.svg';
import closeIcon from '@/assets/icon/close.svg';
import AnimatedCardWrapper from '@/components/common/AnimatedWrapper';
import FloatingIcon from '@/components/common/FloatingIcon';
import type { Plan } from '@/components/types/Plan';

const SlotCard = ({
  selected,
  onClick,
  onClear,
  shouldHighlight = false,
}: {
  selected: Plan | null;
  onClick: () => void;
  onClear: () => void;
  shouldHighlight?: boolean;
}) => {
  return (
    <div className="relative flex-[2] w-full flex rounded-[17px] cursor-pointer justify-center">
      <AnimatedCardWrapper
        className={`relative flex-1 flex justify-center bg-background-40 rounded-[17px] aspect-square max-w-[160px] ${
          selected
            ? 'outline outline-primary-pink gap-[clamp(0px,2vw,8px)]'
            : 'shadow-md items-center'
        }`}
        onClick={onClick}
        shouldHighlight={!selected && shouldHighlight} // 여기에 넘기기
      >
        {selected ? (
          <div className="w-full h-full flex justify-center items-center">
            <div
              className="absolute top-0 right-0 z-20 p-[10px]"
              onClick={(e) => {
                e.stopPropagation();
                onClear();
              }}
            >
              <img src={closeIcon} alt="closeIcon" className="w-4 h-4" />
            </div>
            <div className="flex flex-col justify-center gap-[5%] items-start z-10 h-[92%] w-[92%]">
              <h3 className="text-[15px] font-semibold text-gradation w-fit leading-tight">
                {selected.name}
              </h3>
              <p className="text-xs font-semibold text-gray500 w-fit">
                {selected.dataGb === -1
                  ? '데이터 무제한'
                  : `데이터 ${selected.dataGb}GB`}
              </p>
              <p className="font-semibold text-primary-pink w-fit">
                {selected.monthlyFee.toLocaleString()}원
              </p>
            </div>
          </div>
        ) : (
          <div className="flex justify-center items-center w-full h-full">
            <p className="text-gradation text-2xl font-semibold text-center select-none">
              {' '}
              요금제
              <br />
              선택
            </p>
          </div>
        )}
      </AnimatedCardWrapper>
    </div>
  );
};

interface PlanSelectionCardAreaProps {
  selectedLeft: Plan | null;
  selectedRight: Plan | null;
  onSelectSlot: (slot: 'left' | 'right') => void;
  onClearSlot: (slot: 'left' | 'right') => void;
}

const PlanSelectionCardArea: React.FC<PlanSelectionCardAreaProps> = ({
  selectedLeft,
  selectedRight,
  onSelectSlot,
  onClearSlot,
}) => {
  const noneSelected = !selectedLeft && !selectedRight;
  return (
    <div className="my-[29px]">
      <div className="flex w-full">
        <SlotCard
          selected={selectedLeft}
          onClick={() => onSelectSlot('left')}
          onClear={() => onClearSlot('left')}
          shouldHighlight={noneSelected || !selectedLeft}
        />
        <div className="flex justify-center items-center w-20">
          <FloatingIcon src={versusIcon} alt="versus icon" />
        </div>
        <SlotCard
          selected={selectedRight}
          onClick={() => onSelectSlot('right')}
          onClear={() => onClearSlot('right')}
          shouldHighlight={noneSelected || !selectedRight}
        />
      </div>
    </div>
  );
};

export default PlanSelectionCardArea;
