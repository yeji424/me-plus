import React, { useState } from 'react';
import Header from '@/components/common/Header';
import { BottomSheet } from 'react-spring-bottom-sheet';
import PlanSelectionCard from '@/components/ComparePage/PlanSelectionCard';
import FilterSection from '@/components/ComparePage/FilterSection';
import PlanListItem from '@/components/ComparePage/PlanListItem';
import { usePlanFilter } from '@/hooks/usePlanFilter';
import 'react-spring-bottom-sheet/dist/style.css';

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

const ComparePage: React.FC = () => {
  const [open, setOpen] = useState(false);
  const [activeDataIndex, setActiveDataIndex] = useState(0);
  const [activePriceIndex, setActivePriceIndex] = useState(0);
  const [openDropdowns, setOpenDropdowns] = useState<Record<string, boolean>>(
    {},
  );
  const [selectedLeft, setSelectedLeft] = useState<Plan | null>(null);
  const [selectedRight, setSelectedRight] = useState<Plan | null>(null);
  const [selectedSlot, setSelectedSlot] = useState<'left' | 'right' | null>(
    null,
  );

  const dataList = ['전체', '5G', 'LTE'];
  const priceList = [
    '전체',
    '5만원 미만',
    '5만원 이상 10만원 미만',
    '10만원 이상',
  ];

  const plans: Plan[] = [
    {
      id: 'plan1',
      category: '5G',
      name: '5G 프리미어 플러스',
      monthlyFee: 105000,
      bundleBenefit: {
        _id: 'bundle-01',
        name: 'U+ 투게더 결합',
      },
      basicBenefits: [
        {
          _id: 'LPZ0000409',
          name: 'U+모바일tv 기본 월정액',
          description:
            'U⁺오리지널 콘텐츠, 실시간 채널, 해외 드라마, 영화, 등 25만여 편의 동영상 중 내 취향에 맞는 영상을 추천 받아 마음껏 볼 수 있는 앱 서비스',
        },
      ],
      specialBenefits: {
        premiumServices: [
          {
            _id: 'premium-01',
            name: '삼성팩',
          },
          {
            _id: 'premium-02',
            name: '티빙',
          },
          {
            _id: 'premium-03',
            name: '디즈니+',
          },
          {
            _id: 'premium-04',
            name: '넷플릭스',
          },
        ],
        mediaServices: [
          {
            _id: 'media-01',
            name: '아이들 나라',
          },
          {
            _id: 'media-02',
            name: '바이브',
          },
          {
            _id: 'media-03',
            name: '유플레이',
          },
          {
            _id: 'media-04',
            name: '밀리의 서재',
          },
        ],
      },
    },
    {
      id: 'plan2',
      category: '5G',
      name: '5G 레귤러',
      monthlyFee: 95000,
      benefits: '티빙, 디즈니+ 중 택1',
    },
    {
      id: 'plan3',
      category: 'LTE',
      name: 'LTE 라이트',
      monthlyFee: 45000,
      benefits: '기본 제공',
    },
  ];

  const filteredPlans = usePlanFilter(
    plans,
    dataList,
    priceList,
    activeDataIndex,
    activePriceIndex,
  );

  const handleSetActiveDataIndex = (index: number) => {
    setActiveDataIndex(index);
    setOpenDropdowns({});
  };

  const handleSetActivePriceIndex = (index: number) => {
    setActivePriceIndex(index);
    setOpenDropdowns({});
  };

  const handleSelectPlan = (plan: Plan) => {
    if (selectedLeft?.id === plan.id || selectedRight?.id === plan.id) {
      return;
    }

    if (selectedSlot === 'left') {
      setSelectedLeft(plan);
    } else if (selectedSlot === 'right') {
      setSelectedRight(plan);
    }

    setOpen(false);
    setSelectedSlot(null);
  };

  const openSheetForSlot = (slot: 'left' | 'right') => {
    setSelectedSlot(slot);
    setOpenDropdowns({});
    setOpen(true);
  };

  const toggleDropdown = (id: string) => {
    setOpenDropdowns((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const hasSelectedPlans = selectedLeft && selectedRight;

  return (
    <>
      <Header title="요금제 비교하기" />
      <h1 className="font-semibold text-2xl text-center mt-[20px]">
        비교하고 싶은
        <br />
        요금제를 선택해 주세요
      </h1>

      <PlanSelectionCard
        selectedLeft={selectedLeft}
        selectedRight={selectedRight}
        onSelectSlot={openSheetForSlot}
      />

      {!hasSelectedPlans && (
        <div className="flex flex-col justify-center items-center text-center text-gray500 mt-[120px]">
          <p className="text-lg">비교할 요금제가 없습니다</p>
          <p className="text-xl">버튼을 눌러 요금제를 선택해주세요!</p>
        </div>
      )}

      <BottomSheet
        open={open}
        onDismiss={() => setOpen(false)}
        snapPoints={({ maxHeight }) => [maxHeight / 1.25]}
      >
        <div className="px-5">
          <FilterSection
            dataList={dataList}
            priceList={priceList}
            activeDataIndex={activeDataIndex}
            activePriceIndex={activePriceIndex}
            onDataIndexChange={handleSetActiveDataIndex}
            onPriceIndexChange={handleSetActivePriceIndex}
          />

          <div className="flex flex-col gap-[15px] select-none pt-[190px] mb-3">
            {filteredPlans.map((plan) => (
              <PlanListItem
                key={plan.id}
                plan={plan}
                isOpen={openDropdowns[plan.id] || false}
                isDisabled={
                  selectedLeft?.id === plan.id || selectedRight?.id === plan.id
                }
                onToggle={() => toggleDropdown(plan.id)}
                onSelect={() => handleSelectPlan(plan)}
              />
            ))}
          </div>
        </div>
      </BottomSheet>
    </>
  );
};

export default ComparePage;
