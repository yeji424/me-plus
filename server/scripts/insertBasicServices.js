import dotenv from 'dotenv';
import mongoose from 'mongoose';
import { BasicService } from '../models/BasicService.js';
import basicServiceData from './basic_services.json' with { type: 'json' };

// .env 파일 로드
dotenv.config();

// MongoDB 연결 및 데이터 삽입 함수
async function insertBasicServices() {
  try {
    // MongoDB 연결
    console.log('🔗 MongoDB 연결 중...');
    await mongoose.connect(process.env.MONGO_URI, { dbName: 'meplus' });
    console.log('✅ MongoDB 연결 성공!');

    // 기존 데이터 확인
    const existingBasicServices = await BasicService.countDocuments();
    console.log(`📊 기존 기본서비스 수: ${existingBasicServices}개`);

    // 기존 데이터 삭제 여부 확인
    if (existingBasicServices > 0) {
      console.log('🗑️ 기존 기본서비스 데이터를 삭제합니다...');
      await BasicService.deleteMany({});
      console.log('✅ 기존 데이터 삭제 완료!');
    }

    // 데이터 변환 (스키마에 맞게 수정)
    console.log('🔄 데이터를 스키마에 맞게 변환합니다...');
    const transformedData = basicServiceData.map((service) => {
      const transformed = {
        name: service.name,
        description: service.description,
        // _id 제거 (MongoDB가 자동 생성)
      };
      return transformed;
    });

    // 새 데이터 삽입
    console.log('📥 새로운 기본서비스 데이터를 삽입합니다...');
    const insertedBasicServices =
      await BasicService.insertMany(transformedData);
    console.log(
      `✅ ${insertedBasicServices.length}개의 기본서비스가 성공적으로 삽입되었습니다!`,
    );

    // 삽입된 데이터 확인
    console.log('\n📋 삽입된 기본서비스 목록:');
    insertedBasicServices.forEach((service, index) => {
      console.log(`${index + 1}. ${service.name}`);
      // 설명이 길어서 첫 줄만 표시
      const firstLine = service.description?.split('\n')[0] || '';
      if (firstLine) {
        console.log(
          `   💡 ${firstLine.substring(0, 80)}${firstLine.length > 80 ? '...' : ''}`,
        );
      }
      console.log(''); // 빈 줄 추가
    });
  } catch (error) {
    console.error('❌ 오류 발생:', error);
  } finally {
    // MongoDB 연결 종료
    await mongoose.disconnect();
    console.log('🔌 MongoDB 연결이 종료되었습니다.');
    process.exit(0);
  }
}

// 스크립트 실행
console.log('🚀 LG유플러스 기본서비스 데이터 삽입 스크립트 시작!');
console.log('📁 .env 파일에서 MONGO_URI를 로드합니다...');

if (!process.env.MONGO_URI) {
  console.error('❌ .env 파일에 MONGO_URI가 설정되지 않았습니다!');
  process.exit(1);
}

insertBasicServices();
