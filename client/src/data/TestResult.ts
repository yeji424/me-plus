import type { TestPlan } from '@/components/types/TestResult';

export const TestResult: TestPlan[] = [
  {
    id: 'plan-high-data',
    name: '데이터 무제한 요금제',
    condition: (answers) => {
      const highDataQuestions = [1, 2];
      const usesHighData =
        highDataQuestions.some((id) => answers[id] === 'yes') ||
        answers[5] === '메신저, SNS 등의 모바일 앱' ||
        answers[5] === '화상 통화 및 영상 회의';
      return usesHighData;
    },
  },
  {
    id: 'plan-music',
    name: '음악 구독 결합 요금제',
    condition: (answers) => answers[3] === 'yes',
  },
  {
    id: 'plan-ott',
    name: 'OTT 구독 결합 요금제',
    condition: (answers) => answers[4] === 'yes',
  },
  {
    id: 'plan-roaming',
    name: '해외 로밍 요금제',
    condition: (answers) => answers[6] === 'yes',
  },
  {
    id: 'plan-calling',
    name: '통화 중심 요금제',
    condition: (answers) => answers[7] === 'yes',
  },
  {
    id: 'plan-basic',
    name: '기본 요금제',
    condition: () => true,
  },
];
