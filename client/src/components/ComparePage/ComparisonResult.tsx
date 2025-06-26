import { useEffect, useState } from 'react';
import togetherIcon from '@/assets/image/card_family.png';
import premiumAddonsIcon from '@/assets/icon/special.png';
import mediaAddonsIcon from '@/assets/icon/media.png';
import BenefitText from '@/components/common/BenefitText';
import DataComparisonBar from '@/components/ComparePage/DataComparisonBar';
import BenefitComparisonRow from '@/components/ComparePage/BenefitComparisonRow';
import ComparisonActionButtons from '@/components/ComparePage/ComparisonActionButtons';
import Modal from '../common/Modal';
import Button from '../common/Button';

import type { Plan } from '@/components/types/Plan';

interface ComparisonResultProps {
  selectedLeft: Plan | null;
  selectedRight: Plan | null;
}

const ComparisonResult: React.FC<ComparisonResultProps> = ({
  selectedLeft,
  selectedRight,
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [pendingLink, setPendingLink] = useState<string | null>(null);

  const handleDetailClick = (detailUrl?: string) => {
    if (detailUrl) {
      setPendingLink(detailUrl); // 링크만 저장
      setIsModalOpen(true); // 모달 먼저 띄우기
    }
  };

  // 데이터 값 계산
  const leftDataValue = selectedLeft
    ? selectedLeft.dataGb === -1
      ? 250
      : selectedLeft.dataGb || 0
    : 0;
  const rightDataValue = selectedRight
    ? selectedRight.dataGb === -1
      ? 250
      : selectedRight.dataGb || 0
    : 0;
  const leftSharedDataValue = selectedLeft
    ? selectedLeft.sharedDataGb === -1
      ? 250
      : selectedLeft.sharedDataGb || 0
    : 0;
  const rightSharedDataValue = selectedRight
    ? selectedRight.sharedDataGb === -1
      ? 250
      : selectedRight.sharedDataGb || 0
    : 0;

  // 데이터 라벨 계산
  const leftDataLabel = selectedLeft
    ? selectedLeft.dataGb === -1
      ? '무제한'
      : `${selectedLeft.dataGb}GB`
    : '';
  const rightDataLabel = selectedRight
    ? selectedRight.dataGb === -1
      ? '무제한'
      : `${selectedRight.dataGb}GB`
    : '';
  const leftSharedDataLabel = selectedLeft
    ? selectedLeft.sharedDataGb === -1
      ? '무제한'
      : `${selectedLeft.sharedDataGb}GB`
    : '';
  const rightSharedDataLabel = selectedRight
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
          />
          <DataComparisonBar
            leftValue={leftSharedDataValue}
            rightValue={rightSharedDataValue}
            leftLabel={leftSharedDataLabel}
            rightLabel={rightSharedDataLabel}
            title="공유 데이터"
          />
        </div>

        <div className="w-full bg-gray200 h-[1px] my-5" />

        <div className="flex flex-col justify-center items-center text-center w-full gap-6">
          <BenefitComparisonRow
            leftContent={
              selectedLeft?.bundleBenefit ? (
                <BenefitText text={selectedLeft.bundleBenefit} />
              ) : null
            }
            rightContent={
              selectedRight?.bundleBenefit ? (
                <BenefitText text={selectedRight.bundleBenefit} />
              ) : null
            }
            title="결합 할인"
            leftIcon={selectedLeft?.bundleBenefit ? togetherIcon : undefined}
            rightIcon={selectedRight?.bundleBenefit ? togetherIcon : undefined}
            iconAlt="togetherIcon"
            hasLeftPlan={!!selectedLeft}
            hasRightPlan={!!selectedRight}
          />

          <BenefitComparisonRow
            leftContent={
              selectedLeft?.premiumAddons ? (
                <BenefitText text={`(택1) ${selectedLeft.premiumAddons}`} />
              ) : null
            }
            rightContent={
              selectedRight?.premiumAddons ? (
                <BenefitText text={`(택1) ${selectedRight.premiumAddons}`} />
              ) : null
            }
            title="프리미엄 서비스"
            leftIcon={
              selectedLeft?.premiumAddons ? premiumAddonsIcon : undefined
            }
            rightIcon={
              selectedRight?.premiumAddons ? premiumAddonsIcon : undefined
            }
            iconAlt="premiumIcon"
            hasLeftPlan={!!selectedLeft}
            hasRightPlan={!!selectedRight}
          />

          <BenefitComparisonRow
            leftContent={
              selectedLeft?.mediaAddons ? (
                <BenefitText text={`(택1) ${selectedLeft.mediaAddons}`} />
              ) : null
            }
            rightContent={
              selectedRight?.mediaAddons ? (
                <BenefitText text={`(택1) ${selectedRight.mediaAddons}`} />
              ) : null
            }
            title="미디어 서비스"
            leftIcon={selectedLeft?.mediaAddons ? mediaAddonsIcon : undefined}
            rightIcon={selectedRight?.mediaAddons ? mediaAddonsIcon : undefined}
            iconAlt="premiumIcon"
            hasLeftPlan={!!selectedLeft}
            hasRightPlan={!!selectedRight}
          />
        </div>
      </div>
      <ComparisonActionButtons
        leftButtonText={selectedLeft ? '자세히 보기' : ''}
        rightButtonText={selectedRight ? '자세히 보기' : ''}
        onLeftClick={() => handleDetailClick(selectedLeft?.detailUrl)}
        onRightClick={() => handleDetailClick(selectedRight?.detailUrl)}
      />

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        modalTitle="요금제 자세히 알아보기"
        modalDesc={
          <>
            요금제 상세 페이지는 외부 사이트로 연결됩니다.
            <br />
            계속 진행하시겠습니까?
          </>
        }
      >
        <Button
          fullWidth
          variant="secondary"
          size="medium"
          onClick={() => setIsModalOpen(false)}
        >
          닫기
        </Button>
        <Button
          fullWidth
          size="medium"
          onClick={() => {
            if (pendingLink) window.open(pendingLink, '_blank');
            setIsModalOpen(false);
          }}
        >
          이동하기
        </Button>
      </Modal>
    </>
  );
};

export default ComparisonResult;
