import { Plan } from '../models/Plan.js';

/** GPT에게 넘길 데이터를 JSON으로 반환합니다. */

/** 무제한 요금제 목록 */
export const getUnlimitedDataPlans = async () => {
  try {
    const unlimitedDataPlans = await Plan.find({
      dataGb: -1,
      isPopular: true, // 인기 요금제만
    }).select('-updatedAt -createdAt');

    const data = unlimitedDataPlans.map(
      ({
        _id,
        name,
        description,
        dataGb,
        sharedDataGb,
        monthlyFee,
        detailUrl,
      }) => ({
        _id,
        name,
        description,
        dataGb,
        sharedDataGb,
        monthlyFee,
        detailUrl,
      }),
    );

    return data;
  } catch (error) {
    console.error(error);
    throw new Error(error);
  }
};
