import { getPlansWithCache } from '../cache/planCache.js';
import { ChatSession } from '../models/ChatSession.js';
import { streamChat } from '../services/gptService.js';
import { buildPromptMessages } from '../utils/promptBuilder.js';

export const handlePlanRecommend = async (socket, { sessionId, message }) => {
  try {
    // 입력 검증
    if (!sessionId || !message) {
      socket.emit('error', {
        type: 'INVALID_INPUT',
        message: 'sessionId와 message가 필요합니다.',
        details: { sessionId, message },
      });
      return;
    }

    let session;
    try {
      session = await ChatSession.findOne({ sessionId });

      if (!session) {
        session = await ChatSession.create({ sessionId, messages: [] });
        console.log('✅ New session created:', sessionId);
      }
    } catch (dbError) {
      console.error('❌ Database error:', dbError);
      socket.emit('error', {
        type: 'DATABASE_ERROR',
        message: '세션 데이터 처리 중 오류가 발생했습니다.',
        details: {
          sessionId,
          error: dbError.message,
        },
      });
      return;
    }

    // const plans = await getPlansWithCache();
    const plans = '';
    const newUserMsg = { role: 'user', content: message };
    const fullMessages = [...session.messages, newUserMsg];

    let messages;
    try {
      messages = buildPromptMessages(plans, fullMessages);
    } catch (promptError) {
      console.error('❌ Prompt building error:', promptError);
      socket.emit('error', {
        type: 'PROMPT_BUILD_ERROR',
        message: '프롬프트 생성 중 오류가 발생했습니다.',
        details: {
          sessionId,
          error: promptError.message,
        },
      });
      return;
    }

    let assistantReply = '';

    // GPT 스트리밍 호출
    try {
      await streamChat(messages, socket, (chunk) => {
        assistantReply += chunk;
      });
    } catch (gptError) {
      console.error('❌ GPT streaming error:', gptError);
      // streamChat에서 이미 error를 emit하므로 여기서는 로그만
      return;
    }

    // 세션 저장
    try {
      session.messages.push(newUserMsg);
      session.messages.push({ role: 'assistant', content: assistantReply });
      session.markModified('messages');
      await session.save();
      console.log('✅ Session saved successfully:', sessionId);
    } catch (saveError) {
      console.error('❌ Session save error:', saveError);
      socket.emit('error', {
        type: 'SESSION_SAVE_ERROR',
        message:
          '대화 저장 중 오류가 발생했습니다. 대화는 계속 가능하지만 기록이 저장되지 않을 수 있습니다.',
        details: {
          sessionId,
          error: saveError.message,
        },
      });
      // 저장 실패해도 대화는 계속 진행
    }
  } catch (error) {
    console.error('❌ handlePlanRecommend error:', error);
    socket.emit('error', {
      type: 'CONTROLLER_ERROR',
      message: '요청 처리 중 예상치 못한 오류가 발생했습니다.',
      details: {
        sessionId,
        message: message?.substring(0, 100), // 메시지는 100자만 로그
        error: error.message,
      },
    });
  }
};
