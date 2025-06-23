import type { Answer } from '@/components/types/TestResult';

type Rule = {
  condition: (answers: Record<number, Answer>) => boolean;
  resultId: string;
};

export const rules: Rule[] = [
  {
    condition: (a) => a[5] === 'yes',
    resultId: 'music-plus',
  },
  {
    condition: (a) => a[6] === 'yes',
    resultId: 'ott-plus',
  },
  {
    condition: (a) => a[7] === 'yes',
    resultId: 'family',
  },
  {
    condition: (a) => a[1] === '청소년 ( 만 18세 이하 )',
    resultId: 'youth1-special',
  },
  {
    condition: (a) => a[1] === '유스 ( 만 19세 이상 만 34세 이하 )',
    resultId: 'youth2-special',
  },
  {
    condition: (a) => a[1] === '시니어 ( 만 65세 이상 만 70세 이하 )',
    resultId: 'youth3-special',
  },
  {
    condition: (a) => {
      const yesCount =
        (a[2] === 'yes' ? 1 : 0) +
        (a[3] === 'yes' ? 1 : 0) +
        (a[4] === '메신저, SNS 등의 모바일 앱' ? 1 : 0);
      return yesCount === 3;
    },
    resultId: 'max-data',
  },
  {
    condition: (a) => {
      const yesCount =
        (a[2] === 'yes' ? 1 : 0) +
        (a[3] === 'yes' ? 1 : 0) +
        (a[4] === '메신저, SNS 등의 모바일 앱' ? 1 : 0);
      return yesCount === 2;
    },
    resultId: 'data-high',
  },
  {
    condition: (a) => {
      const yesCount =
        (a[2] === 'yes' ? 1 : 0) +
        (a[3] === 'yes' ? 1 : 0) +
        (a[4] === '메신저, SNS 등의 모바일 앱' ? 1 : 0);
      return yesCount === 1;
    },
    resultId: 'data-medium',
  },
];
