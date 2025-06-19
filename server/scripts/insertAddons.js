import dotenv from 'dotenv';
import mongoose from 'mongoose';
import { Addon } from '../models/Addon.js';
import addonData from './addons.json' with { type: 'json' };

// .env 파일 로드
dotenv.config();

// MongoDB 연결 및 데이터 삽입 함수
async function insertAddons() {
  try {
    // MongoDB 연결
    console.log('🔗 MongoDB 연결 중...');
    await mongoose.connect(process.env.MONGO_URI, { dbName: 'meplus' });
    console.log('✅ MongoDB 연결 성공!');

    // 기존 데이터 확인
    const existingAddons = await Addon.countDocuments();
    console.log(`📊 기존 애드온 수: ${existingAddons}개`);

    // 기존 데이터 삭제 여부 확인
    if (existingAddons > 0) {
      console.log('🗑️ 기존 애드온 데이터를 삭제합니다...');
      await Addon.deleteMany({});
      console.log('✅ 기존 데이터 삭제 완료!');
    }

    // 데이터 변환 (스키마에 맞게 수정)
    console.log('🔄 데이터를 스키마에 맞게 변환합니다...');
    const transformedData = addonData.map((addon) => {
      const transformed = {
        category: addon.category,
        name: addon.name,
        description: addon.description,
        detailUrl: addon.detailUrl,
        // _id 제거 (MongoDB가 자동 생성)
      };
      return transformed;
    });

    // 새 데이터 삽입
    console.log('📥 새로운 애드온 데이터를 삽입합니다...');
    const insertedAddons = await Addon.insertMany(transformedData);
    console.log(
      `✅ ${insertedAddons.length}개의 애드온이 성공적으로 삽입되었습니다!`,
    );

    // 삽입된 데이터 확인 (카테고리별로 그룹화)
    console.log('\n📋 삽입된 애드온 목록 (카테고리별):');
    const categories = ['MEDIA', 'PREMIUM', 'BASIC'];

    for (const category of categories) {
      const categoryAddons = insertedAddons.filter(
        (addon) => addon.category === category,
      );
      if (categoryAddons.length > 0) {
        console.log(`\n🎯 ${category} (${categoryAddons.length}개):`);
        categoryAddons.forEach((addon, index) => {
          console.log(`  ${index + 1}. ${addon.name}`);
        });
      }
    }
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
console.log('🚀 LG유플러스 애드온 데이터 삽입 스크립트 시작!');
console.log('📁 .env 파일에서 MONGO_URI를 로드합니다...');

if (!process.env.MONGO_URI) {
  console.error('❌ .env 파일에 MONGO_URI가 설정되지 않았습니다!');
  process.exit(1);
}

insertAddons();
