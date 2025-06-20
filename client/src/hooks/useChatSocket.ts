import { useEffect, useRef, useState, useCallback } from 'react';
import { socket } from '@/utils/socket';
import type {
  CarouselItem,
  FunctionCall,
  PlanData,
} from '@/components/chatbot/BotBubbleFrame';

// 서버 에러 타입 정의
export interface ServerError {
  type:
    | 'FUNCTION_ARGS_PARSE_ERROR'
    | 'MISSING_FUNCTION_ARGS'
    | 'UNKNOWN_FUNCTION'
    | 'FUNCTION_EXECUTION_ERROR'
    | 'OPENAI_API_ERROR'
    | 'NETWORK_ERROR'
    | 'STREAM_ABORTED'
    | 'REQUEST_TIMEOUT'
    | 'UNKNOWN_ERROR'
    | 'INVALID_INPUT'
    | 'DATABASE_ERROR'
    | 'PROMPT_BUILD_ERROR'
    | 'SESSION_SAVE_ERROR'
    | 'CONTROLLER_ERROR';
  message: string;
  details?: unknown;
}

// 에러 메시지 매핑
const getErrorMessage = (error: ServerError): string => {
  switch (error.type) {
    case 'OPENAI_API_ERROR':
      return '🤖 AI 서비스가 일시적으로 불안정합니다. 잠시 후 다시 시도해주세요.';
    case 'NETWORK_ERROR':
      return '🌐 네트워크 연결을 확인해주세요.';
    case 'STREAM_ABORTED':
      return '⏹️ 응답이 중단되었습니다. 다시 시도해주세요.';
    case 'REQUEST_TIMEOUT':
      return '⏱️ 응답 시간이 초과되었습니다. 다시 시도해주세요.';
    case 'DATABASE_ERROR':
      return '💾 대화 기록 저장에 문제가 있지만 대화는 계속 가능합니다.';
    case 'SESSION_SAVE_ERROR':
      return '📝 ' + error.message; // 서버에서 친절한 메시지를 보내줌
    case 'FUNCTION_ARGS_PARSE_ERROR':
      return '⚙️ 기능 처리 중 오류가 발생했습니다. 다시 시도해주세요.';
    case 'MISSING_FUNCTION_ARGS':
      return '📋 요청 정보가 불완전합니다. 다시 시도해주세요.';
    case 'UNKNOWN_FUNCTION':
      return '❓ 요청한 기능을 찾을 수 없습니다.';
    case 'INVALID_INPUT':
      return '📝 입력 내용을 확인해주세요.';
    default:
      return '❌ ' + error.message;
  }
};

type Message =
  | { type: 'user'; text: string }
  | { type: 'bot'; messageChunks: string[]; functionCall?: FunctionCall }
  | { type: 'loading'; loadingType: 'searching' | 'waiting' | 'dbcalling' };

export const useChatSocket = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isStreaming, setIsStreaming] = useState(false);
  const [sessionId, setSessionId] = useState<string | null>(null);
  const responseRef = useRef('');

  const handleSessionId = useCallback((id: string) => {
    setSessionId(id);
    localStorage.setItem('sessionId', id);
  }, []);

  const handleSessionHistory = useCallback(
    (logs: { role: string; content: string }[]) => {
      const converted: Message[] = logs.map((msg) =>
        msg.role === 'user'
          ? { type: 'user', text: msg.content }
          : { type: 'bot', messageChunks: [msg.content] },
      );
      setMessages(converted);
    },
    [],
  );

  const handleLoading = useCallback((data: {
      type: 'searching' | 'waiting' | 'dbcalling';
    }) => {
    setMessages((prev) => [
      ...prev,
        {
          type: 'loading',
          loadingType: data.type,
        },
      ]);
    };

    const handleLoadingEnd = () => {
      setMessages((prev) => prev.filter((msg) => msg.type !== 'loading'));
    };

    const handleCarouselButtons = (items: CarouselItem[]) => {
      setMessages((prev) => [
        ...prev.filter((msg) => msg.type !== 'loading'),
      {
        type: 'bot',
        messageChunks: [''],
        functionCall: {
          name: 'requestCarouselButtons',
          args: { items },
        },
      },
    ]);
  }, []);

  const handleOXCarouselButtons = useCallback((data: { options: string[] }) => {
    setMessages((prev) => [
      ...prev.filter((msg) => msg.type !== 'loading'),
      {
        type: 'bot',
        messageChunks: [''],
        functionCall: {
          name: 'requestOXCarouselButtons',
          args: { options: data.options },
        },
      },
    ]);
  }, []);

  const handleOTTServiceList = useCallback(
    (data: { question: string; options: string[] }) => {
      setMessages((prev) => [
        ...prev.filter((msg) => msg.type !== 'loading'),
        {
          type: 'bot',
          messageChunks: [''],
          functionCall: {
            name: 'requestOTTServiceList',
            args: { question: data.question, options: data.options },
          },
        },
      ]);
    },
    [],
  );

  const handlePlanLists = useCallback((plans: PlanData[]) => {
    setMessages((prev) => [
      ...prev.filter((msg) => msg.type !== 'loading'),
      {
        type: 'bot',
        messageChunks: [''],
        functionCall: {
          name: 'showPlanLists',
          args: { plans },
        },
      },
    ]);
  }, []);

  const handleTextCard = useCallback(
    (data: {
      title: string;
      description: string;
      url: string;
      buttonText: string;
      imageUrl?: string;
    }) => {
      setMessages((prev) => [
        ...prev.filter((msg) => msg.type !== 'loading'),
        {
          type: 'bot',
          messageChunks: [''],
          functionCall: {
            name: 'requestTextCard',
            args: {
              title: data.title,
              description: data.description,
              url: data.url,
              buttonText: data.buttonText,
              imageUrl: data.imageUrl,
            },
          },
        },
      ]);
    },
    [],
  );

  // 세션 초기화 및 히스토리 로드
  useEffect(() => {
    const existing = localStorage.getItem('sessionId');
    socket.emit('init-session', existing || null);

    const handleFirstCardList = () => {
      setMessages((prev) => [
        ...prev.filter((msg) => msg.type !== 'loading'),
        {
          type: 'bot',
          messageChunks: [''],
          functionCall: {
            name: 'showFirstCardList',
            args: {},
          },
        },
      ]);
    };

    socket.on('session-id', handleSessionId);
    socket.on('session-history', handleSessionHistory);
    socket.on('loading', handleLoading);
    socket.on('loading-end', handleLoadingEnd);
    socket.on('carousel-buttons', handleCarouselButtons);
    socket.on('ox-carousel-buttons', handleOXCarouselButtons);
    socket.on('ott-service-list', handleOTTServiceList);
    socket.on('plan-lists', handlePlanLists);
    socket.on('text-card', handleTextCard);
    socket.on('first-card-list', handleFirstCardList);

    return () => {
      socket.off('session-id', handleSessionId);
      socket.off('session-history', handleSessionHistory);
      socket.off('loading', handleLoading);
      socket.off('loading-end', handleLoadingEnd);
      socket.off('carousel-buttons', handleCarouselButtons);
      socket.off('ox-carousel-buttons', handleOXCarouselButtons);
      socket.off('ott-service-list', handleOTTServiceList);
      socket.off('plan-lists', handlePlanLists);
      socket.off('text-card', handleTextCard);
      socket.off('first-card-list', handleFirstCardList);
    };
  }, [
    handleSessionId,
    handleSessionHistory,
    handleCarouselButtons,
    handleOXCarouselButtons,
    handleOTTServiceList,
    handlePlanLists,
    handleTextCard,
  ]);

  // 스트리밍 응답 처리
  useEffect(() => {
    const handleStream = (chunk: string) => {
      responseRef.current += chunk;

      // console.log('📥 Stream chunk:', chunk, responseRef.current);
      setMessages((prev) => {
        const last = prev[prev.length - 1];
        if (last?.type === 'bot') {
          return [
            ...prev.slice(0, -1),
            { type: 'bot', messageChunks: [responseRef.current] },
          ];
        } else {
          return [
            ...prev,
            { type: 'bot', messageChunks: [responseRef.current] },
          ];
        }
      });
    };

    const handleDone = () => {
      console.log('✅ Stream completed');
      setIsStreaming(false);
    };

    const handleError = (error: ServerError) => {
      console.error('❌ Server error:', error);

      // 타입별 로그 레벨 조정
      if (error.type === 'SESSION_SAVE_ERROR') {
        console.warn('⚠️ Non-critical error:', error);
      } else if (
        error.type === 'OPENAI_API_ERROR' ||
        error.type === 'NETWORK_ERROR'
      ) {
        console.error('🚨 Critical error:', error);
      }

      setIsStreaming(false);

      const userFriendlyMessage = getErrorMessage(error);

      setMessages((prev) => [
        ...prev,
        {
          type: 'bot',
          messageChunks: [userFriendlyMessage],
        },
      ]);

      // 개발 환경에서만 상세 에러 정보 표시
      if (import.meta.env.DEV && error.details) {
        console.group('🔍 Error Details:');
        console.table(error.details);
        console.groupEnd();
      }
    };

    const handleDisconnect = () => {
      console.warn('⚠️ Socket disconnected');
      setIsStreaming(false);
    };

    socket.on('stream', handleStream);
    socket.on('done', handleDone);
    socket.on('error', handleError);
    socket.on('disconnect', handleDisconnect);

    return () => {
      socket.off('stream', handleStream);
      socket.off('done', handleDone);
      socket.off('error', handleError);
      socket.off('disconnect', handleDisconnect);
    };
  }, []);

  // 메시지 전송
  const sendMessage = (text: string) => {
    if (!text.trim() || !sessionId) return;

    const payload = {
      sessionId,
      message: text.trim(),
    };

    setMessages((prev) => [...prev, { type: 'user', text }]);
    setIsStreaming(true);
    responseRef.current = '';

    socket.emit('recommend-plan', payload);
  };

  // 새 채팅 시작
  const startNewChat = () => {
    if (!sessionId) return;
    socket.emit('reset-session', { sessionId });
    setMessages([]);
    responseRef.current = '';
  };

  return {
    messages,
    isStreaming,
    sessionId,
    sendMessage,
    startNewChat,
  };
};
