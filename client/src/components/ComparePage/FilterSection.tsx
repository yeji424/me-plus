import Carousel from '@/components/ComparePage/Carousel';

interface FilterSectionProps {
  dataList: string[];
  priceList: string[];
  activeDataIndex: number;
  activePriceIndex: number;
  onDataIndexChange: (index: number) => void;
  onPriceIndexChange: (index: number) => void;
}

const FilterSection: React.FC<FilterSectionProps> = ({
  dataList,
  priceList,
  activeDataIndex,
  activePriceIndex,
  onDataIndexChange,
  onPriceIndexChange,
}) => {
  return (
    <div className="fixed top-[45px] w-full pt-2 bg-background-40 z-5">
      <div className="flex flex-col gap-1 px-5">
        <p className="text-[22px] font-semibold">요금제 선택</p>
        <p className="text-[13px] text-gray500">
          비교하고 싶은 요금제를 선택해주세요
        </p>
      </div>
      <div className="pt-2 pb-3 flex flex-col justify-center ">
        <Carousel
          categoryList={dataList}
          activeIndex={activeDataIndex}
          setActiveIndex={onDataIndexChange}
        />
        <Carousel
          categoryList={priceList}
          activeIndex={activePriceIndex}
          setActiveIndex={onPriceIndexChange}
        />
      </div>
    </div>
  );
};

export default FilterSection;
