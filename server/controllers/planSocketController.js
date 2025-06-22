import { getPlansWithCache } from '../cache/planCache.js';
import { ChatSession } from '../models/ChatSession.js';
import { streamChat } from '../services/gptService.js';
import { buildPromptMessages } from '../utils/promptBuilder.js';

export const handleCarouselSelection = async (
  socket,
  { sessionId, carouselData, selectedItem, isSelected },
) => {
  try {
    console.log('📝 Saving carousel selection:', {
      sessionId,
      carouselData,
      selectedItem,
      isSelected,
    });

    if (!sessionId) {
      socket.emit('error', {
        type: 'INVALID_INPUT',
        message: 'sessionId가 필요합니다.',
        details: { sessionId },
      });
      return;
    }

    let session;
    try {
      session = await ChatSession.findOne({ sessionId });
      if (!session) {
        console.error('❌ Session not found:', sessionId);
        return;
      }
    } catch (dbError) {
      console.error('❌ Database error:', dbError);
      socket.emit('error', {
        type: 'DATABASE_ERROR',
        message: '세션 데이터 처리 중 오류가 발생했습니다.',
        details: { sessionId, error: dbError.message },
      });
      return;
    }

    // 캐러셀 선택 메시지 저장
    const selectionMessage = {
      role: 'user',
      content: isSelected
        ? `캐러셀에서 '${selectedItem?.label || selectedItem}' 선택`
        : '캐러셀에서 선택하지 않음',
      type: 'carousel_select',
      data: {
        carouselItems: carouselData, // 전체 캐러셀 데이터
        selectedItem: selectedItem, // 선택한 항목
        isSelected: isSelected, // 선택 여부
      },
      createdAt: new Date(),
    };

    try {
      session.messages.push(selectionMessage);
      session.markModified('messages');
      await session.save();
      console.log('✅ Carousel selection saved successfully:', sessionId);
    } catch (saveError) {
      console.error('❌ Carousel selection save error:', saveError);
      socket.emit('error', {
        type: 'SESSION_SAVE_ERROR',
        message: '선택 내역 저장 중 오류가 발생했습니다.',
        details: { sessionId, error: saveError.message },
      });
    }
  } catch (error) {
    console.error('❌ handleCarouselSelection error:', error);
    socket.emit('error', {
      type: 'CONTROLLER_ERROR',
      message: '선택 내역 처리 중 예상치 못한 오류가 발생했습니다.',
      details: { sessionId, error: error.message },
    });
  }
};

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
    let functionCallInfo = null; // 새로 추가: function call 정보 저장

    // GPT 스트리밍 호출
    try {
      await streamChat(
        messages,
        socket,
        (chunk) => {
          assistantReply += chunk;
        },
        (funcInfo) => {
          // 새로 추가: function call 정보 수집
          functionCallInfo = funcInfo;
          console.log('🔧 Function call detected:', funcInfo);
        },
      );
    } catch (gptError) {
      console.error('❌ GPT streaming error:', gptError);
      // streamChat에서 이미 error를 emit하므로 여기서는 로그만
      return;
    }

    // 세션 저장
    try {
      session.messages.push(newUserMsg);

      // assistant 메시지 저장 (function call 정보 포함)
      const assistantMessage = {
        role: 'assistant',
        content: assistantReply,
        type: functionCallInfo ? 'function_call' : 'text', // 새로 추가
        data: functionCallInfo ? functionCallInfo : null, // 새로 추가
      };

      session.messages.push(assistantMessage);
      session.markModified('messages');
      await session.save();
      console.log('✅ Session saved successfully:', sessionId);

      // 로그 추가 (안전하게)
      if (functionCallInfo) {
        console.log('🔧 Function call saved to DB:', functionCallInfo);
      }
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

// 새로 추가: 캐러셀 선택 상태 업데이트 함수
export const handleUpdateCarouselSelection = async (
  socket,
  { sessionId, messageIndex, selectedItem },
) => {
  try {
    console.log('🔄 Updating carousel selection:', {
      sessionId,
      messageIndex,
      selectedItem,
    });

    if (!sessionId || messageIndex === undefined) {
      socket.emit('error', {
        type: 'INVALID_INPUT',
        message: 'sessionId와 messageIndex가 필요합니다.',
        details: { sessionId, messageIndex },
      });
      return;
    }

    let session;
    try {
      session = await ChatSession.findOne({ sessionId });
      if (!session) {
        console.error('❌ Session not found:', sessionId);
        return;
      }
    } catch (dbError) {
      console.error('❌ Database error:', dbError);
      socket.emit('error', {
        type: 'DATABASE_ERROR',
        message: '세션 데이터 처리 중 오류가 발생했습니다.',
        details: { sessionId, error: dbError.message },
      });
      return;
    }

    // 해당 메시지 찾기
    const targetMessage = session.messages[messageIndex];
    if (!targetMessage) {
      console.error('❌ Message not found:', {
        messageIndex,
        totalMessages: session.messages.length,
      });
      socket.emit('error', {
        type: 'INVALID_INPUT',
        message: '해당 인덱스의 메시지를 찾을 수 없습니다.',
        details: { messageIndex, totalMessages: session.messages.length },
      });
      return;
    }

    if (targetMessage.role !== 'assistant') {
      console.error('❌ Not an assistant message:', {
        messageIndex,
        role: targetMessage.role,
      });
      socket.emit('error', {
        type: 'INVALID_INPUT',
        message: 'assistant 메시지가 아닙니다.',
        details: { messageIndex, role: targetMessage.role },
      });
      return;
    }

    if (targetMessage.type !== 'function_call') {
      console.error('❌ Not a function_call message:', {
        messageIndex,
        type: targetMessage.type,
      });
      socket.emit('error', {
        type: 'INVALID_INPUT',
        message: 'function_call 메시지가 아닙니다.',
        details: { messageIndex, type: targetMessage.type },
      });
      return;
    }

    if (
      !targetMessage.data ||
      targetMessage.data.name !== 'requestCarouselButtons'
    ) {
      console.error('❌ Not a carousel function_call:', {
        messageIndex,
        data: targetMessage.data,
      });
      socket.emit('error', {
        type: 'INVALID_INPUT',
        message: '캐러셀 function_call이 아닙니다.',
        details: { messageIndex, data: targetMessage.data },
      });
      return;
    }

    // data 필드 업데이트 (안전하게)
    if (!targetMessage.data) {
      targetMessage.data = {};
    }

    targetMessage.data.selectedItem = selectedItem;
    targetMessage.data.isSelected = true;
    targetMessage.data.updatedAt = new Date();

    try {
      session.markModified('messages');
      await session.save();
      console.log('✅ Carousel selection updated successfully:', sessionId);

      // 클라이언트에 업데이트 완료 알림
      socket.emit('carousel-selection-updated', {
        messageIndex,
        selectedItem,
        isSelected: true,
      });
    } catch (saveError) {
      console.error('❌ Carousel selection update error:', saveError);
      socket.emit('error', {
        type: 'SESSION_SAVE_ERROR',
        message: '선택 상태 업데이트 중 오류가 발생했습니다.',
        details: { sessionId, error: saveError.message },
      });
    }
  } catch (error) {
    console.error('❌ handleUpdateCarouselSelection error:', error);
    socket.emit('error', {
      type: 'CONTROLLER_ERROR',
      message: '선택 상태 업데이트 중 예상치 못한 오류가 발생했습니다.',
      details: { sessionId, error: error.message },
    });
  }
};
