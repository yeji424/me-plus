import dotenv from 'dotenv';
import mongoose from 'mongoose';
import { Plan } from '../models/Plan.js';
import planData from './plans.json' with { type: 'json' };
// .env 파일 로드
dotenv.config();

// MongoDB 연결 및 데이터 삽입 함수
async function insertPlans() {
  try {
    // MongoDB 연결
    console.log('🔗 MongoDB 연결 중...');
    await mongoose.connect(process.env.MONGO_URI, { dbName: 'meplus' });
    console.log('✅ MongoDB 연결 성공!');

    // 기존 데이터 확인
    const existingPlans = await Plan.countDocuments();
    console.log(`📊 기존 요금제 수: ${existingPlans}개`);

    // 기존 데이터 삭제 여부 확인
    if (existingPlans > 0) {
      console.log('🗑️ 기존 요금제 데이터를 삭제합니다...');
      await Plan.deleteMany({});
      console.log('✅ 기존 데이터 삭제 완료!');
    }

    // 데이터 변환 (스키마에 맞게 수정)
    console.log('🔄 데이터를 스키마에 맞게 변환합니다...');
    const transformedData = planData.map((plan) => {
      const transformed = {
        category: plan.category,
        name: plan.name,
        description: plan.description,
        monthlyFee: plan.monthlyFee,
        detailUrl: plan.detailUrl,
        isPopular: plan.isPopular,
        dataGb: plan.dataGb,
        sharedDataGb: plan.sharedDataGb,
        voiceMinutes: plan.voiceMinutes,
        addonVoiceMinutes: plan.addonVoiceMinutes,
        smsCount: plan.smsCount,
        bundleBenefit: plan.bundleBenefit,
        optionalDiscountAmount: plan.optionalDiscountAmount,
        ageGroup: plan.ageGroup,
        mediaAddons: plan.mediaAddons,
        premiumAddons: plan.premiumAddons,
        basicService: plan.basicService,
      };
      return transformed;
    });

    // 새 데이터 삽입
    console.log('📥 새로운 요금제 데이터를 삽입합니다...');
    const insertedPlans = await Plan.insertMany(transformedData);
    console.log(
      `✅ ${insertedPlans.length}개의 요금제가 성공적으로 삽입되었습니다!`,
    );

    // 삽입된 데이터 확인
    console.log('\n📋 삽입된 요금제 목록:');
    insertedPlans.forEach((plan, index) => {
      console.log(
        `${index + 1}. ${plan.name} (${plan.monthlyFee.toLocaleString()}원) ${plan.isPopular ? '⭐' : ''}`,
      );
    });
  } catch (error) {
    console.error('❌ 오류 발생:', error);
  } finally {
    // MongoDB 연결 종료
    await mongoose.disconnect();
    console.log('\n🔌 MongoDB 연결이 종료되었습니다.');
    process.exit(0);
  }
}

// 스크립트 실행
console.log('🚀 LG유플러스 요금제 데이터 삽입 스크립트 시작!');
console.log('📁 .env 파일에서 MONGO_URI를 로드합니다...');

if (!process.env.MONGO_URI) {
  console.error('❌ .env 파일에 MONGO_URI가 설정되지 않았습니다!');
  process.exit(1);
}

insertPlans();
