import React, { useState } from 'react';
import Header from '@/components/common/Header';
import { BottomSheet } from 'react-spring-bottom-sheet';
import PlanSelectionCard from '@/components/ComparePage/PlanSelectionCard';
import FilterSection from '@/components/ComparePage/FilterSection';
import PlanListItem from '@/components/ComparePage/PlanListItem';
import { usePlanFilter } from '@/hooks/usePlanFilter';
import 'react-spring-bottom-sheet/dist/style.css';

import ComparisonResult from '@/components/ComparePage/ComparisonResult';
import type { Plan } from '@/components/types/Plan';
import Modal from '@/components/common/Modal';
import Button from '@/components/common/Button';
import { useNavigate } from 'react-router-dom';

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
  const [isModalOpen, setIsModalOpen] = useState(false);

  const navigate = useNavigate();

  const dataList = ['전체', '5G', 'LTE'];
  const priceList = [
    '전체',
    '5만원 미만',
    '5만원 이상 10만원 미만',
    '10만원 이상',
  ];

  const plans: Plan[] = [
    {
      _id: '1',
      category: '5G',
      name: '5G 시그니처',
      description:
        'U⁺5G 서비스와 프리미엄 혜택을 마음껏 즐기고, 가족과 공유할 수 있는 데이터까지 추가로 받는 5G 요금제',
      isPopular: false,
      dataGb: -1,
      sharedDataGb: 120,
      voiceMinutes: -1,
      addonVoiceMinutes: 300,
      smsCount: -1,
      monthlyFee: 130000,
      optionalDiscountAmount: 92250,
      ageGroup: 'ALL',
      detailUrl:
        'https://www.lguplus.com/mobile/plan/mplan/5g-all/5g-unlimited/Z202205253',
      bundleBenefit:
        'U+ 투게더 결합, 5G 시그니처 가족할인, 태블릿/스마트기기 월정액 할인, 프리미어 요금제 약정할인, 로밍 혜택 프로모션',
      mediaAddons:
        '아이들나라 스탠다드+러닝, 바이브 앱+PC 음악감상, 유플레이, 밀리의 서재, 지니뮤직 앱+PC 음악감상',
      premiumAddons:
        '폰교체 패스, 삼성팩, 티빙 이용권 할인, 디즈니+, 넷플릭스, 헬로렌탈구독, 일리커피구독, 우리집지킴이 Easy2+, 우리집돌봄이 Kids, 신한카드 Air, 유튜브 프리미엄 할인',
      basicService: 'U+ 모바일tv 기본 월정액 무료, U+멤버십 VVIP 등급 혜택',
    },
    {
      _id: '2',
      category: '5G',
      name: '5G 프리미어 슈퍼',
      description:
        'U⁺5G 서비스와 프리미엄 혜택을 마음껏 즐기고, 가족과 공유할 수 있는 데이터까지 추가로 받는 5G 요금제',
      isPopular: false,
      dataGb: -1.0,
      sharedDataGb: 100,
      voiceMinutes: -1,
      addonVoiceMinutes: 300,
      smsCount: -1,
      monthlyFee: 115000,
      optionalDiscountAmount: 81000,
      ageGroup: 'ALL',
      detailUrl:
        'https://www.lguplus.com/mobile/plan/mplan/5g-all/5g-unlimited/Z202205251',
      bundleBenefit:
        'U+ 투게더 결합, 태블릿/스마트기기 월정액 할인, 프리미어 요금제 약정할인, 로밍 혜택 프로모션',
      mediaAddons:
        '아이들나라 스탠다드+러닝, 유플레이, 밀리의 서재, 지니뮤직 앱+PC 음악감상, 바이브 앱 음악감상',
      premiumAddons:
        '폰교체 패스, 삼성팩, 티빙 이용권 할인, 디즈니+, 넷플릭스, 헬로렌탈구독, 일리커피구독, 우리집지킴이 Easy2+, 우리집돌봄이 Kids, 신한카드 Air, 유튜브 프리미엄 할인',
      basicService: 'U+ 모바일tv 기본 월정액 무료, U+멤버십 VVIP 등급 혜택',
    },
    {
      _id: '3',
      category: '5G',
      name: '5G 프리미어 플러스',
      description:
        'U⁺5G 서비스는 물론, 스마트 기기 2개와 다양한 콘텐츠까지 마음껏 이용할 수 있는 5G 요금제',
      isPopular: false,
      dataGb: -1.0,
      sharedDataGb: 100,
      voiceMinutes: -1,
      addonVoiceMinutes: 300,
      smsCount: -1,
      monthlyFee: 105000,
      optionalDiscountAmount: 73500,
      ageGroup: 'ALL',
      detailUrl:
        'https://www.lguplus.com/mobile/plan/mplan/5g-all/5g-unlimited/Z202205252',
      bundleBenefit:
        'U+ 투게더 결합, 태블릿/스마트기기 월정액 할인, 프리미어 요금제 약정할인, 로밍 혜택 프로모션',
      mediaAddons:
        '아이들나라 스탠다드+러닝, 유플레이, 밀리의 서재, 지니뮤직 앱+PC 음악감상, 바이브 앱 음악감상',
      premiumAddons:
        '폰교체 패스, 삼성팩, 티빙 이용권 할인, 넷플릭스, 디즈니+, 헬로렌탈구독, 일리커피구독, 우리집지킴이 Easy2+, 우리집돌봄이 Kids, 신한카드 Air, 유튜브 프리미엄 할인',
      basicService: 'U+ 모바일tv 기본 월정액 무료, U+멤버십 VVIP 등급 혜택',
    },
    {
      _id: '4',
      category: '5G',
      name: '5G 프리미어 레귤러',
      description:
        'U⁺5G 서비스는 물론, 스마트기기 1개와 다양한 콘텐츠까지 마음껏 이용할 수 있는 5G 요금제',
      isPopular: true,
      dataGb: -1.0,
      sharedDataGb: 80,
      voiceMinutes: -1,
      addonVoiceMinutes: 300,
      smsCount: -1,
      monthlyFee: 95000,
      optionalDiscountAmount: 66000,
      ageGroup: 'ALL',
      detailUrl:
        'https://www.lguplus.com/mobile/plan/mplan/5g-all/5g-unlimited/LPZ0000433',
      bundleBenefit:
        'U+ 투게더 결합, 태블릿/스마트기기 월정액 할인, 프리미어 요금제 약정할인, 로밍 혜택 프로모션',
      mediaAddons:
        '아이들나라 스탠다드+러닝, 유플레이, 밀리의 서재, 바이브 300회 음악감상, 지니뮤직 300회 음악감상',
      premiumAddons: null,
      basicService: 'U+ 모바일tv 기본 월정액 무료, U+멤버십 VVIP 등급 혜택',
    },
    {
      _id: '5',
      category: '5G',
      name: '5G 프리미어 에센셜',
      description: 'U⁺5G 서비스를 마음껏 즐길 수 있는 5G 요금제',
      isPopular: true,
      dataGb: -1.0,
      sharedDataGb: 70,
      voiceMinutes: -1,
      addonVoiceMinutes: 300,
      smsCount: -1,
      monthlyFee: 85000,
      optionalDiscountAmount: 58500,
      ageGroup: 'ALL',
      detailUrl:
        'https://www.lguplus.com/mobile/plan/mplan/5g-all/5g-unlimited/LPZ0000409',
      bundleBenefit:
        'U+ 투게더 결합, 태블릿/스마트기기 월정액 할인, 프리미어 요금제 약정할인, 로밍 혜택 프로모션',
      mediaAddons: null,
      premiumAddons: null,
      basicService: 'U+ 모바일tv 기본 월정액 무료, U+멤버십 VIP 등급 혜택',
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
    if (selectedLeft?._id === plan._id || selectedRight?._id === plan._id) {
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

  const handleClearSlot = (slot: 'left' | 'right') => {
    if (slot === 'left') {
      setSelectedLeft(null);
    } else if (slot === 'right') {
      setSelectedRight(null);
    }
  };

  const toggleDropdown = (id: string) => {
    setOpenDropdowns((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const openModal = () => {
    setIsModalOpen(true);
  };
  const closeModal = () => {
    setIsModalOpen(false);
  };

  return (
    <>
      <Header title="요금제 비교하기" onBackClick={() => openModal()} />
      {isModalOpen && (
        <Modal
          isOpen={isModalOpen}
          onClose={closeModal}
          modalTitle="요금제 비교하기를 그만두시겠어요?"
          modalDesc="그만두실 경우, 선택하신 요금제가 모두 초기화됩니다."
        >
          <Button color="secondary" isModal onClick={closeModal}>
            계속할래요
          </Button>
          <Button isModal onClick={() => navigate('/')}>
            그만둘래요
          </Button>
        </Modal>
      )}
      <h1 className="font-semibold text-2xl text-center mt-[20px]">
        비교하고 싶은
        <br />
        요금제를 선택해 주세요
      </h1>

      <PlanSelectionCard
        selectedLeft={selectedLeft}
        selectedRight={selectedRight}
        onSelectSlot={openSheetForSlot}
        onClearSlot={handleClearSlot}
      />
      {selectedLeft || selectedRight ? (
        <ComparisonResult
          selectedLeft={selectedLeft}
          selectedRight={selectedRight}
        />
      ) : (
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
                key={plan._id}
                plan={plan}
                isOpen={openDropdowns[plan._id] || false}
                isDisabled={
                  selectedLeft?._id === plan._id ||
                  selectedRight?._id === plan._id
                }
                onToggle={() => toggleDropdown(plan._id)}
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
