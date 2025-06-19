export interface Plan {
  _id: string;
  category: string;
  name: string;
  description?: string;
  isPopular: boolean;
  dataGb?: number;
  sharedDataGb?: number;
  voiceMinutes?: number;
  addonVoiceMinutes?: number;
  smsCount?: number;
  monthlyFee: number;
  optionalDiscountAmount?: number;
  premiumDiscountAmount?: number;
  ageGroup?: string;
  detailUrl?: string;
  bundleBenefit?: string;
  mediaAddons?: string | null;
  premiumAddons?: string | null;
  basicService?: string;
}
