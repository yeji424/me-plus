/**
 * 챗봇 URL 생성 도구
 * 사용자 정보를 Base64로 인코딩하여 챗봇 페이지 URL을 생성합니다.
 */

// 예제 사용자 프로필 데이터
const exampleUserProfiles = {
  // 5G 프리미어 플러스 사용자
  premiumUser: {
    plan: {
      id: '1',
      name: '5G 프리미어 플러스',
      monthlyFee: 89000,
      benefits: ['무제한 데이터', 'Netflix 베이직', 'YouTube Premium', '5G'],
    },
    usage: {
      call: 150, // 분
      message: 200, // 건
      data: 45, // GB
    },
    preferences: [
      '고용량 데이터가 필요해요',
      '동영상 스트리밍을 자주 해요',
      '5G 속도가 중요해요',
    ],
    source: 'plan-test',
  },

  // 5G 스탠다드 사용자
  standardUser: {
    plan: {
      id: '2',
      name: '5G 스탠다드',
      monthlyFee: 69000,
      benefits: ['월 100GB', '기본 통화', '문자 무제한', '5G'],
    },
    usage: {
      call: 80,
      message: 150,
      data: 25,
    },
    preferences: [
      '적당한 데이터면 충분해요',
      '가격이 중요해요',
      '기본적인 기능만 있으면 돼요',
    ],
    source: 'plan-test',
  },

  // LTE 베이직 사용자
  basicUser: {
    plan: {
      id: '3',
      name: 'LTE 베이직',
      monthlyFee: 49000,
      benefits: ['월 50GB', '기본 통화', '문자 무제한'],
    },
    usage: {
      call: 50,
      message: 100,
      data: 15,
    },
    preferences: [
      '최저가 요금제를 원해요',
      '데이터를 많이 쓰지 않아요',
      '통화와 문자만 주로 써요',
    ],
    source: 'plan-test',
  },
};

/**
 * 사용자 프로필을 Base64로 인코딩하여 URL 생성
 * @param {Object} userProfile - 사용자 프로필 객체
 * @param {string} baseURL - 기본 URL (기본값: http://localhost:5173)
 * @returns {string} 생성된 챗봇 URL
 */
function generateChatbotURL(userProfile, baseURL = 'http://localhost:5173') {
  try {
    // 사용자 프로필을 JSON 문자열로 변환 후 Base64 인코딩
    const profileJSON = JSON.stringify(userProfile);
    const encodedProfile = btoa(unescape(encodeURIComponent(profileJSON)));

    // URL 생성
    const url = `${baseURL}/chatbot?profile=${encodedProfile}`;

    return url;
  } catch (error) {
    console.error('URL 생성 중 오류 발생:', error);
    return null;
  }
}

/**
 * Base64 인코딩된 프로필을 디코딩하여 확인
 * @param {string} encodedProfile - Base64로 인코딩된 프로필
 * @returns {Object|null} 디코딩된 사용자 프로필
 */
function decodeUserProfile(encodedProfile) {
  try {
    const decodedJSON = decodeURIComponent(escape(atob(encodedProfile)));
    return JSON.parse(decodedJSON);
  } catch (error) {
    console.error('프로필 디코딩 중 오류 발생:', error);
    return null;
  }
}

/**
 * 개별 파라미터로 URL 생성 (대안 방법)
 * @param {Object} userProfile - 사용자 프로필 객체
 * @param {string} baseURL - 기본 URL
 * @returns {string} 생성된 챗봇 URL
 */
function generateChatbotURLWithParams(
  userProfile,
  baseURL = 'http://localhost:5173',
) {
  const params = new URLSearchParams();

  params.set('planId', userProfile.plan.id);
  params.set('plan', userProfile.plan.name);
  params.set('fee', userProfile.plan.monthlyFee.toString());
  params.set('benefits', userProfile.plan.benefits.join('|'));
  params.set(
    'usage',
    `${userProfile.usage.call},${userProfile.usage.message},${userProfile.usage.data}`,
  );
  params.set('preferences', userProfile.preferences.join('|'));

  return `${baseURL}/chatbot?${params.toString()}`;
}

// CLI에서 실행될 때의 메인 함수
function main() {
  console.log('=== 챗봇 URL 생성 도구 ===\n');

  // 하나의 예제만 출력 (테스트용)
  const testProfile = exampleUserProfiles.standardUser;
  console.log(`테스트 프로필: ${testProfile.plan.name}`);

  const testURL = generateChatbotURL(testProfile);
  console.log('\n생성된 URL:');
  console.log(testURL);

  // 디코딩 검증
  const profileParam = new URL(testURL).searchParams.get('profile');
  const decoded = decodeUserProfile(profileParam);
  console.log('\n디코딩 검증:');
  console.log(`- 요금제: ${decoded.plan.name}`);
  console.log(`- 월 요금: ${decoded.plan.monthlyFee.toLocaleString()}원`);
  console.log(`- 선호도: ${decoded.preferences.join(', ')}`);

  console.log('\n이 URL을 브라우저에서 열어서 테스트할 수 있습니다!');
}

main();

// 브라우저나 모듈에서 사용할 수 있도록 export
if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    generateChatbotURL,
    generateChatbotURLWithParams,
    decodeUserProfile,
    exampleUserProfiles,
  };
}

// ES6 모듈로도 export
if (typeof window !== 'undefined') {
  window.ChatbotURLGenerator = {
    generateChatbotURL,
    generateChatbotURLWithParams,
    decodeUserProfile,
    exampleUserProfiles,
  };
}
