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

interface PlanDetailInfoProps {
  plan: Plan;
}

const PlanDetailInfo: React.FC<PlanDetailInfoProps> = ({ plan }) => {
  const formatBenefits = (plan: Plan): string => {
    if (plan.benefits) return plan.benefits;

    // specialBenefits가 있는 경우 처리
    if (plan.specialBenefits) {
      const services = [
        ...(plan.specialBenefits.premiumServices || []),
        ...(plan.specialBenefits.mediaServices || []),
      ];
      return services.map((service) => service.name).join(', ');
    }

    return '기본 제공';
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
    </div>
  );
};

export default PlanDetailInfo;
