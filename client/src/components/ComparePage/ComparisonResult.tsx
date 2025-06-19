import DataComparisonBar from './DataComparisonBar';
import BenefitComparisonRow from './BenefitComparisonRow';
import ComparisonActionButtons from './ComparisonActionButtons';
import togetherIcon from '@/assets/image/card_family.png';
import premiumAddonsIcon from '@/assets/icon/special.png';
import mediaAddonsIcon from '@/assets/icon/media.png';
import type { Plan } from '@/components/types/Plan';

interface ComparisonResultProps {
  selectedLeft: Plan | null;
  selectedRight: Plan | null;
}

const ComparisonResult: React.FC<ComparisonResultProps> = ({
  selectedLeft,
  selectedRight,
}) => {
  const handleDetailClick = (detailUrl?: string) => {
    if (detailUrl) {
      window.open(detailUrl, '_blank');
    }
  };

  // 선택된 요금제가 있는지 확인
  const hasLeftPlan = selectedLeft !== null;
  const hasRightPlan = selectedRight !== null;
  const hasBothPlans = hasLeftPlan && hasRightPlan;

  // 데이터 값 계산
  const leftDataValue = hasLeftPlan
    ? selectedLeft.dataGb === -1
      ? 300
      : selectedLeft.dataGb || 0
    : 0;
  const rightDataValue = hasRightPlan
    ? selectedRight.dataGb === -1
      ? 300
      : selectedRight.dataGb || 0
    : 0;
  const leftSharedDataValue = hasLeftPlan
    ? selectedLeft.sharedDataGb === -1
      ? 300
      : selectedLeft.sharedDataGb || 0
    : 0;
  const rightSharedDataValue = hasRightPlan
    ? selectedRight.sharedDataGb === -1
      ? 300
      : selectedRight.sharedDataGb || 0
    : 0;

  // 데이터 라벨 계산
  const leftDataLabel = hasLeftPlan
    ? selectedLeft.dataGb === -1
      ? '무제한'
      : `${selectedLeft.dataGb}GB`
    : '';
  const rightDataLabel = hasRightPlan
    ? selectedRight.dataGb === -1
      ? '무제한'
      : `${selectedRight.dataGb}GB`
    : '';
  const leftSharedDataLabel = hasLeftPlan
    ? selectedLeft.sharedDataGb === -1
      ? '무제한'
      : `${selectedLeft.sharedDataGb}GB`
    : '';
  const rightSharedDataLabel = hasRightPlan
    ? selectedRight.sharedDataGb === -1
      ? '무제한'
      : `${selectedRight.sharedDataGb}GB`
    : '';

  return (
    <>
      <div className="w-full flex flex-col items-center">
        <div className="flex flex-col justify-center items-center text-center w-full gap-2">
          <DataComparisonBar
            leftValue={leftDataValue}
            rightValue={rightDataValue}
            leftLabel={leftDataLabel}
            rightLabel={rightDataLabel}
            title="데이터"
            // showComparison={hasBothPlans}
          />
          <DataComparisonBar
            leftValue={leftSharedDataValue}
            rightValue={rightSharedDataValue}
            leftLabel={leftSharedDataLabel}
            rightLabel={rightSharedDataLabel}
            title="공유 데이터"
            // showComparison={hasBothPlans}
          />
        </div>

        <div className="w-full bg-gray200 h-[1px] my-5" />

        <div className="flex flex-col justify-center items-center text-center w-full gap-6 mb-[106px]">
          <BenefitComparisonRow
            leftContent={selectedLeft?.bundleBenefit || null}
            rightContent={selectedRight?.bundleBenefit || null}
            title="결합 할인"
            leftIcon={selectedLeft?.bundleBenefit ? togetherIcon : undefined}
            rightIcon={selectedRight?.bundleBenefit ? togetherIcon : undefined}
            iconAlt="togetherIcon"
          />

          <BenefitComparisonRow
            leftContent={
              selectedLeft?.premiumAddons
                ? `(택1) ${selectedLeft?.premiumAddons}`
                : null
            }
            rightContent={
              selectedRight?.premiumAddons
                ? `(택1) ${selectedRight?.premiumAddons}`
                : null
            }
            title="프리미엄 서비스"
            leftIcon={
              selectedLeft?.premiumAddons ? premiumAddonsIcon : undefined
            }
            rightIcon={
              selectedRight?.premiumAddons ? premiumAddonsIcon : undefined
            }
            iconAlt="premiumIcon"
          />

          <BenefitComparisonRow
            leftContent={
              selectedLeft?.mediaAddons
                ? `(택1) ${selectedLeft?.mediaAddons}`
                : null
            }
            rightContent={
              selectedRight?.mediaAddons
                ? `(택1) ${selectedRight?.mediaAddons}`
                : null
            }
            title="미디어 서비스"
            leftIcon={selectedLeft?.mediaAddons ? mediaAddonsIcon : undefined}
            rightIcon={selectedRight?.mediaAddons ? mediaAddonsIcon : undefined}
            iconAlt="premiumIcon"
          />
        </div>
      </div>

      <ComparisonActionButtons
        leftButtonText={hasLeftPlan ? '자세히 보기' : ''}
        rightButtonText={hasRightPlan ? '자세히 보기' : ''}
        onLeftClick={() => handleDetailClick(selectedLeft?.detailUrl)}
        onRightClick={() => handleDetailClick(selectedRight?.detailUrl)}
      />
    </>
  );
};

export default ComparisonResult;
