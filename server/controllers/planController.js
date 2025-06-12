import { Plan } from '../models/Plan.js';
import { PlanAddon } from '../models/PlanAddon.js';
import { AddonType, BenefitType } from '../utils/constants.js';

export const getPlanDetail = async (req, res) => {
  const transform = (planAddonList) => {
    return planAddonList.map(({ addon: { _id, name, description } }) => ({
      _id,
      name,
      description,
    }));
  };

  const planId = req.params.planId;
  const plan = await Plan.findById(planId).select('-updatedAt -createdAt');
  const planAddonList = await PlanAddon.find({ plan: plan._id }); // todo: addon Object로 넣기
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
    bundleBenefit: {
      _id: 'bundle-01',
      name: 'U+ 투게더 결합',
    },
  };

  return res.status(200).json(data);
};
