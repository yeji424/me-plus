import PlanDetailInfo from './PlanDetailInfo';
import dropdownIcon from '@/assets/icon/dropdown_icon.svg';
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
      <div
        className="flex justify-between items-center h-[38px] cursor-pointer"
        onClick={onToggle}
      >
        <div>{plan.name}</div>
        <div className="pr-[2px]">
          <img
            src={dropdownIcon}
            alt="열기"
            className={`w-3 h-[6px] ${isOpen ? 'rotate-180' : ''}`}
          />
        </div>
      </div>
      {isOpen && (
        <>
          <PlanDetailInfo
            plan={plan}
            onClick={onSelect}
            disabled={isDisabled}
          />
        </>
      )}
    </div>
  );
};

export default PlanListItem;
