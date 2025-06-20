import dotenv from 'dotenv';
import mongoose from 'mongoose';
import { BundleCondition } from '../models/BundleCondition.js';
import { BundleBenefit } from '../models/BundleBenefit.js';
import bundleConditionData from './bundle_conditions.json' with { type: 'json' };

// .env 파일 로드
dotenv.config();

// MongoDB 연결 및 데이터 삽입 함수
async function insertBundleConditions() {
  try {
    // MongoDB 연결
    console.log('🔗 MongoDB 연결 중...');
    await mongoose.connect(process.env.MONGO_URI, { dbName: 'meplus' });
    console.log('✅ MongoDB 연결 성공!');

    // 기존 데이터 확인
    const existingBundleConditions = await BundleCondition.countDocuments();
    console.log(`📊 기존 결합조건 수: ${existingBundleConditions}개`);

    // 기존 데이터 삭제 여부 확인
    if (existingBundleConditions > 0) {
      console.log('🗑️ 기존 결합조건 데이터를 삭제합니다...');
      await BundleCondition.deleteMany({});
      console.log('✅ 기존 데이터 삭제 완료!');
    }

    // BundleBenefit 데이터 조회 (이름으로 ObjectId 찾기 위해)
    console.log('🔍 결합혜택 데이터를 조회합니다...');
    const bundleBenefits = await BundleBenefit.find({});
    const bundleBenefitMap = new Map();
    bundleBenefits.forEach((benefit) => {
      bundleBenefitMap.set(benefit.name, benefit._id);
    });
    console.log(`📋 ${bundleBenefits.length}개의 결합혜택을 조회했습니다.`);

    // 데이터 변환 (스키마에 맞게 수정)
    console.log('🔄 데이터를 스키마에 맞게 변환합니다...');
    const transformedData = [];

    for (const condition of bundleConditionData) {
      const bundleBenefitId = bundleBenefitMap.get(condition.bundleBenefit);

      if (!bundleBenefitId) {
        console.warn(
          `⚠️ 결합혜택을 찾을 수 없습니다: ${condition.bundleBenefit}`,
        );
        continue;
      }

      const transformed = {
        count: condition.count,
        discountAmount: condition.discountAmount,
        type: condition.type,
        bundleBenefit: bundleBenefitId,
        // _id 제거 (MongoDB가 자동 생성)
      };
      transformedData.push(transformed);
    }

    console.log(`✅ ${transformedData.length}개의 조건을 변환했습니다.`);

    // 새 데이터 삽입
    console.log('📥 새로운 결합조건 데이터를 삽입합니다...');
    const insertedBundleConditions =
      await BundleCondition.insertMany(transformedData);
    console.log(
      `✅ ${insertedBundleConditions.length}개의 결합조건이 성공적으로 삽입되었습니다!`,
    );

    // 삽입된 데이터 확인 (populate로 결합혜택 이름도 함께 조회)
    console.log('\n📋 삽입된 결합조건 목록:');
    const populatedConditions = await BundleCondition.find({}).populate(
      'bundleBenefit',
    );

    // 결합혜택별로 그룹화해서 표시
    const groupedConditions = new Map();
    populatedConditions.forEach((condition) => {
      const benefitName = condition.bundleBenefit.name;
      if (!groupedConditions.has(benefitName)) {
        groupedConditions.set(benefitName, []);
      }
      groupedConditions.get(benefitName).push(condition);
    });

    groupedConditions.forEach((conditions, benefitName) => {
      console.log(`\n🎯 ${benefitName}:`);
      conditions.forEach((condition, index) => {
        const discount =
          condition.discountAmount > 0
            ? ` → ${condition.discountAmount.toLocaleString()}원 할인`
            : ' → 할인 없음';
        console.log(
          `  ${index + 1}. ${condition.type} ${condition.count}개${discount}`,
        );
      });
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
console.log('🚀 LG유플러스 결합조건 데이터 삽입 스크립트 시작!');
console.log('📁 .env 파일에서 MONGO_URI를 로드합니다...');

if (!process.env.MONGO_URI) {
  console.error('❌ .env 파일에 MONGO_URI가 설정되지 않았습니다!');
  process.exit(1);
}

insertBundleConditions();
