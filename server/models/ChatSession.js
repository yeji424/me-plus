import mongoose from 'mongoose';

const ChatSessionSchema = new mongoose.Schema({
  sessionId: String, // 클라이언트에서 받은 고유 ID
  messages: [
    {
      role: { type: String, enum: ['user', 'assistant', 'system'] },
      content: String,
      type: { type: String, default: 'text' }, // 추가: 메시지 타입 (text, carousel_select, ox_select 등)
      data: { type: mongoose.Schema.Types.Mixed, default: null }, // 추가: 선택 데이터
      createdAt: { type: Date, default: Date.now }, // 추가: 각 메시지별 타임스탬프
    },
  ],
  createdAt: { type: Date, default: Date.now },
});

export const ChatSession = mongoose.model('ChatSession', ChatSessionSchema);
