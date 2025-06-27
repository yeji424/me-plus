import { useEffect, useRef, useState, useCallback } from 'react';
import { socket } from '@/utils/socket';
import type {
  CarouselItem,
  FunctionCall,
  PlanData,
} from '@/components/chatbot/BotBubbleFrame';
import {
  getSession,
  saveSession,
  convertToStoredMessage,
  convertFromStoredMessage,
  type ChatSession,
  type StoredMessage,
  type UserProfile,
} from '@/utils/chatStorage';

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
  | {
      type: 'bot';
      messageChunks: string[];
      functionCall?: FunctionCall;
      selectedData?: {
        selectedItem?: CarouselItem;
        selectedServices?: string[];
        isSelected: boolean;
      }; // OTT Service 지원을 위해 확장
    }
  | { type: 'loading'; loadingType: 'searching' | 'waiting' | 'dbcalling' };

export const useChatSocket = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isStreaming, setIsStreaming] = useState(false);
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [isInitialLoading, setIsInitialLoading] = useState(true); // 초기 로딩 상태 추가
  const [storedUserProfile, setStoredUserProfile] =
    useState<UserProfile | null>(null); // 저장된 사용자 프로필
  // 항상 로컬스토리지 사용
  const useLocalStorage = true;
  const responseRef = useRef('');
  const followUpResponseRef = useRef(''); // 역질문 전용 ref
  const hasLoggedSession = useRef(false); // 세션 로그 출력 여부 추적

  // 로컬스토리지에서 메시지 불러오는 함수
  const loadMessagesFromLocal = useCallback(
    (
      sessionIdToLoad: string,
    ): { messages: Message[]; userProfile?: UserProfile } => {
      if (!useLocalStorage) return { messages: [] };

      try {
        const session = getSession(sessionIdToLoad);
        if (!session) return { messages: [] };

        const messages: Message[] = session.messages.map(
          (msg) => convertFromStoredMessage(msg) as Message,
        );

        return {
          messages,
          userProfile: session.userProfile,
        };
      } catch (error) {
        console.error('❌ Failed to load messages from localStorage:', error);
        return { messages: [] };
      }
    },
    [useLocalStorage],
  );

  // 로컬스토리지에 메시지 저장하는 함수 (userProfile도 함께 저장)
  const saveMessagesToLocal = useCallback(
    (messagesArray: Message[], userProfile?: UserProfile | null) => {
      if (!useLocalStorage || !sessionId) return;

      try {
        const storedMessages: StoredMessage[] = messagesArray.map((msg) =>
          convertToStoredMessage(msg as Omit<StoredMessage, 'timestamp'>),
        );

        const chatSession: ChatSession = {
          sessionId,
          messages: storedMessages,
          userProfile: userProfile || storedUserProfile || undefined,
          lastUpdated: Date.now(),
        };

        saveSession(chatSession);
      } catch (error) {
        console.error('❌ Failed to save messages to localStorage:', error);
      }
    },
    [useLocalStorage, sessionId, storedUserProfile],
  );

  const handleSessionId = useCallback(
    (id: string) => {
      setSessionId(id);
      localStorage.setItem('sessionId', id);

      // 로컬스토리지 사용 시 기존 세션 불러오기
      if (useLocalStorage) {
        const { messages: localMessages, userProfile } =
          loadMessagesFromLocal(id);

        if (localMessages.length > 0) {
          setMessages(localMessages);
          // userProfile이 있을 때만 설정, 없으면 기존 storedUserProfile 유지
          if (userProfile) {
            setStoredUserProfile(userProfile);
          }
          if (!hasLoggedSession.current) {
            hasLoggedSession.current = true;
          }
        } else {
          // 메시지가 없어도 userProfile이 있으면 설정
          if (userProfile) {
            setStoredUserProfile(userProfile);
          }
          if (!hasLoggedSession.current) {
            hasLoggedSession.current = true;
          }
        }
      }

      // 로딩 완료
      setIsInitialLoading(false);
    },
    [useLocalStorage, loadMessagesFromLocal],
  );

  const handleSessionHistory = useCallback(
    (
      logs: { role: string; content: string; type?: string; data?: unknown }[],
    ) => {
      // 로컬스토리지 사용 시에는 서버 히스토리 무시
      if (useLocalStorage) {
        return;
      }

      // 서버 히스토리가 비어있으면 처리하지 않음
      if (!logs || logs.length === 0) {
        return;
      }

      const converted: Message[] = logs.map((msg) => {
        // 캐러셀 선택 등 특별한 타입 처리
        if (
          msg.type === 'carousel_select' ||
          msg.type === 'ox_select' ||
          msg.type === 'ott_select'
        ) {
          return { type: 'user', text: msg.content };
        }

        // 새로 추가: function_call 타입 처리
        if (msg.type === 'function_call' && msg.role === 'assistant') {
          // data에서 function call 정보 추출
          const functionCallData = msg.data as {
            name?: string;
            args?: unknown;
            selectedItem?: CarouselItem;
            selectedServices?: string[];
            isSelected?: boolean;
          };

          if (functionCallData?.name && functionCallData?.args) {
            const botMessage: Message = {
              type: 'bot',
              messageChunks: [msg.content],
              functionCall: {
                name: functionCallData.name as FunctionCall['name'],
                args: functionCallData.args as FunctionCall['args'],
              },
            };

            // 선택 데이터가 있으면 추가 (OTT와 캐러셀 모두 지원)
            if (functionCallData.isSelected) {
              botMessage.selectedData = {
                selectedItem: functionCallData.selectedItem,
                selectedServices: functionCallData.selectedServices,
                isSelected: functionCallData.isSelected,
              };
            }

            return botMessage;
          }
        }

        // 기본 처리
        return msg.role === 'user'
          ? { type: 'user', text: msg.content }
          : { type: 'bot', messageChunks: [msg.content] };
      });
      setMessages(converted);
    },
    [useLocalStorage],
  );

  const handleLoading = useCallback(
    (data: { type: 'searching' | 'waiting' | 'dbcalling' }) => {
      setMessages((prev) => [
        ...prev,
        {
          type: 'loading',
          loadingType: data.type,
        },
      ]);
    },
    [],
  );

  const handleLoadingEnd = useCallback(() => {
    setMessages((prev) => prev.filter((msg) => msg.type !== 'loading'));
  }, []);

  const handleCarouselButtons = useCallback((items: CarouselItem[]) => {
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
    handleLoading,
    handleLoadingEnd,
  ]);

  // 스트리밍 응답 처리
  useEffect(() => {
    const handleStream = (chunk: string) => {
      responseRef.current += chunk;

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

    // 역질문 전용 스트림 핸들러
    const handleFollowUpStream = (chunk: string) => {
      followUpResponseRef.current += chunk;

      setMessages((prev) => {
        // 첫 번째 청크인 경우 새 메시지 추가, 그 외는 마지막 메시지 업데이트
        if (chunk === followUpResponseRef.current) {
          // 첫 번째 청크 - 새 메시지 추가
          return [
            ...prev,
            { type: 'bot', messageChunks: [followUpResponseRef.current] },
          ];
        } else {
          // 후속 청크 - 마지막 메시지 업데이트
          return [
            ...prev.slice(0, -1),
            { type: 'bot', messageChunks: [followUpResponseRef.current] },
          ];
        }
      });
    };

    const handleDone = () => {
      console.log('✅ Stream completed');
      setIsStreaming(false);
      followUpResponseRef.current = ''; // 역질문 완료 시 리셋
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
    socket.on('follow-up-stream', handleFollowUpStream);
    socket.on('done', handleDone);
    socket.on('error', handleError);
    socket.on('disconnect', handleDisconnect);

    return () => {
      socket.off('stream', handleStream);
      socket.off('follow-up-stream', handleFollowUpStream);
      socket.off('done', handleDone);
      socket.off('error', handleError);
      socket.off('disconnect', handleDisconnect);
    };
  }, []);

  // 메시지 전송
  const sendMessage = useCallback(
    (text: string) => {
      if (!text.trim() || !sessionId) return;

      // 🔧 현재 메시지를 추가한 전체 대화 히스토리 생성
      const newUserMessage: Message = { type: 'user', text: text.trim() };
      const allMessages = [...messages, newUserMessage];

      // 🔧 GPT 형식으로 변환 (user/assistant 역할)
      const chatHistory = allMessages
        .map((msg) => {
          if (msg.type === 'user') {
            return { role: 'user', content: msg.text };
          } else if (msg.type === 'bot' && 'messageChunks' in msg) {
            const content = msg.messageChunks.join('');
            // 빈 문자열인 메시지는 제외 (function call만 있는 메시지들)
            if (content.trim() === '') {
              // function call 정보를 간단히 포함 (환각 방지용 중립적 표현)
              return {
                role: 'developer',
                content: `사용자 ${msg.functionCall?.name} 기능을 실행했습니다.`,
              };
            }
            return { role: 'developer', content };
          }
          return null;
        })
        .filter(Boolean);

      const payload = {
        sessionId,
        message: text.trim(),
        history: chatHistory, // 🔧 전체 대화 히스토리 추가
      };
      setMessages((prev) => [...prev, newUserMessage] as Message[]);
      setIsStreaming(true);
      responseRef.current = '';

      socket.emit('chat', payload);
    },
    [sessionId, messages], // 🔧 messages 의존성 추가
  );

  // 로컬 상태에서만 선택 상태 업데이트 (서버에 보내지 않음)
  const updateCarouselSelection = useCallback(
    (messageIndex: number, selectedItem: CarouselItem) => {
      // 로컬 상태만 업데이트
      setMessages((prev) =>
        prev.map((msg, idx) => {
          if (idx === messageIndex && msg.type === 'bot') {
            return {
              ...msg,
              selectedData: { selectedItem, isSelected: true },
            };
          }
          return msg;
        }),
      );
    },
    [],
  );

  // 로컬 상태에서만 OTT 선택 상태 업데이트 (서버에 보내지 않음)
  const updateOttSelection = useCallback(
    (messageIndex: number, selectedServices: string[]) => {
      // 로컬 상태만 업데이트
      setMessages((prev) =>
        prev.map((msg, idx) => {
          if (idx === messageIndex && msg.type === 'bot') {
            return {
              ...msg,
              selectedData: {
                selectedServices,
                isSelected: selectedServices.length > 0,
              },
            };
          }
          return msg;
        }),
      );
    },
    [],
  );

  // 로컬 상태에서만 OX 선택 상태 업데이트 (서버에 보내지 않음)
  const updateOxSelection = useCallback(
    (messageIndex: number, selectedOption: string) => {
      // 로컬 상태만 업데이트
      setMessages((prev) =>
        prev.map((msg, idx) => {
          if (idx === messageIndex && msg.type === 'bot') {
            return {
              ...msg,
              selectedData: { selectedOption, isSelected: true },
            };
          }
          return msg;
        }),
      );
    },
    [],
  );

  // 메시지가 변경될 때마다 로컬스토리지에 저장
  useEffect(() => {
    if (useLocalStorage && messages.length > 0) {
      saveMessagesToLocal(messages, storedUserProfile);
    }
  }, [messages, useLocalStorage, saveMessagesToLocal, storedUserProfile]);

  // 제거: 항상 로컬스토리지 사용으로 토글 불필요

  // 새 채팅 시작
  const startNewChat = useCallback(() => {
    if (!sessionId) return;
    socket.emit('reset-session', { sessionId });
    setMessages([]);
    responseRef.current = '';
    hasLoggedSession.current = false; // 새 채팅 시작 시 로그 플래그 리셋
    setStoredUserProfile(null); // 새 채팅 시작 시 사용자 프로필도 리셋
  }, [sessionId]);

  // userProfile 설정 함수 (ChatbotPage에서 사용)
  const setUserProfile = useCallback((userProfile: UserProfile | null) => {
    setStoredUserProfile(userProfile);
  }, []);

  return {
    messages,
    isStreaming,
    sessionId,
    isInitialLoading,
    storedUserProfile, // 복원된 사용자 프로필
    sendMessage,
    updateCarouselSelection,
    updateOttSelection,
    updateOxSelection,
    startNewChat,
    setUserProfile, // 사용자 프로필 설정 함수
  };
};
