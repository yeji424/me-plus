import { Plan } from '../models/Plan.js';

/** 무제한 요금제 목록 JSON 반환 */
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
