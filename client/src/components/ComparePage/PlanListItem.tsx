import { AnimatePresence, motion } from 'framer-motion';
import dropdownIcon from '@/assets/icon/dropdown_icon.svg';
import PlanDetailInfo from '@/components/ComparePage/PlanDetailInfo';
import type { Plan } from '@/components/types/Plan';

interface PlanListItemProps {
  plan: Plan;
  isOpen: boolean;
  isDisabled: boolean;
  onToggle: () => void;
  onSelect: () => void;
}

const PlanListItem: React.FC<PlanListItemProps> = ({
  plan,
  isOpen,
  isDisabled,
  onToggle,
  onSelect,
}) => {
  return (
    <div>
      <motion.div
        whileHover={
          !isOpen
            ? {
                scale: 1.01,
                boxShadow: '0px 1px 4px rgba(0, 0, 0, 0.08)',
              }
            : undefined // 열린 상태면 hover 효과 없음
        }
        whileTap={{
          scale: 0.99,
          boxShadow: '0px 0px 0px rgba(0,0,0,0)',
        }}
        transition={{ type: 'spring', stiffness: 300, damping: 20 }}
        className="flex justify-between items-center cursor-pointer rounded-md px-2 py-[10px]"
        onClick={onToggle}
      >
        <div>{plan.name}</div>
        <div className="pr-[2px]">
          <img
            src={dropdownIcon}
            alt="열기"
            className={`w-3 h-[6px] transition-transform duration-200 ${
              isOpen ? 'rotate-180' : ''
            }`}
          />
        </div>
      </motion.div>

      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            key="content"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25, ease: 'easeInOut' }}
            className="overflow-hidden"
          >
            <PlanDetailInfo
              plan={plan}
              onClick={onSelect}
              disabled={isDisabled}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default PlanListItem;
