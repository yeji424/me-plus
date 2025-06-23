import versusIcon from '@/assets/icon/versus_icon.svg';
import closeIcon from '@/assets/icon/close.svg';
import type { Plan } from '@/components/types/Plan';
import AnimatedCardWrapper from '../common/AnimatedWrapper';
// import { motion } from 'framer-motion';
import React from 'react';
import FloatingIcon from '../common/FloadingIcon';
// import { useNavigate } from 'react-router-dom';

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
    <div className="relative flex-[2] flex w-full aspect-square rounded-[17px] cursor-pointer">
      <AnimatedCardWrapper
        className={`relative flex-1 flex justify-center bg-background-40 rounded-[17px] ${
          selected
            ? 'outline outline-primary-pink gap-[clamp(0px,2vw,8px)]'
            : 'shadow-md items-center'
        }`}
        onClick={onClick}
        shouldHighlight={!selected && shouldHighlight} // 여기에 넘기기
      >
        {selected ? (
          <div className="w-full h-full px-3 py-[34px]">
            <div
              className="absolute top-[10px] right-[10px] z-20"
              onClick={(e) => {
                e.stopPropagation();
                onClear();
              }}
            >
              <img src={closeIcon} alt="closeIcon" className="w-4 h-4" />
            </div>
            <div className="flex flex-col justify-between items-start z-10 h-full">
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

interface PlanSelectionCardProps {
  selectedLeft: Plan | null;
  selectedRight: Plan | null;
  onSelectSlot: (slot: 'left' | 'right') => void;
  onClearSlot: (slot: 'left' | 'right') => void;
}

const PlanSelectionCard: React.FC<PlanSelectionCardProps> = ({
  selectedLeft,
  selectedRight,
  onSelectSlot,
  onClearSlot,
}) => {
  const noneSelected = !selectedLeft && !selectedRight;
  return (
    <div className="flex justify-center my-[29px]">
      <div className="flex justify-between w-full">
        <SlotCard
          selected={selectedLeft}
          onClick={() => onSelectSlot('left')}
          onClear={() => onClearSlot('left')}
          shouldHighlight={noneSelected || !selectedLeft}
        />
        <div className="flex-[1] flex justify-center items-center">
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

export default PlanSelectionCard;
