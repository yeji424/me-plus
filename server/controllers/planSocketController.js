import { streamChat, streamChatWithFollowUp } from '../services/gptService.js';
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

export const handlePlanRecommend = async (
  socket,
  { sessionId, message, history },
) => {
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
    console.log('수신메세지', message);
    console.log('대화히스토리', history?.length || 0, '개');

    // 🔧 히스토리가 있으면 사용, 없으면 기본 메시지만 사용
    const plans = '';
    const basicMessages =
      history && history.length > 0
        ? history
        : [{ role: 'user', content: message }];
    console.log('프롬프트메세지', basicMessages.length, '개');
    let messages;
    try {
      messages = buildPromptMessages(plans, basicMessages);
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
      await streamChatWithFollowUp(
        messages,
        socket,
        (chunk) => {
          assistantReply += chunk;
        },
        (funcInfo) => {
          console.log('🔧 Function call detected:', funcInfo);
        },
      );
    } catch (gptError) {
      console.error('❌ GPT streaming error:', gptError);
      return;
    }
  } catch (error) {
    console.error('❌ handlePlanRecommend error:', error);
    socket.emit('error', {
      type: 'CONTROLLER_ERROR',
      message: '요청 처리 중 예상치 못한 오류가 발생했습니다.',
      details: {
        sessionId,
        message: message?.substring(0, 100),
        error: error.message,
      },
    });
  }
};
