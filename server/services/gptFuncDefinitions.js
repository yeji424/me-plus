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

/** 조건에 맞는 요금제 검색 (최대 3개) */
export const searchPlansFromDB = async (searchConditions) => {
  try {
    const {
      category,
      maxMonthlyFee,
      minMonthlyFee, // 🔧 최소 월 요금 추가
      minDataGb,
      ageGroup,
      isPopular,
      preferredAddons, // 🔧 선호하는 부가서비스 추가 (예: ["MEDIA", "OTT", "MUSIC"])
      limit = 3,
    } = searchConditions;

    console.log('🔍 요금제 검색 조건:', searchConditions);

    // 동적 쿼리 조건 생성
    const query = {};

    // 카테고리 조건
    if (category) {
      query.category = category;
    }

    // 월 요금 조건 (범위 검색)
    if (maxMonthlyFee || minMonthlyFee) {
      const monthlyFeeCondition = {};
      if (minMonthlyFee) {
        monthlyFeeCondition.$gte = minMonthlyFee;
      }
      if (maxMonthlyFee) {
        monthlyFeeCondition.$lte = maxMonthlyFee;
      }
      query.monthlyFee = monthlyFeeCondition;
    }

    // 최소 데이터량 조건
    if (minDataGb !== undefined) {
      if (minDataGb === -1) {
        // 무제한 데이터 요청
        query.dataGb = -1;
      } else {
        // 특정 데이터량 이상 요청
        query.$or = [
          { dataGb: -1 }, // 무제한도 포함
          { dataGb: { $gte: minDataGb } }, // 지정된 데이터량 이상
        ];
      }
    }

    // 연령대 조건
    if (ageGroup) {
      query.ageGroup = ageGroup;
    }

    // 인기 요금제 조건
    if (isPopular !== undefined) {
      query.isPopular = isPopular;
    }

    // 🔧 부가서비스 조건 추가
    if (preferredAddons && preferredAddons.length > 0) {
      // 부가서비스 키워드를 포함하는 요금제 필터링
      const addonConditions = [];

      preferredAddons.forEach((addon) => {
        switch (addon.toUpperCase()) {
          case 'NETFLIX':
          case 'NETFLEX':
            addonConditions.push({
              $or: [
                { mediaAddons: { $regex: '넷플릭스', $options: 'i' } },
                { premiumAddons: { $regex: '넷플릭스', $options: 'i' } },
              ],
            });
            break;
          case 'DISNEY':
          case 'DISNEY+':
            addonConditions.push({
              $or: [
                { mediaAddons: { $regex: '디즈니', $options: 'i' } },
                { premiumAddons: { $regex: '디즈니', $options: 'i' } },
              ],
            });
            break;
          case 'TVING':
          case '티빙':
            addonConditions.push({
              $or: [
                { mediaAddons: { $regex: '티빙', $options: 'i' } },
                { premiumAddons: { $regex: '티빙', $options: 'i' } },
              ],
            });
            break;
          case 'MUSIC':
          case '음악':
            addonConditions.push({
              $or: [
                { mediaAddons: { $regex: '바이브|지니뮤직', $options: 'i' } },
                { premiumAddons: { $regex: '바이브|지니뮤직', $options: 'i' } },
              ],
            });
            break;
          case 'YOUTUBE':
          case '유튜브':
            addonConditions.push({
              $or: [
                { mediaAddons: { $regex: '유튜브', $options: 'i' } },
                { premiumAddons: { $regex: '유튜브', $options: 'i' } },
              ],
            });
            break;
          case 'BOOK':
          case '책':
          case '독서':
            addonConditions.push({
              $or: [
                { mediaAddons: { $regex: '밀리의 서재', $options: 'i' } },
                { premiumAddons: { $regex: '밀리의 서재', $options: 'i' } },
              ],
            });
            break;
          case 'KIDS':
          case '아이':
          case '어린이':
            addonConditions.push({
              $or: [
                { mediaAddons: { $regex: '아이들나라', $options: 'i' } },
                {
                  premiumAddons: { $regex: '아이들나라|돌봄이', $options: 'i' },
                },
              ],
            });
            break;
          case 'UPLAY':
          case '유플레이':
            addonConditions.push({
              $or: [
                { mediaAddons: { $regex: '유플레이', $options: 'i' } },
                { premiumAddons: { $regex: '유플레이', $options: 'i' } },
              ],
            });
            break;
          case 'MEDIA':
          case '미디어':
            addonConditions.push({ mediaAddons: { $ne: null, $ne: '' } });
            break;
          case 'PREMIUM':
          case '프리미엄':
            addonConditions.push({ premiumAddons: { $ne: null, $ne: '' } });
            break;
        }
      });

      if (addonConditions.length > 0) {
        // 부가서비스 조건들을 AND로 연결 (모든 조건을 만족하는 요금제)
        query.$and = query.$and
          ? [...query.$and, ...addonConditions]
          : addonConditions;
      }
    }

    console.log('📋 생성된 MongoDB 쿼리:', JSON.stringify(query, null, 2));

    // 쿼리 실행
    const plans = await Plan.find(query)
      .select(EXCLUDED_FIELDS)
      .sort({
        isPopular: -1, // 인기 요금제 우선
        monthlyFee: 1, // 가격 낮은 순
      })
      .limit(limit);

    console.log(`✅ 검색 결과: ${plans.length}개 요금제 찾음`);

    return { plans: plans };
  } catch (error) {
    console.error('searchPlansFromDB >>', error);
    throw error;
  }
};
