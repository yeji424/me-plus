import Button from '@/components/common/Button';
import PlanDetailInfo from './PlanDetailInfo';
import dropdownIcon from '@/assets/icon/dropdown_icon.svg';

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
          <PlanDetailInfo plan={plan} />
          <div className="h-[43px] mt-2">
            <Button onClick={onSelect} disabled={isDisabled}>
              선택하기
            </Button>
          </div>
        </>
      )}
    </div>
  );
};

export default PlanListItem;
