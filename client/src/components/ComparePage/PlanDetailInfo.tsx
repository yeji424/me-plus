import type { Plan } from '@/components/types/Plan';
import Button from '../common/Button';

interface PlanDetailInfoProps {
  plan: Plan;
  onClick?: () => void;
  disabled?: boolean;
}

const PlanDetailInfo: React.FC<PlanDetailInfoProps> = ({
  plan,
  onClick,
  disabled,
}) => {
  const formatBenefits = (plan: Plan): string[] => {
    if (plan.mediaAddons && plan.premiumAddons) {
      const services = [
        ...(plan.mediaAddons || []),
        ...', ',
        ...(plan.premiumAddons || []),
      ];
      return services;
    } else if (plan.mediaAddons) {
      const services = [...(plan.mediaAddons || [])];
      return services;
    } else if (plan.premiumAddons) {
      const services = [...(plan.premiumAddons || [])];
      return services;
    }

    return ['-'];
  };

  return (
    <div className="bg-background rounded-b-[7px] p-3 text-[13px] flex flex-col gap-2">
      <div className="flex gap-[5px]">
        <p className="min-w-[64px] text-secondary-purple-80">전화</p>
        <p>무제한</p>
      </div>
      <div className="flex gap-[5px]">
        <p className="min-w-[64px] text-secondary-purple-80">문자</p>
        <p>무제한</p>
      </div>
      <div className="flex gap-[5px]">
        <p className="min-w-[64px] text-secondary-purple-80">데이터</p>
        <p>무제한</p>
      </div>
      <div className="flex gap-[5px]">
        <p className="min-w-[64px] text-secondary-purple-80">요금</p>
        <p>월 {plan.monthlyFee.toLocaleString()}원</p>
      </div>
      <div className="flex gap-[5px]">
        <p className="min-w-[64px] text-secondary-purple-80">부가서비스</p>
        <p>{formatBenefits(plan)}</p>
      </div>

      <div className="h-[43px] mt-2">
        <Button onClick={onClick} disabled={disabled}>
          선택하기
        </Button>
      </div>
    </div>
  );
};

export default PlanDetailInfo;
