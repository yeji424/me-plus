import { useEffect, useState } from 'react';

import Header from '@/components/common/Header';
import PlanSelectionCard from '@/components/ComparePage/PlanSelectionCard';
import FilterSection from '@/components/ComparePage/FilterSection';
import PlanListItem from '@/components/ComparePage/PlanListItem';
import { usePlanFilter } from '@/hooks/usePlanFilter';
import ComparisonResult from '@/components/ComparePage/ComparisonResult';
import type { Plan } from '@/components/types/Plan';
import Modal from '@/components/common/Modal';
import Button from '@/components/common/Button';

import { useNavigate } from 'react-router-dom';
import { getAllPlans } from '@/api/plan';

import 'react-spring-bottom-sheet/dist/style.css';
import { BottomSheet } from 'react-spring-bottom-sheet';
import LoadingBubble from '@/components/chatbot/LoadingBubble';
import FadeInUpDiv from '@/components/common/FadeInUpDiv';

// 컴포넌트 외부로 이동하여 재생성 방지
const localFallbackPlans: Plan[] = [
  {
    _id: '6854f00d7ed56e59bef61127',
    category: '5G',
    name: '5G 시그니처',
    description:
      'U⁺5G 서비스와 프리미엄 혜택을 마음껏 즐기고, 가족과 공유할 수 있는 데이터까지 추가로 받는 5G 요금제',
    isPopular: false,
    dataGb: -1,
    sharedDataGb: 120,
    voiceMinutes: -1,
    addonVoiceMinutes: 300,
    smsCount: -1,
    monthlyFee: 130000,
    optionalDiscountAmount: 92250,
    premiumDiscountAmount: 0,
    ageGroup: 'ALL',
    detailUrl:
      'https://www.lguplus.com/mobile/plan/mplan/5g-all/5g-unlimited/Z202205253',
    bundleBenefit:
      'U+ 투게더 결합, 5G 시그니처 가족할인, 태블릿/스마트기기 월정액 할인, 프리미어 요금제 약정할인, 로밍 혜택 프로모션',
    mediaAddons:
      '아이들나라 스탠다드+러닝, 바이브 앱+PC 음악감상, 유플레이, 밀리의 서재, 지니뮤직 앱+PC 음악감상',
    premiumAddons:
      '폰교체 패스, 삼성팩, 티빙 이용권 할인, 디즈니+, 넷플릭스, 헬로렌탈구독, 일리커피구독, 우리집지킴이 Easy2+, 우리집돌봄이 Kids, 신한카드 Air, 유튜브 프리미엄 할인',
    basicService: 'U+ 모바일tv 기본 월정액 무료, U+멤버십 VVIP 등급 혜택',
  },
  {
    _id: '6854f00d7ed56e59bef61128',
    category: '5G',
    name: '5G 프리미어 슈퍼',
    description:
      'U⁺5G 서비스와 프리미엄 혜택을 마음껏 즐기고, 가족과 공유할 수 있는 데이터까지 추가로 받는 5G 요금제',
    isPopular: false,
    dataGb: -1,
    sharedDataGb: 100,
    voiceMinutes: -1,
    addonVoiceMinutes: 300,
    smsCount: -1,
    monthlyFee: 115000,
    optionalDiscountAmount: 81000,
    premiumDiscountAmount: 0,
    ageGroup: 'ALL',
    detailUrl:
      'https://www.lguplus.com/mobile/plan/mplan/5g-all/5g-unlimited/Z202205251',
    bundleBenefit:
      'U+ 투게더 결합, 태블릿/스마트기기 월정액 할인, 프리미어 요금제 약정할인, 로밍 혜택 프로모션',
    mediaAddons:
      '아이들나라 스탠다드+러닝, 유플레이, 밀리의 서재, 지니뮤직 앱+PC 음악감상, 바이브 앱 음악감상',
    premiumAddons:
      '폰교체 패스, 삼성팩, 티빙 이용권 할인, 디즈니+, 넷플릭스, 헬로렌탈구독, 일리커피구독, 우리집지킴이 Easy2+, 우리집돌봄이 Kids, 신한카드 Air, 유튜브 프리미엄 할인',
    basicService: 'U+ 모바일tv 기본 월정액 무료, U+멤버십 VVIP 등급 혜택',
  },
  {
    _id: '6854f00d7ed56e59bef61129',
    category: '5G',
    name: '5G 프리미어 플러스',
    description:
      'U⁺5G 서비스는 물론, 스마트 기기 2개와 다양한 콘텐츠까지 마음껏 이용할 수 있는 5G 요금제',
    isPopular: false,
    dataGb: -1,
    sharedDataGb: 100,
    voiceMinutes: -1,
    addonVoiceMinutes: 300,
    smsCount: -1,
    monthlyFee: 105000,
    optionalDiscountAmount: 73500,
    premiumDiscountAmount: 0,
    ageGroup: 'ALL',
    detailUrl:
      'https://www.lguplus.com/mobile/plan/mplan/5g-all/5g-unlimited/Z202205252',
    bundleBenefit:
      'U+ 투게더 결합, 태블릿/스마트기기 월정액 할인, 프리미어 요금제 약정할인, 로밍 혜택 프로모션',
    mediaAddons:
      '아이들나라 스탠다드+러닝, 유플레이, 밀리의 서재, 지니뮤직 앱+PC 음악감상, 바이브 앱 음악감상',
    premiumAddons:
      '폰교체 패스, 삼성팩, 티빙 이용권 할인, 넷플릭스, 디즈니+, 헬로렌탈구독, 일리커피구독, 우리집지킴이 Easy2+, 우리집돌봄이 Kids, 신한카드 Air, 유튜브 프리미엄 할인',
    basicService: 'U+ 모바일tv 기본 월정액 무료, U+멤버십 VVIP 등급 혜택',
  },
  {
    _id: '6854f00d7ed56e59bef6112a',
    category: '5G',
    name: '5G 프리미어 레귤러',
    description:
      'U⁺5G 서비스는 물론, 스마트기기 1개와 다양한 콘텐츠까지 마음껏 이용할 수 있는 5G 요금제',
    isPopular: true,
    dataGb: -1,
    sharedDataGb: 80,
    voiceMinutes: -1,
    addonVoiceMinutes: 300,
    smsCount: -1,
    monthlyFee: 95000,
    optionalDiscountAmount: 66000,
    premiumDiscountAmount: 0,
    ageGroup: 'ALL',
    detailUrl:
      'https://www.lguplus.com/mobile/plan/mplan/5g-all/5g-unlimited/LPZ0000433',
    bundleBenefit:
      'U+ 투게더 결합, 태블릿/스마트기기 월정액 할인, 프리미어 요금제 약정할인, 로밍 혜택 프로모션',
    mediaAddons:
      '아이들나라 스탠다드+러닝, 유플레이, 밀리의 서재, 바이브 300회 음악감상, 지니뮤직 300회 음악감상',
    premiumAddons: null,
    basicService: 'U+ 모바일tv 기본 월정액 무료, U+멤버십 VVIP 등급 혜택',
  },
  {
    _id: '6854f00d7ed56e59bef6112b',
    category: '5G',
    name: '5G 프리미어 에센셜',
    description: 'U⁺5G 서비스를 마음껏 즐길 수 있는 5G 요금제',
    isPopular: true,
    dataGb: -1,
    sharedDataGb: 70,
    voiceMinutes: -1,
    addonVoiceMinutes: 300,
    smsCount: -1,
    monthlyFee: 85000,
    optionalDiscountAmount: 58500,
    premiumDiscountAmount: 0,
    ageGroup: 'ALL',
    detailUrl:
      'https://www.lguplus.com/mobile/plan/mplan/5g-all/5g-unlimited/LPZ0000409',
    bundleBenefit:
      'U+ 투게더 결합, 태블릿/스마트기기 월정액 할인, 프리미어 요금제 약정할인, 로밍 혜택 프로모션',
    mediaAddons: null,
    premiumAddons: null,
    basicService: 'U+ 모바일tv 기본 월정액 무료, U+멤버십 VIP 등급 혜택',
  },
  {
    _id: '6854f00d7ed56e59bef6112c',
    category: '5G',
    name: '5G 복지 75',
    description: '복지할인 받는 고객님을 위한 5G 요금제',
    isPopular: false,
    dataGb: 150,
    sharedDataGb: 60,
    voiceMinutes: -1,
    addonVoiceMinutes: 600,
    smsCount: -1,
    monthlyFee: 75000,
    optionalDiscountAmount: 56250,
    premiumDiscountAmount: 0,
    ageGroup: 'ALL',
    detailUrl:
      'https://www.lguplus.com/mobile/plan/mplan/5g-all/5g-welfare/LPZ0000348',
    bundleBenefit: null,
    mediaAddons: null,
    premiumAddons: null,
    basicService: 'U+ 모바일tv 기본 월정액 무료, U+멤버십 VIP 등급 혜택',
  },
  {
    _id: '6854f00d7ed56e59bef6112d',
    category: '5G',
    name: '5G 스탠다드',
    description: '넉넉한 데이터로 U⁺5G 서비스를 이용할 수 있는 5G 표준 요금제',
    isPopular: true,
    dataGb: 150,
    sharedDataGb: 60,
    voiceMinutes: -1,
    addonVoiceMinutes: 300,
    smsCount: -1,
    monthlyFee: 75000,
    optionalDiscountAmount: 56250,
    premiumDiscountAmount: 0,
    ageGroup: 'ALL',
    detailUrl:
      'https://www.lguplus.com/mobile/plan/mplan/5g-all/5g-unlimited/LPZ0000415',
    bundleBenefit: null,
    mediaAddons: null,
    premiumAddons: null,
    basicService: 'U+ 모바일tv 기본 월정액 무료, U+멤버십 VIP 등급 혜택',
  },
  {
    _id: '6854f00d7ed56e59bef6112e',
    category: '5G',
    name: '유쓰 5G 스탠다드',
    description:
      '일반 5G요금제보다 더 넉넉한 데이터를 이용할 수 있는 청년 전용 5G요금제',
    isPopular: true,
    dataGb: 210,
    sharedDataGb: 65,
    voiceMinutes: -1,
    addonVoiceMinutes: 300,
    smsCount: -1,
    monthlyFee: 75000,
    optionalDiscountAmount: 56250,
    premiumDiscountAmount: 0,
    ageGroup: 'YOUTH',
    detailUrl:
      'https://www.lguplus.com/mobile/plan/mplan/5g-all/5g-young/LPZ1000232',
    bundleBenefit: null,
    mediaAddons: null,
    premiumAddons: null,
    basicService: 'U+ 모바일tv 기본 월정액 무료, U+멤버십 VIP 등급 혜택',
  },
  {
    _id: '6854f00d7ed56e59bef6112f',
    category: '5G',
    name: '5G 스탠다드 에센셜',
    description:
      '필요한 만큼만 데이터를 선택할 수 있고, 다 쓰고 난 후에도 추가 요금 없이 데이터를 사용할 수 있는 요금제',
    isPopular: false,
    dataGb: 125,
    sharedDataGb: 55,
    voiceMinutes: -1,
    addonVoiceMinutes: 300,
    smsCount: -1,
    monthlyFee: 70000,
    optionalDiscountAmount: 52500,
    premiumDiscountAmount: 0,
    ageGroup: 'ALL',
    detailUrl:
      'https://www.lguplus.com/mobile/plan/mplan/5g-all/5g-unlimited/LPZ0000784',
    bundleBenefit: null,
    mediaAddons: null,
    premiumAddons: null,
    basicService: 'U+ 모바일tv 기본 월정액 무료',
  },
  {
    _id: '6854f00d7ed56e59bef61130',
    category: '5G',
    name: '유쓰 5G 스탠다드 에센셜',
    description:
      '일반 5G요금제보다 더 넉넉한 데이터를 이용할 수 있는 청년 전용 5G요금제',
    isPopular: false,
    dataGb: 185,
    sharedDataGb: 60,
    voiceMinutes: -1,
    addonVoiceMinutes: 300,
    smsCount: -1,
    monthlyFee: 70000,
    optionalDiscountAmount: 52500,
    premiumDiscountAmount: 0,
    ageGroup: 'YOUTH',
    detailUrl:
      'https://www.lguplus.com/mobile/plan/mplan/5g-all/5g-young/LPZ1000231',
    bundleBenefit: null,
    mediaAddons: null,
    premiumAddons: null,
    basicService: 'U+ 모바일tv 기본 월정액 무료',
  },
  {
    _id: '6854f00d7ed56e59bef61131',
    category: 'LTE',
    name: '추가 요금 걱정 없는 데이터 69',
    description:
      '추가 요금 걱정 없이 동영상, 고용량 콘텐츠까지 마음껏 이용할 수 있는 LTE요금제',
    isPopular: true,
    dataGb: 0.5,
    sharedDataGb: 11,
    voiceMinutes: -1,
    addonVoiceMinutes: 300,
    smsCount: -1,
    monthlyFee: 69000,
    optionalDiscountAmount: 51750,
    premiumDiscountAmount: 0,
    ageGroup: 'ALL',
    detailUrl:
      'https://www.lguplus.com/mobile/plan/mplan/lte-all/lte-unlimited/LPZ0000464',
    bundleBenefit: null,
    mediaAddons: null,
    premiumAddons: null,
    basicService: 'U+ 모바일tv 기본 월정액 무료',
  },
  {
    _id: '6854f00d7ed56e59bef61132',
    category: 'LTE',
    name: '추가 요금 걱정 없는 데이터 시니어 69',
    description:
      '추가 요금 걱정없이 동영상, 고용량 콘텐츠까지 마음껏 이용할 수 있는 시니어 전용 LTE 요금제',
    isPopular: false,
    dataGb: 0.5,
    sharedDataGb: 15,
    voiceMinutes: -1,
    addonVoiceMinutes: 300,
    smsCount: -1,
    monthlyFee: 69000,
    optionalDiscountAmount: 51750,
    premiumDiscountAmount: 0,
    ageGroup: 'SENIOR',
    detailUrl:
      'https://www.lguplus.com/mobile/plan/mplan/lte-all/lte-senior/LPZ0002352',
    bundleBenefit: null,
    mediaAddons: null,
    premiumAddons: null,
    basicService: 'U+ 모바일tv 기본 월정액 무료, 실버지킴이',
  },
  {
    _id: '6854f00d7ed56e59bef61133',
    category: 'LTE',
    name: '추가 요금 걱정 없는 데이터 청소년 69',
    description:
      '추가 요금 걱정 없이 동영상, 고용량 콘텐츠까지 마음껏 이용할 수 있는 청소년 전용 LTE 요금제',
    isPopular: false,
    dataGb: 0.5,
    sharedDataGb: 15,
    voiceMinutes: -1,
    addonVoiceMinutes: 300,
    smsCount: -1,
    monthlyFee: 69000,
    optionalDiscountAmount: 51750,
    premiumDiscountAmount: 0,
    ageGroup: 'YOUTH',
    detailUrl:
      'https://www.lguplus.com/mobile/plan/mplan/lte-all/lte-youth/LPZ0002351',
    bundleBenefit: null,
    mediaAddons: null,
    premiumAddons: null,
    basicService: 'U+ 모바일tv 기본 월정액 무료',
  },
  {
    _id: '6854f00d7ed56e59bef61134',
    category: '5G',
    name: '5G 데이터 슈퍼',
    description:
      '필요한 만큼만 데이터를 선택할 수 있고, 다 쓰고 난 후에도 추가 요금 없이 데이터를 사용할 수 있는 요금제',
    isPopular: false,
    dataGb: 95,
    sharedDataGb: 50,
    voiceMinutes: -1,
    addonVoiceMinutes: 300,
    smsCount: -1,
    monthlyFee: 68000,
    optionalDiscountAmount: 51000,
    premiumDiscountAmount: 0,
    ageGroup: 'ALL',
    detailUrl:
      'https://www.lguplus.com/mobile/plan/mplan/5g-all/5g-unlimited/LPZ0000781',
    bundleBenefit: null,
    mediaAddons: null,
    premiumAddons: null,
    basicService: 'U+ 모바일tv 기본 월정액 무료',
  },
  {
    _id: '6854f00d7ed56e59bef61135',
    category: '5G',
    name: '유쓰 5G 데이터 슈퍼',
    description:
      '일반 5G요금제보다 더 넉넉한 데이터를 이용할 수 있는 청년 전용 5G요금제',
    isPopular: false,
    dataGb: 135,
    sharedDataGb: 55,
    voiceMinutes: -1,
    addonVoiceMinutes: 300,
    smsCount: -1,
    monthlyFee: 68000,
    optionalDiscountAmount: 51000,
    premiumDiscountAmount: 0,
    ageGroup: 'YOUTH',
    detailUrl:
      'https://www.lguplus.com/mobile/plan/mplan/5g-all/5g-young/LPZ1000230',
    bundleBenefit: null,
    mediaAddons: null,
    premiumAddons: null,
    basicService: 'U+ 모바일tv 기본 월정액 무료',
  },
  {
    _id: '6854f00d7ed56e59bef61136',
    category: '5G',
    name: '5G 데이터 플러스',
    description:
      '필요한 만큼만 데이터를 선택할 수 있고, 다 쓰고 난 후에도 추가 요금 없이 데이터를 사용할 수 있는 요금제',
    isPopular: false,
    dataGb: 80,
    sharedDataGb: 45,
    voiceMinutes: -1,
    addonVoiceMinutes: 300,
    smsCount: -1,
    monthlyFee: 66000,
    optionalDiscountAmount: 49500,
    premiumDiscountAmount: 0,
    ageGroup: 'ALL',
    detailUrl:
      'https://www.lguplus.com/mobile/plan/mplan/5g-all/5g-unlimited/LPZ0000782',
    bundleBenefit: null,
    mediaAddons: null,
    premiumAddons: null,
    basicService: 'U+ 모바일tv 기본 월정액 무료',
  },
  {
    _id: '6854f00d7ed56e59bef61137',
    category: '5G',
    name: '유쓰 5G 데이터 플러스',
    description:
      '일반 5G요금제보다 더 넉넉한 데이터를 이용할 수 있는 청년 전용 5G요금제',
    isPopular: false,
    dataGb: 110,
    sharedDataGb: 50,
    voiceMinutes: -1,
    addonVoiceMinutes: 300,
    smsCount: -1,
    monthlyFee: 66000,
    optionalDiscountAmount: 49500,
    premiumDiscountAmount: 0,
    ageGroup: 'YOUTH',
    detailUrl:
      'https://www.lguplus.com/mobile/plan/mplan/5g-all/5g-young/LPZ1000229',
    bundleBenefit: null,
    mediaAddons: null,
    premiumAddons: null,
    basicService: 'U+ 모바일tv 기본 월정액 무료',
  },
  {
    _id: '6854f00d7ed56e59bef61138',
    category: '5G',
    name: '5G 데이터 레귤러',
    description:
      '필요한 만큼만 데이터를 선택할 수 있고, 다 쓰고 난 후에도 추가 요금 없이 데이터를 사용할 수 있는 요금제',
    isPopular: false,
    dataGb: 50,
    sharedDataGb: 40,
    voiceMinutes: -1,
    addonVoiceMinutes: 300,
    smsCount: -1,
    monthlyFee: 63000,
    optionalDiscountAmount: 47250,
    premiumDiscountAmount: 0,
    ageGroup: 'ALL',
    detailUrl:
      'https://www.lguplus.com/mobile/plan/mplan/5g-all/5g-unlimited/LPZ0000783',
    bundleBenefit: null,
    mediaAddons: null,
    premiumAddons: null,
    basicService: 'U+ 모바일tv 기본 월정액 무료',
  },
  {
    _id: '6854f00d7ed56e59bef61139',
    category: '5G',
    name: '유쓰 5G 데이터 레귤러',
    description:
      '일반 5G요금제보다 더 넉넉한 데이터를 이용할 수 있는 청년 전용 5G요금제',
    isPopular: false,
    dataGb: 70,
    sharedDataGb: 45,
    voiceMinutes: -1,
    addonVoiceMinutes: 300,
    smsCount: -1,
    monthlyFee: 63000,
    optionalDiscountAmount: 47250,
    premiumDiscountAmount: 0,
    ageGroup: 'YOUTH',
    detailUrl:
      'https://www.lguplus.com/mobile/plan/mplan/5g-all/5g-young/LPZ1000228',
    bundleBenefit: null,
    mediaAddons: null,
    premiumAddons: null,
    basicService: 'U+ 모바일tv 기본 월정액 무료',
  },
  {
    _id: '6854f00d7ed56e59bef6113a',
    category: '5G',
    name: '5G 심플+',
    description: '합리적인 요금으로 U+5G 서비스를 이용할 수 있는 5G 요금제',
    isPopular: true,
    dataGb: 31,
    sharedDataGb: 0,
    voiceMinutes: -1,
    addonVoiceMinutes: 300,
    smsCount: -1,
    monthlyFee: 61000,
    optionalDiscountAmount: 45750,
    premiumDiscountAmount: 0,
    ageGroup: 'ALL',
    detailUrl:
      'https://www.lguplus.com/mobile/plan/mplan/5g-all/5g-unlimited/LPZ0002860',
    bundleBenefit: null,
    mediaAddons: null,
    premiumAddons: null,
    basicService: 'U+ 모바일tv 기본 월정액 무료',
  },
  {
    _id: '6854f00d7ed56e59bef6113b',
    category: '5G',
    name: '유쓰 5G 심플+',
    description:
      '일반 5G요금제보다 더 넉넉한 데이터를 이용할 수 있는 청년 전용 5G요금제',
    isPopular: false,
    dataGb: 41,
    sharedDataGb: 0,
    voiceMinutes: -1,
    addonVoiceMinutes: 300,
    smsCount: -1,
    monthlyFee: 61000,
    optionalDiscountAmount: 45750,
    premiumDiscountAmount: 0,
    ageGroup: 'YOUTH',
    detailUrl:
      'https://www.lguplus.com/mobile/plan/mplan/5g-all/5g-young/LPZ1000227',
    bundleBenefit: null,
    mediaAddons: null,
    premiumAddons: null,
    basicService: 'U+ 모바일tv 기본 월정액 무료',
  },
  {
    _id: '6854f00d7ed56e59bef6113c',
    category: '5G',
    name: '5G 베이직+',
    description:
      '일반 5G요금제보다 더 넉넉한 데이터를 이용할 수 있는 5G 요금제',
    isPopular: false,
    dataGb: 24,
    sharedDataGb: 0,
    voiceMinutes: -1,
    addonVoiceMinutes: 300,
    smsCount: -1,
    monthlyFee: 59000,
    optionalDiscountAmount: 44250,
    premiumDiscountAmount: 0,
    ageGroup: 'ALL',
    detailUrl:
      'https://www.lguplus.com/mobile/plan/mplan/5g-all/5g-unlimited/LPZ1001268',
    bundleBenefit: null,
    mediaAddons: null,
    premiumAddons: null,
    basicService: 'U⁺ 모바일tv라이트 무료',
  },
  {
    _id: '6854f00d7ed56e59bef6113d',
    category: '5G',
    name: '유쓰 5G 베이직+',
    description:
      '일반 5G요금제보다 더 넉넉한 데이터를 이용할 수 있는 청년 전용 5G 요금제',
    isPopular: false,
    dataGb: 36,
    sharedDataGb: 0,
    voiceMinutes: -1,
    addonVoiceMinutes: 300,
    smsCount: -1,
    monthlyFee: 59000,
    optionalDiscountAmount: 44250,
    premiumDiscountAmount: 0,
    ageGroup: 'YOUTH',
    detailUrl:
      'https://www.lguplus.com/mobile/plan/mplan/5g-all/5g-young/LPZ1001056',
    bundleBenefit: null,
    mediaAddons: null,
    premiumAddons: null,
    basicService: 'U⁺ 모바일tv라이트 무료',
  },
  {
    _id: '6854f00d7ed56e59bef6113e',
    category: 'LTE',
    name: '추가 요금 걱정 없는 데이터 청소년 59',
    description:
      '추가 요금 걱정 없이 SNS, 메신저, 웹서핑 등의 서비스를 마음껏 이용할 수 있는 청소년 전용 LTE 요금제',
    isPopular: false,
    dataGb: 9,
    sharedDataGb: 0,
    voiceMinutes: -1,
    addonVoiceMinutes: 300,
    smsCount: -1,
    monthlyFee: 59000,
    optionalDiscountAmount: 44250,
    premiumDiscountAmount: 0,
    ageGroup: 'STUDENT',
    detailUrl:
      'https://www.lguplus.com/mobile/plan/mplan/lte-all/lte-youth/LPZ0000469',
    bundleBenefit: null,
    mediaAddons: null,
    premiumAddons: null,
    basicService: 'U+ 모바일tv 기본 월정액 무료',
  },
  {
    _id: '6854f00d7ed56e59bef6113f',
    category: '5G',
    name: '5G 라이트+',
    description: '저렴한 요금으로 U⁺5G 서비스를 이용할 수 있는 5G 실속 요금제',
    isPopular: false,
    dataGb: 14,
    sharedDataGb: 0,
    voiceMinutes: -1,
    addonVoiceMinutes: 300,
    smsCount: -1,
    monthlyFee: 55000,
    optionalDiscountAmount: 41250,
    premiumDiscountAmount: 0,
    ageGroup: 'ALL',
    detailUrl:
      'https://www.lguplus.com/mobile/plan/mplan/5g-all/5g-unlimited/LPZ0000437',
    bundleBenefit: null,
    mediaAddons: null,
    premiumAddons: null,
    basicService: 'U⁺ 모바일tv라이트 무료',
  },
  {
    _id: '6854f00d7ed56e59bef61140',
    category: '5G',
    name: '5G 복지 55',
    description: '복지할인 받는 고객님을 위한 5G 요금제',
    isPopular: false,
    dataGb: 14,
    sharedDataGb: 0,
    voiceMinutes: -1,
    addonVoiceMinutes: 600,
    smsCount: -1,
    monthlyFee: 55000,
    optionalDiscountAmount: 41250,
    premiumDiscountAmount: 0,
    ageGroup: 'ALL',
    detailUrl:
      'https://www.lguplus.com/mobile/plan/mplan/5g-all/5g-welfare/LPZ0000349',
    bundleBenefit: '로밍 혜택 프로모션',
    mediaAddons: null,
    premiumAddons: null,
    basicService: 'U⁺ 모바일tv라이트 무료',
  },
  {
    _id: '6854f00d7ed56e59bef61141',
    category: '5G',
    name: '유쓰 5G 라이트+',
    description:
      '일반 5G요금제보다 더 넉넉한 데이터를 이용할 수 있는 청년 전용 5G요금제',
    isPopular: false,
    dataGb: 26,
    sharedDataGb: 1,
    voiceMinutes: -1,
    addonVoiceMinutes: 300,
    smsCount: -1,
    monthlyFee: 55000,
    optionalDiscountAmount: 41250,
    premiumDiscountAmount: 0,
    ageGroup: 'YOUTH',
    detailUrl:
      'https://www.lguplus.com/mobile/plan/mplan/5g-all/5g-young/LPZ1000224',
    bundleBenefit: null,
    mediaAddons: null,
    premiumAddons: null,
    basicService: 'U⁺ 모바일tv라이트 무료',
  },
  {
    _id: '6854f00d7ed56e59bef61142',
    category: 'LTE',
    name: '현역병사 데이터 55',
    description:
      '추가 요금 걱정 없이 동영상, 고용량 콘텐츠까지 마음껏 이용할 수 있는 현역병사 전용 LTE 요금제',
    isPopular: false,
    dataGb: 5,
    sharedDataGb: 5,
    voiceMinutes: -1,
    addonVoiceMinutes: 300,
    smsCount: -1,
    monthlyFee: 55000,
    optionalDiscountAmount: 41250,
    premiumDiscountAmount: 0,
    ageGroup: 'SOLDIER',
    detailUrl:
      'https://www.lguplus.com/mobile/plan/mplan/lte-all/lte-soldier/LPZ0002507',
    bundleBenefit: null,
    mediaAddons: null,
    premiumAddons: null,
    basicService: 'U+ 모바일tv 기본 월정액 무료',
  },
  {
    _id: '6854f00d7ed56e59bef61143',
    category: 'LTE',
    name: '복지 49',
    description: '복지할인 받는 고객님을 위한 LTE 요금제',
    isPopular: false,
    dataGb: 6,
    sharedDataGb: 0,
    voiceMinutes: -1,
    addonVoiceMinutes: 600,
    smsCount: -1,
    monthlyFee: 49000,
    optionalDiscountAmount: 36750,
    premiumDiscountAmount: 0,
    ageGroup: 'ALL',
    detailUrl:
      'https://www.lguplus.com/mobile/plan/mplan/lte-all/lte-welfare/LPZ0002584',
    bundleBenefit: null,
    mediaAddons: null,
    premiumAddons: null,
    basicService: 'U⁺ 모바일tv라이트 무료',
  },
  {
    _id: '6854f00d7ed56e59bef61144',
    category: '5G',
    name: '5G 슬림+',
    description: '저렴한 요금으로 U⁺5G 서비스를 이용할 수 있는 5G 실속 요금제',
    isPopular: true,
    dataGb: 9,
    sharedDataGb: 2,
    voiceMinutes: -1,
    addonVoiceMinutes: 300,
    smsCount: -1,
    monthlyFee: 47000,
    optionalDiscountAmount: 35250,
    premiumDiscountAmount: 0,
    ageGroup: 'ALL',
    detailUrl:
      'https://www.lguplus.com/mobile/plan/mplan/5g-all/5g-unlimited/LPZ0000487',
    bundleBenefit: null,
    mediaAddons: null,
    premiumAddons: null,
    basicService: 'U⁺ 모바일tv라이트 무료',
  },
  {
    _id: '6854f00d7ed56e59bef61145',
    category: '5G',
    name: '유쓰 5G 슬림+',
    description:
      '일반 5G요금제보다 더 넉넉한 데이터를 이용할 수 있는 청년 전용 5G요금제',
    isPopular: false,
    dataGb: 15,
    sharedDataGb: 0,
    voiceMinutes: -1,
    addonVoiceMinutes: 300,
    smsCount: -1,
    monthlyFee: 47000,
    optionalDiscountAmount: 35250,
    premiumDiscountAmount: 0,
    ageGroup: 'YOUTH',
    detailUrl:
      'https://www.lguplus.com/mobile/plan/mplan/5g-all/5g-young/LPZ1000223',
    bundleBenefit: null,
    mediaAddons: null,
    premiumAddons: null,
    basicService: 'U⁺ 모바일tv라이트 무료',
  },
  {
    _id: '6854f00d7ed56e59bef61146',
    category: '5G',
    name: '5G 라이트 청소년',
    description:
      '저렴한 요금으로 실속있게 U⁺5G 서비스를 이용할 수 있는 청소년 전용 5G 요금제',
    isPopular: false,
    dataGb: 8,
    sharedDataGb: 0,
    voiceMinutes: -1,
    addonVoiceMinutes: 300,
    smsCount: -1,
    monthlyFee: 45000,
    optionalDiscountAmount: 33750,
    premiumDiscountAmount: 0,
    ageGroup: 'STUDENT',
    detailUrl:
      'https://www.lguplus.com/mobile/plan/mplan/5g-all/5g-youth/LPZ0000417',
    bundleBenefit: null,
    mediaAddons: null,
    premiumAddons: null,
    basicService: 'U⁺ 모바일tv라이트 무료',
  },
  {
    _id: '6854f00d7ed56e59bef61147',
    category: '5G',
    name: '5G 시니어 A형',
    description:
      '저렴한 요금으로 실속있게 U⁺5G 서비스를 이용할 수 있는 만 65세 이상~70세 미만 전용 5G 요금제',
    isPopular: false,
    dataGb: 10,
    sharedDataGb: 0,
    voiceMinutes: -1,
    addonVoiceMinutes: 400,
    smsCount: -1,
    monthlyFee: 45000,
    optionalDiscountAmount: 33750,
    premiumDiscountAmount: 0,
    ageGroup: 'SENIOR',
    detailUrl:
      'https://www.lguplus.com/mobile/plan/mplan/5g-all/5g-senior/LPZ0000418',
    bundleBenefit: null,
    mediaAddons: null,
    premiumAddons: null,
    basicService: 'U⁺ 모바일tv라이트 무료',
  },
  {
    _id: '6854f00d7ed56e59bef61148',
    category: '5G',
    name: '5G 키즈 45',
    description:
      '저렴한 요금으로 실속 있게 U+5G 서비스를 이용할 수 있는\n만 12세 이하 전용 5G요금제',
    isPopular: false,
    dataGb: 9,
    sharedDataGb: 0,
    voiceMinutes: -1,
    addonVoiceMinutes: 300,
    smsCount: -1,
    monthlyFee: 45000,
    optionalDiscountAmount: 33750,
    premiumDiscountAmount: 0,
    ageGroup: 'CHILD',
    detailUrl:
      'https://www.lguplus.com/mobile/plan/mplan/5g-all/5g-youth/LPZ0002818',
    bundleBenefit: null,
    mediaAddons: '바이브 300회 음악감상',
    premiumAddons: null,
    basicService: null,
  },
  {
    _id: '6854f00d7ed56e59bef61149',
    category: '5G',
    name: '5G 시니어 B형',
    description:
      '저렴한 요금으로 실속있게 U+5G 서비스를 이용할 수 있는 만 70세 이상~80세 미만 전용 5G 요금제',
    isPopular: false,
    dataGb: 10,
    sharedDataGb: 0,
    voiceMinutes: -1,
    addonVoiceMinutes: 400,
    smsCount: -1,
    monthlyFee: 43000,
    optionalDiscountAmount: 32250,
    premiumDiscountAmount: 0,
    ageGroup: 'SENIOR',
    detailUrl:
      'https://www.lguplus.com/mobile/plan/mplan/5g-all/5g-senior/LPZ1000127',
    bundleBenefit: null,
    mediaAddons: null,
    premiumAddons: null,
    basicService: 'U⁺ 모바일tv라이트 무료',
  },
  {
    _id: '6854f00d7ed56e59bef6114a',
    category: '5G',
    name: '5G 시니어 C형',
    description:
      '저렴한 요금으로 실속있게 U+5G 서비스를 이용할 수 있는 만 80세 이상 전용 5G 요금제',
    isPopular: false,
    dataGb: 10,
    sharedDataGb: 0,
    voiceMinutes: -1,
    addonVoiceMinutes: 400,
    smsCount: -1,
    monthlyFee: 39000,
    optionalDiscountAmount: 29250,
    premiumDiscountAmount: 0,
    ageGroup: 'SENIOR',
    detailUrl:
      'https://www.lguplus.com/mobile/plan/mplan/5g-all/5g-senior/LPZ1000128',
    bundleBenefit: null,
    mediaAddons: null,
    premiumAddons: null,
    basicService: 'U⁺ 모바일tv라이트 무료',
  },
  {
    _id: '6854f00d7ed56e59bef6114b',
    category: '5G',
    name: '5G 키즈 39',
    description:
      '저렴한 요금으로 실속 있게 U+5G 서비스를 이용할 수 있는\n만 12세 이하 전용 5G요금제',
    isPopular: false,
    dataGb: 5.5,
    sharedDataGb: 0,
    voiceMinutes: -1,
    addonVoiceMinutes: 300,
    smsCount: -1,
    monthlyFee: 37000,
    optionalDiscountAmount: 27750,
    premiumDiscountAmount: 0,
    ageGroup: 'CHILD',
    detailUrl:
      'https://www.lguplus.com/mobile/plan/mplan/5g-all/5g-youth/LPZ0002810',
    bundleBenefit: null,
    mediaAddons: '바이브 300회 음악감상',
    premiumAddons: null,
    basicService: null,
  },
  {
    _id: '6854f00d7ed56e59bef6114c',
    category: '5G',
    name: '5G 미니',
    description:
      '월 3만 원대 가벼운 요금으로 필요한 만큼 데이터를 실속 있게 즐길 수 있는 5G 요금제',
    isPopular: false,
    dataGb: 5,
    sharedDataGb: 0,
    voiceMinutes: -1,
    addonVoiceMinutes: 300,
    smsCount: -1,
    monthlyFee: 37000,
    optionalDiscountAmount: 27750,
    premiumDiscountAmount: 0,
    ageGroup: 'ALL',
    detailUrl:
      'https://www.lguplus.com/mobile/plan/mplan/5g-all/5g-unlimited/LPZ1000325',
    bundleBenefit: null,
    mediaAddons: null,
    premiumAddons: null,
    basicService: 'U⁺ 모바일tv라이트 무료',
  },
  {
    _id: '6854f00d7ed56e59bef6114d',
    category: '5G',
    name: '유쓰 5G 미니',
    description:
      '일반 5G요금제보다 더 넉넉한 데이터를 이용할 수 있는 청년 전용 5G요금제',
    isPopular: false,
    dataGb: 9,
    sharedDataGb: 0,
    voiceMinutes: -1,
    addonVoiceMinutes: 300,
    smsCount: -1,
    monthlyFee: 37000,
    optionalDiscountAmount: 27750,
    premiumDiscountAmount: 0,
    ageGroup: 'YOUTH',
    detailUrl:
      'https://www.lguplus.com/mobile/plan/mplan/5g-all/5g-young/LPZ1001051',
    bundleBenefit: null,
    mediaAddons: null,
    premiumAddons: null,
    basicService: 'U⁺ 모바일tv라이트 무료',
  },
  {
    _id: '6854f00d7ed56e59bef6114e',
    category: 'LTE',
    name: '데이터 33',
    description:
      '음성통화와 문자메시지는 기본으로 사용하고 저렴한 요금으로 데이터를 이용할 수 있는 실속형 요금제',
    isPopular: false,
    dataGb: 1.5,
    sharedDataGb: 0,
    voiceMinutes: -1,
    addonVoiceMinutes: 110,
    smsCount: -1,
    monthlyFee: 33000,
    optionalDiscountAmount: 24750,
    premiumDiscountAmount: 0,
    ageGroup: 'ALL',
    detailUrl:
      'https://www.lguplus.com/mobile/plan/mplan/lte-all/lte-general/LPZ0000472',
    bundleBenefit: null,
    mediaAddons: null,
    premiumAddons: null,
    basicService: null,
  },
  {
    _id: '6854f00d7ed56e59bef6114f',
    category: 'LTE',
    name: '데이터 시니어 33',
    description:
      '음성통화와 문자메시지는 기본으로 사용하고 저렴한 요금으로 데이터를 이용할 수 있는 실속형 시니어 전용 LTE 요금제',
    isPopular: false,
    dataGb: 1.7,
    sharedDataGb: 0,
    voiceMinutes: -1,
    addonVoiceMinutes: 110,
    smsCount: -1,
    monthlyFee: 33000,
    optionalDiscountAmount: 24750,
    premiumDiscountAmount: 0,
    ageGroup: 'SENIOR',
    detailUrl:
      'https://www.lguplus.com/mobile/plan/mplan/lte-all/lte-senior/LPZ0000296',
    bundleBenefit: null,
    mediaAddons: null,
    premiumAddons: null,
    basicService: '실버지킴이',
  },
  {
    _id: '6854f00d7ed56e59bef61150',
    category: 'LTE',
    name: '복지 33',
    description: '복지할인 받는 고객님을 위한 요금제',
    isPopular: false,
    dataGb: 2,
    sharedDataGb: 0,
    voiceMinutes: -1,
    addonVoiceMinutes: 600,
    smsCount: -1,
    monthlyFee: 33000,
    optionalDiscountAmount: 24750,
    premiumDiscountAmount: 0,
    ageGroup: 'ALL',
    detailUrl:
      'https://www.lguplus.com/mobile/plan/mplan/lte-all/lte-welfare/LPZ0002583',
    bundleBenefit: null,
    mediaAddons: null,
    premiumAddons: null,
    basicService: null,
  },
  {
    _id: '6854f00d7ed56e59bef61151',
    category: 'LTE',
    name: '추가 요금 걱정 없는 데이터 청소년 33',
    description:
      '추가 요금 걱정 없이 SNS, 메신저, 웹서핑, 이메일 등의 서비스를 마음껏 이용할 수 있는 청소년 전용 LTE 요금제',
    isPopular: false,
    dataGb: 2,
    sharedDataGb: 0,
    voiceMinutes: -1,
    addonVoiceMinutes: 110,
    smsCount: -1,
    monthlyFee: 33000,
    optionalDiscountAmount: 24750,
    premiumDiscountAmount: 0,
    ageGroup: 'STUDENT',
    detailUrl:
      'https://www.lguplus.com/mobile/plan/mplan/lte-all/lte-youth/LPZ0000467',
    bundleBenefit: null,
    mediaAddons: null,
    premiumAddons: null,
    basicService: null,
  },
  {
    _id: '6854f00d7ed56e59bef61152',
    category: 'LTE',
    name: '현역병사 데이터 33',
    description:
      '추가 요금 걱정 없이 SNS,메신저, 웹서핑 등의 서비스를 마음껏 이용할 수 있는 현역병사 LTE 요금제',
    isPopular: false,
    dataGb: 2,
    sharedDataGb: 0,
    voiceMinutes: -1,
    addonVoiceMinutes: 110,
    smsCount: -1,
    monthlyFee: 33000,
    optionalDiscountAmount: 24750,
    premiumDiscountAmount: 0,
    ageGroup: 'SOLDIER',
    detailUrl:
      'https://www.lguplus.com/mobile/plan/mplan/lte-all/lte-soldier/LPZ0002506',
    bundleBenefit: null,
    mediaAddons: null,
    premiumAddons: null,
    basicService: null,
  },
  {
    _id: '6854f00d7ed56e59bef61153',
    category: '5G',
    name: '5G 키즈 29',
    description:
      '저렴한 요금으로 실속 있게 U+5G 서비스를 이용할 수 있는\n만 12세 이하 전용 5G요금제',
    isPopular: false,
    dataGb: 3.3,
    sharedDataGb: 0,
    voiceMinutes: -1,
    addonVoiceMinutes: 100,
    smsCount: -1,
    monthlyFee: 29000,
    optionalDiscountAmount: 21750,
    premiumDiscountAmount: 0,
    ageGroup: 'CHILD',
    detailUrl:
      'https://www.lguplus.com/mobile/plan/mplan/5g-all/5g-youth/LPZ0002811',
    bundleBenefit: null,
    mediaAddons: null,
    premiumAddons: null,
    basicService: null,
  },
  {
    _id: '6854f00d7ed56e59bef61154',
    category: 'LTE',
    name: '키즈 22(만 12세 이하)',
    description:
      '저렴한 가격으로 음성통화, 메시지, 데이터를 함께 쓸 수 있는 LTE 요금제',
    isPopular: false,
    dataGb: 0.7,
    sharedDataGb: 0,
    voiceMinutes: -1,
    addonVoiceMinutes: 60,
    smsCount: -1,
    monthlyFee: 22000,
    optionalDiscountAmount: 16500,
    premiumDiscountAmount: 0,
    ageGroup: 'CHILD',
    detailUrl:
      'https://www.lguplus.com/mobile/plan/mplan/lte-all/lte-youth/LPZ0002473',
    bundleBenefit: null,
    mediaAddons: null,
    premiumAddons: null,
    basicService: null,
  },
  {
    _id: '6854f00d7ed56e59bef61155',
    category: 'LTE',
    name: '청소년19',
    description:
      '기본 제공 링 안에서 자유롭게 조절하며 쓸 수 있고, 추가로 LTE 데이터까지 사용할 수 있는 LTE 요금제',
    isPopular: false,
    dataGb: 0.35,
    sharedDataGb: 0,
    voiceMinutes: -1,
    addonVoiceMinutes: 133,
    smsCount: 1000,
    monthlyFee: 20900,
    optionalDiscountAmount: 15675,
    premiumDiscountAmount: 0,
    ageGroup: 'STUDENT',
    detailUrl:
      'https://www.lguplus.com/mobile/plan/mplan/lte-all/lte-youth/LPZ0001369',
    bundleBenefit: null,
    mediaAddons: null,
    premiumAddons: null,
    basicService: null,
  },
  {
    _id: '6854f00d7ed56e59bef61156',
    category: 'LTE',
    name: '시니어16.5',
    description:
      '가족과 통화는 자주 하고 LTE 데이터사용을 원하는 만 65세 이상 고객님을 위한 LTE 요금제',
    isPopular: false,
    dataGb: 0.3,
    sharedDataGb: 0,
    voiceMinutes: -1,
    addonVoiceMinutes: 70,
    smsCount: 100,
    monthlyFee: 16500,
    optionalDiscountAmount: 12375,
    premiumDiscountAmount: 0,
    ageGroup: 'SENIOR',
    detailUrl:
      'https://www.lguplus.com/mobile/plan/mplan/lte-all/lte-senior/LPZ0002291',
    bundleBenefit: null,
    mediaAddons: null,
    premiumAddons: null,
    basicService: '실버지킴이',
  },
];

const ComparePage: React.FC = () => {
  const [open, setOpen] = useState(false);
  const [activeDataIndex, setActiveDataIndex] = useState(0);
  const [activePriceIndex, setActivePriceIndex] = useState(0);
  const [openDropdowns, setOpenDropdowns] = useState<Record<string, boolean>>(
    {},
  );
  const [selectedLeft, setSelectedLeft] = useState<Plan | null>(null);
  const [selectedRight, setSelectedRight] = useState<Plan | null>(null);
  const [selectedSlot, setSelectedSlot] = useState<'left' | 'right' | null>(
    null,
  );
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [plans, setPlans] = useState<Plan[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const navigate = useNavigate();

  const dataList = ['전체', '5G', 'LTE'];
  const priceList = [
    '전체',
    '5만원 미만',
    '5만원 이상 10만원 미만',
    '10만원 이상',
  ];

  const filteredPlans = usePlanFilter(
    plans,
    dataList,
    priceList,
    activeDataIndex,
    activePriceIndex,
  );

  const handleSetActiveDataIndex = (index: number) => {
    setActiveDataIndex(index);
    setOpenDropdowns({});
  };

  const handleSetActivePriceIndex = (index: number) => {
    setActivePriceIndex(index);
    setOpenDropdowns({});
  };

  const handleSelectPlan = (plan: Plan) => {
    if (selectedLeft?._id === plan._id || selectedRight?._id === plan._id) {
      return;
    }

    if (selectedSlot === 'left') {
      setSelectedLeft(plan);
    } else if (selectedSlot === 'right') {
      setSelectedRight(plan);
    }

    setOpen(false);
    setSelectedSlot(null);
  };

  const openSheetForSlot = (slot: 'left' | 'right') => {
    setSelectedSlot(slot);
    setOpenDropdowns({});
    setOpen(true);
  };

  const handleClearSlot = (slot: 'left' | 'right') => {
    if (slot === 'left') {
      setSelectedLeft(null);
    } else if (slot === 'right') {
      setSelectedRight(null);
    }
  };

  const toggleDropdown = (id: string) => {
    setOpenDropdowns((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const openModal = () => {
    setIsModalOpen(true);
  };
  const closeModal = () => {
    setIsModalOpen(false);
  };

  useEffect(() => {
    const fetchPlans = async () => {
      setIsLoading(true);
      try {
        const res = await getAllPlans();
        setPlans(res.plans);
      } catch (error) {
        console.error('요금제 가져오기 실패:', error);
        setPlans(localFallbackPlans);
      }
      setIsLoading(false);
    };

    fetchPlans();
  }, []); // localFallbackPlans는 컴포넌트 외부에서 정의된 상수이므로 의존성 불필요

  return (
    <>
      <Header title="요금제 비교하기" onBackClick={() => openModal()} />
      {isModalOpen && (
        <Modal
          isOpen={isModalOpen}
          onClose={closeModal}
          modalTitle="요금제 비교하기를 그만두시겠어요?"
          modalDesc="그만두실 경우, 선택하신 요금제가 모두 초기화됩니다."
        >
          <Button
            fullWidth
            variant="secondary"
            onClick={closeModal}
            size="medium"
          >
            계속할래요
          </Button>
          <Button fullWidth onClick={() => navigate('/')} size="medium">
            그만둘래요
          </Button>
        </Modal>
      )}
      <FadeInUpDiv custom={0}>
        <h1 className="font-semibold text-2xl text-center mt-[20px]">
          비교하고 싶은
          <br />
          요금제를 선택해 주세요
        </h1>
      </FadeInUpDiv>

      <FadeInUpDiv custom={1}>
        <PlanSelectionCard
          selectedLeft={selectedLeft}
          selectedRight={selectedRight}
          onSelectSlot={openSheetForSlot}
          onClearSlot={handleClearSlot}
        />
      </FadeInUpDiv>

      <FadeInUpDiv custom={2}>
        {selectedLeft || selectedRight ? (
          <ComparisonResult
            selectedLeft={selectedLeft}
            selectedRight={selectedRight}
          />
        ) : (
          <div className="flex flex-col gap-2 justify-center items-center text-center text-gray500 mt-[120px]">
            <p className="text-lg">비교할 요금제가 없습니다</p>
            <p className="text-xl text-primary-pink-60">
              버튼을 눌러 요금제를 선택해주세요!
            </p>
          </div>
        )}
      </FadeInUpDiv>
      <BottomSheet
        className="fixed left-1/2 top-0 bottom-0 -translate-x-1/2 w-full max-w-[600px] flex justify-center items-center z-50"
        open={open}
        onDismiss={() => setOpen(false)}
        snapPoints={({ maxHeight }) => [maxHeight / 1.25]}
      >
        <div className="">
          <FilterSection
            dataList={dataList}
            priceList={priceList}
            activeDataIndex={activeDataIndex}
            activePriceIndex={activePriceIndex}
            onDataIndexChange={handleSetActiveDataIndex}
            onPriceIndexChange={handleSetActivePriceIndex}
          />
          {isLoading && (
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2">
              <LoadingBubble type="dbcalling" />
            </div>
          )}
          <div className="flex flex-col gap-2 select-none mb-3 px-5 mt-[190px]">
            {filteredPlans.map((plan, i) => (
              <FadeInUpDiv
                key={plan._id}
                custom={i}
                delayUnit={0.07}
                duration={0.3}
              >
                <PlanListItem
                  plan={plan}
                  isOpen={openDropdowns[plan._id] || false}
                  isDisabled={
                    selectedLeft?._id === plan._id ||
                    selectedRight?._id === plan._id
                  }
                  onToggle={() => toggleDropdown(plan._id)}
                  onSelect={() => handleSelectPlan(plan)}
                />
              </FadeInUpDiv>
            ))}
          </div>
        </div>
      </BottomSheet>
    </>
  );
};

export default ComparePage;
