/**
 * 테스트 결과 기반 추천 요금제 모델
 * Collection: plan_results
 * Language: JavaScript
 * Template: Mongoose
 */
import mongoose from 'mongoose';

const Schema = mongoose.Schema;
const model = mongoose.model;

export const planResultSchema = new Schema(
  {
    id: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    description: { type: String, required: true },
    priority: { type: Number, required: true },
    dataUsage: { type: Number, required: true },
    callUsage: { type: Number, required: true },
    messageUsage: { type: Number, required: true },
    price: { type: Number, required: true },
    tagLine: { type: String, default: null },
    link: { type: String, required: true },
    isActive: { type: Boolean, default: true }, // 활성화 여부
  },
  { collection: 'plan_results', timestamps: true },
);

export const PlanResult = model('PlanResult', planResultSchema);
