import { useMemo } from 'react';
import type { Plan } from '@/components/types/Plan';

export const usePlanFilter = (
  plans: Plan[],
  dataList: string[],
  priceList: string[],
  activeDataIndex: number,
  activePriceIndex: number,
) => {
  return useMemo(() => {
    if (!plans) return [];
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
