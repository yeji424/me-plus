import { Plan } from '../models/Plan.js';
import { PlanAddon } from '../models/PlanAddon.js';
import { PlanResult } from '../models/PlanResult.js';

/** GPT에게 넘길 데이터를 JSON으로 반환합니다. */

const EXCLUDED_FIELDS = '-updatedAt -createdAt -__v';

/** 전체 요금제 목록 */
export const getPlans = async () => {
  try {
    const plans = await Plan.find().select(EXCLUDED_FIELDS);

    return { plans: plans };
  } catch (error) {
    console.error('getPlans >>', error);
    throw error;
  }
};

/** 인기 요금제 목록 */
export const getPopularPlans = async () => {
  try {
    const popularPlans = await Plan.find({ isPopular: true }).select(
      EXCLUDED_FIELDS,
    );

    return { plans: popularPlans };
  } catch (error) {
    console.error('getPopularPlans >>', error);
    throw error;
  }
};

export const getPlanExploreDataList = async () => {
  try {
    // 기존 Plan 모델 대신 PlanResult 모델 사용
    const planExploreDataList = await PlanResult.find({ isActive: true })
      .select(EXCLUDED_FIELDS)
      .sort({ priority: 1 }); // priority 낮은 순으로 정렬

    return { planResults: planExploreDataList };
  } catch (error) {
    console.error('getPlanExploreDataList >>', error);
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

    return { plans: unlimitedDataPlans };
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

    return { plans: plans };
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

    return { plans: affordablePlans };
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

    return { plans: bundlePlans };
  } catch (error) {
    console.error('getFamilyBundlePlans >>', error);
    throw error;
  }
};

/** 테스트 결과 기반 추천 요금제 목록 */
export const getRecommendedPlanResults = async () => {
  try {
    const planResults = await PlanResult.find({ isActive: true })
      .select(EXCLUDED_FIELDS)
      .sort({ priority: 1 }); // priority 낮은 순으로 정렬

    return { planResults: planResults };
  } catch (error) {
    console.error('getRecommendedPlanResults >>', error);
    throw error;
  }
};

/** 특정 우선순위의 추천 요금제 목록 */
export const getPlanResultsByPriority = async (priority) => {
  try {
    const planResults = await PlanResult.find({
      priority: priority,
      isActive: true,
    }).select(EXCLUDED_FIELDS);

    return { planResults: planResults };
  } catch (error) {
    console.error('getPlanResultsByPriority >>', error);
    throw error;
  }
};

/** 특정 ID들의 추천 요금제 목록 */
export const getPlanResultsByIds = async (planIds) => {
  try {
    const planResults = await PlanResult.find({
      id: { $in: planIds },
      isActive: true,
    }).select(EXCLUDED_FIELDS);

    return { planResults: planResults };
  } catch (error) {
    console.error('getPlanResultsByIds >>', error);
    throw error;
  }
};
