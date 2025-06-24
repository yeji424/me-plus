import { useEffect, useState } from 'react';

import Header from '@/components/common/Header';
import PlanSelectionCard from '@/components/ComparePage/PlanSelectionCard';
import FilterSection from '@/components/ComparePage/FilterSection';
import PlanListItem from '@/components/ComparePage/PlanListItem';
import { usePlanFilter } from '@/hooks/usePlanFilter';
import ComparisonResult from '@/components/ComparePage/ComparisonResult';
import type { Plan } from '@/components/types/Plan';
import Modal from '@/components/common/Modal';
import Button from '@/components/common/Button';

import { useNavigate } from 'react-router-dom';
import { getAllPlans } from '@/api/plan';

import 'react-spring-bottom-sheet/dist/style.css';
import { BottomSheet } from 'react-spring-bottom-sheet';
import FadeInUpDiv from '@/components/common/FadeInUpDiv';
import LoadingSpinner from '@/components/common/LoadingSpinner';

import { localFallbackPlans } from '@/constants/localFallbackPlans';

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
  const [plans, setPlans] = useState<Plan[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const navigate = useNavigate();

  const dataList = ['전체', '5G', 'LTE'];
  const priceList = [
    '전체',
    '5만원 미만',
    '5만원 이상 10만원 미만',
    '10만원 이상',
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

  useEffect(() => {
    const fetchPlans = async () => {
      setIsLoading(true);
      try {
        const res = await getAllPlans();
        setPlans(res.plans);
      } catch (error) {
        console.error('요금제 가져오기 실패:', error);
        setPlans(localFallbackPlans);
      }
      setIsLoading(false);
    };

    fetchPlans();
  }, []);

  return (
    <div className="px-5">
      <Header title="요금제 비교하기" onBackClick={() => openModal()} />
      {isModalOpen && (
        <Modal
          isOpen={isModalOpen}
          onClose={closeModal}
          modalTitle="요금제 비교하기를 그만두시겠어요?"
          modalDesc="그만두실 경우, 선택하신 요금제가 모두 초기화됩니다."
        >
          <Button
            fullWidth
            variant="secondary"
            onClick={closeModal}
            size="medium"
          >
            계속할래요
          </Button>
          <Button fullWidth onClick={() => navigate('/')} size="medium">
            그만둘래요
          </Button>
        </Modal>
      )}
      <FadeInUpDiv custom={0}>
        <h1 className="font-semibold text-2xl text-center mt-[20px]">
          비교하고 싶은
          <br />
          요금제를 선택해 주세요
        </h1>
      </FadeInUpDiv>

      <FadeInUpDiv custom={1}>
        <PlanSelectionCard
          selectedLeft={selectedLeft}
          selectedRight={selectedRight}
          onSelectSlot={openSheetForSlot}
          onClearSlot={handleClearSlot}
        />
      </FadeInUpDiv>

      <FadeInUpDiv custom={2}>
        {selectedLeft || selectedRight ? (
          <ComparisonResult
            selectedLeft={selectedLeft}
            selectedRight={selectedRight}
          />
        ) : (
          <div className="flex flex-col gap-2 justify-center items-center text-center text-gray500 mt-[120px]">
            <p className="text-lg">비교할 요금제가 없습니다</p>
            <p className="text-xl text-primary-pink-60">
              버튼을 눌러 요금제를 선택해주세요!
            </p>
          </div>
        )}
      </FadeInUpDiv>
      <BottomSheet
        className="fixed left-1/2 top-0 bottom-0 -translate-x-1/2 w-full max-w-[600px] flex justify-center items-center z-50"
        open={open}
        onDismiss={() => setOpen(false)}
        snapPoints={({ maxHeight }) => [maxHeight / 1.25]}
      >
        <div>
          <FilterSection
            dataList={dataList}
            priceList={priceList}
            activeDataIndex={activeDataIndex}
            activePriceIndex={activePriceIndex}
            onDataIndexChange={handleSetActiveDataIndex}
            onPriceIndexChange={handleSetActivePriceIndex}
          />
          {isLoading && <LoadingSpinner />}
          <div className="flex flex-col gap-2 select-none mb-3 px-5 mt-[178px]">
            {filteredPlans.map((plan, i) => (
              <FadeInUpDiv
                key={plan._id}
                custom={i}
                delayUnit={0.07}
                duration={0.3}
              >
                <PlanListItem
                  plan={plan}
                  isOpen={openDropdowns[plan._id] || false}
                  isDisabled={
                    selectedLeft?._id === plan._id ||
                    selectedRight?._id === plan._id
                  }
                  onToggle={() => toggleDropdown(plan._id)}
                  onSelect={() => handleSelectPlan(plan)}
                />
              </FadeInUpDiv>
            ))}
          </div>
        </div>
      </BottomSheet>
    </div>
  );
};

export default ComparePage;
