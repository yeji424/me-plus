import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// __dirname 대체
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const filePath = path.join(__dirname, 'text.txt');
const outputPath = path.join(__dirname, 'plans.json');

const raw = fs.readFileSync(filePath, 'utf-8');

const plans = [];
const entries = raw.split(/\n(?=\d+\.\s+\[)/); // 번호로 시작하는 요금제 분리

entries.forEach((entry) => {
  const lines = entry.trim().split('\n').filter(Boolean);

  const nameMatch = lines[0].match(/\[\s*(.+?)\s*\]/);
  const name = nameMatch ? nameMatch[1] : '';

  const getValue = (label) => {
    const line = lines.find((line) => line.includes(label));
    if (!line) return null;

    const parts = line.split(':');
    return parts.length > 1 ? parts.slice(1).join(':').trim() : null;
  };

  const monthlyRaw = getValue('월 요금') || '';
  const [monthlyFeeText, discountText] = monthlyRaw.split('(선택약정시');
  const monthlyFee = parseInt(monthlyFeeText.replace(/[^0-9]/g, '')) || 0;
  const optionalDiscountAmount =
    parseInt(discountText?.replace(/[^0-9]/g, '')) || 0;

  const data = getValue('데이터');
  const dataGb = data?.includes('무제한')
    ? -1
    : parseInt(data?.replace(/[^0-9]/g, ''));

  const shared = getValue('공유 데이터');
  const sharedDataGb = shared?.includes('없음')
    ? 0
    : parseInt(shared?.replace(/[^0-9]/g, '')) || 0;

  const ageGroupRaw = getValue('대상');
  const ageGroup = ageGroupRaw === '전체 연령' ? 'ALL' : ageGroupRaw;

  const bundleName = getValue('결합 혜택');
  const bundleBenefit =
    bundleName && bundleName !== '없음'
      ? {
          _id: '',
          name: bundleName,
          description: '',
        }
      : null;

  const addon = getValue('부가서비스');
  const addonText = addon === '없음' ? null : addon;

  const detailUrl = getValue('자세히 보기');

  plans.push({
    _id: '', // 필요하면 hash 처리 추가
    category: '5G',
    name,
    description: '',
    isPopular: false,
    dataGb: dataGb ?? 0,
    sharedDataGb,
    voiceMinutes: -1,
    addonVoiceMinutes: -1,
    smsCount: -1,
    monthlyFee,
    optionalDiscountAmount,
    premiumDiscountAmount: 0,
    ageGroup,
    detailUrl,
    bundleBenefit,
    addon: addonText,
  });
});

fs.writeFileSync(outputPath, JSON.stringify(plans, null, 2), 'utf-8');
console.log(`✅ 변환 완료: ${outputPath}`);
