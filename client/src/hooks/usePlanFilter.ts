import { useMemo } from 'react';

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

export const usePlanFilter = (
  plans: Plan[],
  dataList: string[],
  priceList: string[],
  activeDataIndex: number,
  activePriceIndex: number,
) => {
  return useMemo(() => {
    return plans.filter((plan) => {
      const networkTypeFromTitle = plan.category;
      const matchNetwork =
        dataList[activeDataIndex] === '전체' ||
        networkTypeFromTitle === dataList[activeDataIndex];

      const matchPrice = () => {
        const price = plan.monthlyFee;
        switch (priceList[activePriceIndex]) {
          case '5만원 미만':
            return price < 50000;
          case '5만원 이상 10만원 미만':
            return price >= 50000 && price < 100000;
          case '10만원 이상':
            return price >= 100000;
          default:
            return true;
        }
      };

      return matchNetwork && matchPrice();
    });
  }, [plans, dataList, priceList, activeDataIndex, activePriceIndex]);
};
