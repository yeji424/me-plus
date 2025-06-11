import mongoose from 'mongoose';

const ChatSessionSchema = new mongoose.Schema({
  sessionId: String, // 클라이언트에서 받은 고유 ID
  messages: [
    {
      role: { type: String, enum: ['user', 'assistant', 'system'] },
      content: String,
    },
  ],
  createdAt: { type: Date, default: Date.now },
});

export const ChatSession = mongoose.model('ChatSession', ChatSessionSchema);
