import { Addon } from '../models/Addon.js';
import { Plan } from '../models/Plan.js';
import { PlanAddon } from '../models/PlanAddon.js';
import { AddonType, BenefitType } from '../utils/constants.js';

export const getPlanDetail = async (req, res) => {
  const transformAddons = (addons) => {
    return addons.map(({ _id, name, description }) => ({
      _id,
      name,
      description,
    }));
  };

  const planId = req.params.planId;
  const plan = await Plan.findById(planId).select('-updatedAt -createdAt');
  const planAddonList = await PlanAddon.find({ plan: plan._id }); // todo: addon Object로 넣기
  const mediaServices = planAddonList.filter(
    (item) =>
      item.benefitType === BenefitType.SPECIAL &&
      item.addonType === AddonType.MEDIA,
  );
  const premiumServices = planAddonList.filter(
    (item) =>
      item.benefitType === BenefitType.SPECIAL &&
      item.addonType === AddonType.PREMIUM,
  );
  const basicBenefits = planAddonList.filter(
    (item) => item.benefitType === BenefitType.BASIC,
  );
  const basicAddons = await Promise.all(
    basicBenefits.map((item) => Addon.findById(item.addon)),
  );
  const mediaAddons = await Promise.all(
    mediaServices.map((item) => Addon.findById(item.addon)),
  );
  const premiumAddons = await Promise.all(
    premiumServices.map((item) => Addon.findById(item.addon)),
  );

  const data = {
    ...plan._doc,
    basicBenefits: transformAddons(basicAddons),
    specialBenefits: {
      premiumServices: transformAddons(premiumAddons),
      mediaServices: transformAddons(mediaAddons),
    },
    bundleBenefit: {
      _id: 'bundle-01',
      name: 'U+ 투게더 결합',
    },
  };

  return res.status(200).json(data);
};
