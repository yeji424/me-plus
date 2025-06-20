import type { Answer, PlanResult } from '@/components/types/TestResult';

type Rule = {
  condition: (answers: Record<number, Answer>) => boolean;
  result: PlanResult;
};

const TestResult: Rule[] = [
  //음악
  {
    condition: (a) => a[5] === 'yes',
    result: {
      id: 'music-plus',
      name: '5G 프리미어 레귤러',
      description:
        'U⁺5G 서비스는 물론, 스마트기기 1개와 다양한 콘텐츠까지 마음껏 이용할 수 있는 5G 요금제\n미디어 서비스 기본 제공(택1)\n지니, 벅스, FLO 중 선택 가능',
      priority: 1,
      dataUsage: 100,
      callUsage: 100,
      messageUsage: 100,
      price: 95000,
      tagLine: '지니뮤직 제휴 결합',
    },
  },
  //OTT
  {
    condition: (a) => a[6] === 'yes',
    result: {
      id: 'ott-plus',
      name: '5G 프리미어 플러스',
      description:
        'U⁺5G 서비스는 물론, 스마트 기기 2개와 다양한 콘텐츠까지 마음껏 이용할 수 있는 5G 요금제\n프리미엄 서비스 기본 제공(택1)\n지니, 벅스, FLO 중 선택 가능',
      priority: 1,
      dataUsage: 100,
      callUsage: 100,
      messageUsage: 100,
      price: 105000,
      tagLine: '넷플릭스 / 왓챠 제휴 결합',
    },
  },
  //결합
  {
    condition: (a) => a[7] === 'yes',
    result: {
      id: 'family',
      name: '5G 프리미어 에센셜',
      description:
        'U⁺5G 서비스를 마음껏 즐길 수 있는 5G 요금제\n친구, 가족과 결합하면 데이터 무제한 요금제를 최대 20,000원 할인',
      priority: 1,
      dataUsage: 100,
      callUsage: 100,
      messageUsage: 100,
      price: 85000,
      tagLine: 'U+ 투게더 결합',
    },
  },
  // 청소년
  {
    condition: (a) => a[1] === '청소년 ( 만 18세 이하 )',
    result: {
      id: 'youth1-special',
      name: '5G 라이트 청소년',
      description:
        '저렴한 요금으로 실속있게 U⁺5G 서비스를 이용할 수 있는 청소년 전용 5G 요금제\n최대 1Mbps 속도로 데이터 무제한 이용 가능\n만 18세 이하만 가입가능',
      priority: 1,
      dataUsage: 15,
      callUsage: 100,
      messageUsage: 100,
      price: 45000,
      tagLine: '데이터 무제한 최대 1Mbps 속도',
    },
  },

  {
    condition: (a) => a[1] === '유스 ( 만 19세 이상 만 34세 이하 )',
    result: {
      id: 'youth2-special',
      name: '유스 5G 스탠다드',
      description:
        '일반 5G요금제보다 더 넉넉한 데이터를 이용할 수 있는 청년 전용 5G요금제\n만 19세 이상 만 34세 이하 청년만 가입가능',
      priority: 1,
      dataUsage: 90,
      callUsage: 100,
      messageUsage: 100,
      price: 75000,
      tagLine: '데이터 무제한 최대 5Mbps 속도',
    },
  },

  {
    condition: (a) => a[1] === '시니어 ( 만 65세 이상 만 70세 이하 )',
    result: {
      id: 'youth3-special',
      name: 'LTE 데이터 시니어 33',
      description:
        '음성통화와 문자메시지는 기본으로 사용하고 저렴한 요금으로 데이터를 이용할 수 있는 실속형 시니어 전용 LTE 요금제\n1시간~3시간마다 문자메시지로 내 위치를 보호자에게 알려주는 실버지킴이 서비스',
      priority: 1,
      dataUsage: 5,
      callUsage: 100,
      messageUsage: 100,
      price: 33000,
      tagLine: '실버지킴이 서비스',
    },
  },

  {
    condition: (a) => {
      const yesCount =
        (a[2] === 'yes' ? 1 : 0) +
        (a[3] === 'yes' ? 1 : 0) +
        (a[4] === '메신저, SNS 등의 모바일 앱' ? 1 : 0);
      return yesCount === 3;
    },
    result: {
      id: 'max-data',
      name: '5G 프리미어 에센셜',
      description:
        'U⁺5G 서비스를 마음껏 즐길 수 있는 5G 요금제\nU+ 투게더 결합\n프리미어 요금제 약정할인\n로밍 혜택 프로모션',
      priority: 1,
      dataUsage: 100,
      callUsage: 100,
      messageUsage: 100,
      price: 85000,
      tagLine: '데이터 무제한',
    },
  },
  {
    condition: (a) => {
      const yesCount =
        (a[2] === 'yes' ? 1 : 0) +
        (a[3] === 'yes' ? 1 : 0) +
        (a[4] === '메신저, SNS 등의 모바일 앱' ? 1 : 0);
      return yesCount === 2;
    },
    result: {
      id: 'data-high',
      name: '5G 스탠다드',
      description:
        '넉넉한 데이터로 U⁺5G 서비스를 이용할 수 있는 5G 표준 요금제\n최대 5Mbps 속도로 데이터 무제한 이용 가능',
      priority: 2,
      dataUsage: 80,
      callUsage: 100,
      messageUsage: 100,
      price: 75000,
      tagLine: '데이터 무제한 최대 5Mbps 속도',
    },
  },
  {
    condition: (a) => {
      const yesCount =
        (a[2] === 'yes' ? 1 : 0) +
        (a[3] === 'yes' ? 1 : 0) +
        (a[4] === '메신저, SNS 등의 모바일 앱' ? 1 : 0);
      return yesCount === 1;
    },
    result: {
      id: 'data-medium',
      name: '5G 데이터 플러스',
      description:
        '필요한 만큼만 데이터를 선택할 수 있고, 다 쓰고 난 후에도 추가 요금 없이 데이터를 사용할 수 있는 요금제\n최대 1Mbps 속도로 데이터 무제한 이용 가능',
      priority: 2,
      dataUsage: 60,
      callUsage: 100,
      messageUsage: 100,
      price: 66000,
      tagLine: '데이터 무제한 최대 1Mbps 속도',
    },
  },
];

export default TestResult;
