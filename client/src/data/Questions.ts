import type { Question } from '@/components/types/Questions';

export const questions: Question[] = [
  {
    id: 1,
    text: '사용자의 연령대가 어떻게 되나요?',
    tag: '특별 연령대',
    type: 'multiple',
    options: [
      '청소년 ( 만 18세 이하 )',
      '유스 ( 만 19세 이상 만 34세 이하 )',
      '시니어 ( 만 65세 이상 만 70세 이하 )',
      '해당 없음',
    ],
    tip: {
      highlight: '청소년, 유스, 시니어',
      rest: '를 선택했을 경우, 특별한 U+요금제를 알려드릴게요!',
    },
  },
  {
    id: 2,
    text: 'Wi-Fi 환경보다는 모바일 데이터를 더 자주 사용하시나요?',
    tag: '고용량 데이터',
    type: 'binary',
    tip: {
      highlight: '그렇다',
      rest: '를 선택했을 경우, 데이터 사용량이 많은 가능성이 높아요!',
    },
  },
  {
    id: 3,
    text: '음악이나 영상처럼 데이터 사용량이 큰 콘텐츠를 자주 이용하시나요?',
    tag: '고용량 데이터',
    type: 'binary',
    tip: {
      highlight: '그렇다',
      rest: '를 선택했을 경우, 데이터 사용량이 많은 가능성이 높아요!',
    },
  },
  {
    id: 4,
    text: '연락할 때는 어떤 소통 방식을 선호하시나요?',
    tag: '고용량 데이터',
    type: 'multiple',
    options: ['전화 및 문자', '메신저, SNS 등의 모바일 앱'],
    tip: {
      highlight: '메신저, SNS 등의 모바일 앱',
      rest: '을 선택했을 경우, 데이터 사용량이 많을 가능성이 높아요!',
    },
  },
  {
    id: 5,
    text: '음악 스트리밍 서비스를 자주 사용하시나요?',
    tag: '음악 구독 결합',
    type: 'binary',
    tip: {
      highlight: '그렇다',
      rest: '를 선택했을 경우, 음악 구독 결합 혜택이 좋을 것 같아요!',
    },
  },
  {
    id: 6,
    text: 'OTT(구독형 영상 서비스)를 자주 사용하시나요?',
    tag: 'OTT 구독 결합',
    type: 'binary',
    tip: {
      highlight: '그렇다',
      rest: '를 선택했을 경우, OTT 구독 결합 혜택이 좋을 것 같아요!',
    },
  },
  {
    id: 7,
    text: '가족들 중 LG U+ 이용고객이 있으신가요?',
    tag: 'U+투게더 결합',
    type: 'binary',
    tip: {
      highlight: '그렇다',
      rest: '를 선택했을 경우, U+투게더 결합 혜택이 포함된 요금제 추천드릴게요!',
    },
  },
];
