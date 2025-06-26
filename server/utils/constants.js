export const AgeGroup = {
  CHILD: 'CHILD',
  STUDENT: 'STUDENT',
  YOUTH: 'YOUTH',
  SENIOR: 'SENIOR',
  ALL: 'ALL',
};

export const AgeGroupMapping = {
  CHILD: '어린이',
  STUDENT: '학생',
  YOUTH: '청년',
  SENIOR: '시니어',
  ALL: '전체',
};

export const AddonCategory = {
  MEDIA: 'MEDIA',
  DISCOUNT: 'DISCOUNT',
};

export const AddonCategoryMapping = {
  MEDIA: '영상/음악',
  DISCOUNT: '할인/편의',
};

export const BundleConditionType = {
  MOBILE: 'MOBILE',
  INTERNET: 'INTERNET',
};

export const BundleConditionTypeMapping = {
  MOBILE: '모바일',
  INTERNET: '인터넷',
};

export const BenefitType = {
  BASIC: 'BASIC',
  SPECIAL: 'SPECIAL',
};

export const BenefitTypeMapping = {
  BASIC: '기본',
  SPECIAL: '특별',
};

export const AddonType = {
  PREMIUM: 'PREMIUM',
  MEDIA: 'MEDIA',
};

export const AddonTypeMapping = {
  PREMIUM: '프리미엄',
  MEDIA: '미디어',
};

export const conditionByPlanGuide = {
  '고용량 데이터': '데이터가 많은 요금제를 추천해줘.',
  'OTT 애청자': 'OTT 서비스를 제공하는 요금제를 추천해줘.',
  '경제형 사용자': '가성비 좋은 요금제를 추천해줘.',
  '가족 결합형': '가족 결합 혜택이 있는 요금제를 추천해줘.',
};

export const InputRoleEnum = {
  USER: 'user',
  DEVELOPER: 'developer',
  ASSISTANT: 'assistant',
  PLATFORM: 'platform',
  SYSTEM: 'system',
};

export const GPTConfig = {
  MODEL: 'gpt-4.1-mini',
  MODEL_MINI: 'gpt-4o-mini',
  TIMEOUT_MS: 30000,
  MAX_REDIRECTS: 5,
  REQUEST_TIMEOUT: 10000,
};

export const LoadingType = {
  SEARCHING: 'searching',
  DB_CALLING: 'dbcalling',
};

export const ErrorType = {
  REQUEST_TIMEOUT: 'REQUEST_TIMEOUT',
  OPENAI_API_ERROR: 'OPENAI_API_ERROR',
  NETWORK_ERROR: 'NETWORK_ERROR',
  STREAM_ABORTED: 'STREAM_ABORTED',
  FUNCTION_ARGS_PARSE_ERROR: 'FUNCTION_ARGS_PARSE_ERROR',
  MISSING_FUNCTION_ARGS: 'MISSING_FUNCTION_ARGS',
  UNKNOWN_FUNCTION: 'UNKNOWN_FUNCTION',
  FUNCTION_EXECUTION_ERROR: 'FUNCTION_EXECUTION_ERROR',
  UNKNOWN_ERROR: 'UNKNOWN_ERROR',
};

export const SocketEvent = {
  STREAM: 'stream',
  FOLLOWUP_STREAM: 'follow-up-stream',
  DONE: 'done',
  LOADING: 'loading',
  LOADING_END: 'loading-end',
  ERROR: 'error',
  OTT_SERVICE_LIST: 'ott-service-list',
  OX_CAROUSEL_BUTTONS: 'ox-carousel-buttons',
  CAROUSEL_BUTTONS: 'carousel-buttons',
  PLAN_LISTS: 'plan-lists',
  TEXT_CARD: 'text-card',
  FIRST_CARD_LIST: 'first-card-list',
};

export const OTTServices = ['넷플릭스', '디즈니+', '티빙', '왓챠'];

export const OXOptions = ['예', '아니오'];
