import FadeInUpDiv from '@/components/common/FadeInUpDiv';
import PlanListItem from '@/components/ComparePage/PlanListItem';
import type { Plan } from '@/components/types/Plan';

interface PlanListProps {
  plans: Plan[];
  selectedLeft: Plan | null;
  selectedRight: Plan | null;
  openDropdowns: Record<string, boolean>;
  onToggle: (id: string) => void;
  onSelect: (plan: Plan) => void;
}

const PlanList: React.FC<PlanListProps> = ({
  plans,
  selectedLeft,
  selectedRight,
  openDropdowns,
  onToggle,
  onSelect,
}) => {
  return (
    <div className="flex flex-col gap-2 select-none mb-3 px-5 mt-[178px]">
      {plans.map((plan, i) => (
        <FadeInUpDiv key={plan._id} custom={i} delayUnit={0.07} duration={0.3}>
          <PlanListItem
            plan={plan}
            isOpen={openDropdowns[plan._id] || false}
            isDisabled={
              selectedLeft?._id === plan._id || selectedRight?._id === plan._id
            }
            onToggle={() => onToggle(plan._id)}
            onSelect={() => onSelect(plan)}
          />
        </FadeInUpDiv>
      ))}
    </div>
  );
};

export default PlanList;
