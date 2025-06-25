import Button from '@/components/common/Button';
import type { Plan } from '@/components/types/Plan';

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
  const formattedData = plan.dataGb === -1 ? '무제한' : `${plan.dataGb}GB`;
  const formattedVoiceMinutes =
    plan.voiceMinutes === -1 ? '무제한' : `${plan.voiceMinutes}분`;
  const formattedSmsCount =
    plan.smsCount === -1 ? '무제한' : `${plan.smsCount}건`;
  return (
    <div className="bg-background rounded-b-[7px] p-3 text-[13px] flex flex-col gap-[10px]">
      <div className="flex gap-[5px]">
        <p className="min-w-[90px] text-secondary-purple-80">전화</p>
        <p className="w-full">{formattedVoiceMinutes}</p>
      </div>
      <div className="flex gap-[5px]">
        <p className="min-w-[90px] text-secondary-purple-80">문자</p>
        <p className="w-full">{formattedSmsCount}</p>
      </div>
      <div className="flex gap-[5px]">
        <p className="min-w-[90px] text-secondary-purple-80">데이터</p>
        <p className="w-full">{formattedData}</p>
      </div>
      <div className="flex gap-[5px]">
        <p className="min-w-[90px] text-secondary-purple-80">요금</p>
        <p className="w-full">월 {plan.monthlyFee.toLocaleString()}원</p>
      </div>
      <div className="flex gap-[5px]">
        <p className="min-w-[90px] text-secondary-purple-80">프리미엄 서비스</p>
        <p className="">{plan.premiumAddons ? plan.premiumAddons : '-'}</p>
      </div>
      <div className="flex gap-[5px]">
        <p className="min-w-[90px] text-secondary-purple-80">미디어 서비스</p>
        <p className="w-full">{plan.mediaAddons ? plan.mediaAddons : ' - '}</p>
      </div>

      <div className="mt-">
        <Button
          className="rounded-[12px] flex items-center justify-center"
          fullWidth
          variant="primary"
          onClick={onClick}
          disabled={disabled}
        >
          <span>선택하기</span>
        </Button>
      </div>
    </div>
  );
};

export default PlanDetailInfo;
