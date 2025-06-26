import { useMemo } from 'react';
import type { Plan } from '@/components/types/Plan';

export const usePlanFilter = (
  plans: Plan[],
  dataList: string[],
  priceList: string[],
  dataAmountList: string[],
  activeDataIndex: number,
  activePriceIndex: number,
  activeDataAmountIndex: number,
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

      const matchDataAmount = () => {
        const amount = plan.dataGb;
        switch (dataAmountList[activeDataAmountIndex]) {
          case '5GB 미만':
            return amount >= 0 && amount < 5;
          case '5GB ~ 20GB':
            return amount >= 5 && amount <= 20;
          case '20GB ~ 50GB':
            return amount > 20 && amount <= 50;
          case '50GB ~ 100GB':
            return amount > 50 && amount <= 100;
          case '무제한':
            return (amount === -1) === true;
          default:
            return true;
        }
      };

      return matchNetwork && matchPrice() && matchDataAmount();
    });
  }, [
    plans,
    dataList,
    priceList,
    activeDataIndex,
    activePriceIndex,
    dataAmountList,
  ]);
};
