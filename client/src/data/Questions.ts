import type { Question } from '@/components/types/Questions';

export const questions: Question[] = [
  {
    id: 1,
    text: 'Wi-Fi 환경보다는 모바일 데이터를 더 자주 사용하시나요?',
    tag: '고용량 데이터',
    type: 'binary',
    tip: {
      highlight: '그렇다',
      rest: '를 선택했을 경우, 데이터 사용량이 많은 가능성이 높아요!',
    },
  },
  {
    id: 2,
    text: '음악이나 영상처럼 데이터 사용량이 큰 콘텐츠를 자주 이용하시나요?',
    tag: '고용량 데이터',
    type: 'binary',
    tip: {
      highlight: '그렇다',
      rest: '를 선택했을 경우, 데이터 사용량이 많은 가능성이 높아요!',
    },
  },
  {
    id: 3,
    text: '음악 스트리밍 서비스를 자주 사용하시나요?',
    tag: '음악 구독 결합',
    type: 'binary',
    tip: {
      highlight: '그렇다',
      rest: '를 선택했을 경우, 음악 구독 결합 혜택이 좋을 것 같아요!',
    },
  },
  {
    id: 4,
    text: 'OTT(구독형 영상 서비스)를 자주 사용하시나요?',
    tag: 'OTT 구독 결합',
    type: 'binary',
    tip: {
      highlight: '그렇다',
      rest: '를 선택했을 경우, OTT 구독 결합 혜택이 좋을 것 같아요!',
    },
  },
  {
    id: 5,
    text: '연락할 때는 어떤 소통 방식을 선호하시나요?',
    tag: '고용량 데이터',
    type: 'multiple',
    options: [
      '전화 및 문자',
      '메신저, SNS 등의 모바일 앱',
      '화상 통화 및 영상 회의',
    ],
    tip: {
      highlight: '메신저, SNS 등의 모바일 앱',
      rest: '을 선택했을 경우, 데이터 사용량이 많을 가능성이 높아요!',
    },
  },
  {
    id: 6,
    text: '해외 여행이나 출장이 자주 있으신가요?',
    tag: '로밍 결합',
    type: 'binary',
    tip: {
      highlight: '그렇다',
      rest: '를 선택했을 경우, 해외로밍 비용이 저렴한게 좋아요!',
    },
  },
  {
    id: 7,
    text: '통화 시간이 긴 편인가요?',
    tag: '통화량',
    type: 'binary',
    tip: {
      highlight: '그렇다',
      rest: '를 선택했을 경우, 음성통화량 무제한이 좋아요!',
    },
  },
];
