import { Plan } from '../models/Plan.js';
import { PlanAddon } from '../models/PlanAddon.js';
import {
  getAffordablePlans,
  getFamilyBundlePlans,
  getOTTBundlePlans,
  getPlans,
  getUnlimitedDataPlans,
} from '../services/gptFuncDefinitions.js';
import { AddonType, BenefitType } from '../utils/constants.js';

/** 요금제 상세 정보 조회 */
export const getPlanDetail = async (req, res) => {
  const transform = (planAddonList) => {
    return planAddonList.map(({ addon: { _id, name, description } }) => ({
      _id,
      name,
      description,
    }));
  };
  try {
    const planId = req.params.planId;
    const plan = await Plan.findById(planId).select('-updatedAt -createdAt');
    const planAddonList = await PlanAddon.find({ plan: plan._id });
    const mediaAddons = planAddonList.filter(
      (item) =>
        item.benefitType === BenefitType.SPECIAL &&
        item.addonType === AddonType.MEDIA,
    );
    const premiumAddons = planAddonList.filter(
      (item) =>
        item.benefitType === BenefitType.SPECIAL &&
        item.addonType === AddonType.PREMIUM,
    );
    const basicAddons = planAddonList.filter(
      (item) => item.benefitType === BenefitType.BASIC,
    );

    const data = {
      ...plan._doc,
      basicBenefits: transform(basicAddons),
      specialBenefits: {
        premiumServices: transform(premiumAddons),
        mediaServices: transform(mediaAddons),
      },
    };

    return res.status(200).json(data);
  } catch (error) {
    return res.sendStatus(500);
  }
};

/** 무제한 요금제 목록 조회 (테스트용: GPT랑 상관 없음)  */
export const getUnlimitedDataPlanList = async (req, res) => {
  try {
    const data = await getUnlimitedDataPlans();
    return res.status(200).json(data);
  } catch (error) {
    return res.sendStatus(500);
  }
};

/** OTT 요금제 목록 조회 (테스트용: GPT랑 상관 없음)  */
export const getOTTPlanList = async (req, res) => {
  try {
    const data = await getOTTBundlePlans();
    return res.status(200).json(data);
  } catch (error) {
    return res.sendStatus(500);
  }
};

/** 저렴한 요금제 목록 조회 (테스트용: GPT랑 상관 없음)  */
export const getAffordablePlanList = async (req, res) => {
  try {
    const data = await getAffordablePlans();
    return res.status(200).json(data);
  } catch (error) {
    return res.sendStatus(500);
  }
};

/** 결합형 요금제 목록 조회 (테스트용: GPT랑 상관 없음)  */
export const getBundlePlanList = async (req, res) => {
  try {
    const data = await getFamilyBundlePlans();
    return res.status(200).json(data);
  } catch (error) {
    return res.sendStatus(500);
  }
};

/** 요금제 목록 조회 (테스트용: GPT랑 상관 없음)  */
export const getPlanList = async (req, res) => {
  try {
    const data = await getPlans();
    return res.status(200).json({ plans: data });
  } catch (error) {
    return res.sendStatus(500);
  }
};
