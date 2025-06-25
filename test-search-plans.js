import dotenv from 'dotenv';
import mongoose from 'mongoose';
import { searchPlansFromDB } from './server/services/gptFuncDefinitions.js';

dotenv.config();

async function testSearchPlans() {
  try {
    // MongoDB 연결
    console.log('🔗 MongoDB 연결 중...');
    await mongoose.connect(process.env.MONGO_URI, { dbName: 'meplus' });
    console.log('✅ MongoDB 연결 성공!');

    // 테스트 케이스들
    const testCases = [
      {
        name: '5G 인기 요금제 3개',
        conditions: {
          category: '5G',
          isPopular: true,
          limit: 3,
        },
      },
      {
        name: '8만원 이하 요금제',
        conditions: {
          maxMonthlyFee: 80000,
          limit: 3,
        },
      },
      {
        name: '청년 대상 요금제',
        conditions: {
          ageGroup: 'YOUTH',
          limit: 3,
        },
      },
      {
        name: '무제한 데이터 요금제',
        conditions: {
          minDataGb: -1,
          limit: 3,
        },
      },
    ];

    // 각 테스트 케이스 실행
    for (const testCase of testCases) {
      console.log(`\n🧪 테스트: ${testCase.name}`);
      console.log('📋 조건:', JSON.stringify(testCase.conditions, null, 2));

      const result = await searchPlansFromDB(testCase.conditions);
      console.log(`✅ 결과: ${result.plans.length}개 요금제 찾음`);

      result.plans.forEach((plan, index) => {
        console.log(
          `  ${index + 1}. ${plan.name} (${plan.monthlyFee.toLocaleString()}원) ${plan.isPopular ? '⭐' : ''}`,
        );
      });
    }
  } catch (error) {
    console.error('❌ 테스트 실패:', error);
  } finally {
    await mongoose.disconnect();
    console.log('\n🔌 MongoDB 연결 종료');
    process.exit(0);
  }
}

testSearchPlans();
