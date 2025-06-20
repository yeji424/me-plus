import { Plan } from '../models/Plan.js';
import { PlanAddon } from '../models/PlanAddon.js';

/** GPT에게 넘길 데이터를 JSON으로 반환합니다. */

const EXCLUDED_FIELDS = '-updatedAt -createdAt';

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
      bundleBenefit,
    }) => ({
      _id,
      name,
      description,
      dataGb,
      sharedDataGb,
      monthlyFee,
      detailUrl,
      bundleBenefit,
    }),
  );
};

/** 전체 요금제 목록 */
export const getPlans = async () => {
  try {
    const plans = await Plan.find({}).select(EXCLUDED_FIELDS).limit(10);
    const data = refineData(plans);

    return { plans: data };
  } catch (error) {
    console.error('getPlans >>', error);
    throw error;
  }
};

/** 무제한 요금제 목록 */
export const getUnlimitedDataPlans = async () => {
  try {
    const unlimitedDataPlans = await Plan.find({
      dataGb: -1,
      isPopular: true, // 인기 요금제만
    }).select(EXCLUDED_FIELDS);
    const data = refineData(unlimitedDataPlans);

    return { plans: data };
  } catch (error) {
    console.error('getUnlimitedDataPlans >>', error);
    throw error;
  }
};

/** OTT 서비스가 결합된 요금제 목록 */
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
    }).select(EXCLUDED_FIELDS);
    const data = refineData(plans);

    return { plans: data };
  } catch (error) {
    console.error('getOTTBundlePlans >>', error);
    throw error;
  }
};

/** 저렴한 요금제 목록 */
export const getAffordablePlans = async () => {
  try {
    const affordablePlans = await Plan.find({
      monthlyFee: { $lte: 50000 },
    }).select(EXCLUDED_FIELDS);
    const data = refineData(affordablePlans);

    return { plans: data };
  } catch (error) {
    console.error('getAffordablePlans >>', error);
    throw error;
  }
};

/** 저렴한 요금제 목록 */
export const getFamilyBundlePlans = async () => {
  try {
    const bundlePlans = await Plan.find({
      bundleBenefit: { $ne: null },
    })
      .select(EXCLUDED_FIELDS)
      .limit(5);
    const data = refineData(bundlePlans);

    return { plans: data };
  } catch (error) {
    console.error('getFamilyBundlePlans >>', error);
    throw error;
  }
};
