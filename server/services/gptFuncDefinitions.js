import { Plan } from '../models/Plan.js';
import { PlanAddon } from '../models/PlanAddon.js';

/** GPT에게 넘길 데이터를 JSON으로 반환합니다. */

const refineData = (plans) => {
  return plans.map(
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
};

/** 무제한 요금제 목록 */
export const getUnlimitedDataPlans = async () => {
  try {
    const unlimitedDataPlans = await Plan.find({
      dataGb: -1,
      isPopular: true, // 인기 요금제만
    }).select('-updatedAt -createdAt');

    const data = refineData(unlimitedDataPlans);

    return data;
  } catch (error) {
    console.error('getUnlimitedDataPlans >>', error);
    throw error;
  }
};

export const getOTTBundlePlans = async () => {
  // OTT Addon ID 목록
  const ottAddonIds = [
    '68493589f727388c4bd08e91', // 티빙 팩 (카테고리 팩 혜택)
    '68493589f727388c4bd08e94', // 넷플릭스 팩 (카테고리 팩 혜택)
    '68493589f727388c4bd08e95', // 디즈니+ 팩 (카테고리 팩 혜택)
  ];

  try {
    const planAddonList = await PlanAddon.find({
      'addon._id': { $in: ottAddonIds },
    });
    const planIds = planAddonList.map((item) => item.plan);
    const plans = await Plan.find({
      _id: { $in: planIds },
    }).select('-updatedAt -createdAt');
    const data = refineData(plans);

    return data;
  } catch (error) {
    console.error('getOTTBundlePlans >>', error);
    throw error;
  }
};
