// 로컬스토리지에 채팅 메시지를 저장하고 불러오는 유틸리티
import type {
  CarouselItem,
  FunctionCall,
} from '@/components/chatbot/BotBubbleFrame';

export interface StoredMessage {
  type: 'user' | 'bot' | 'loading';
  text?: string;
  messageChunks?: string[];
  functionCall?: FunctionCall;
  selectedData?: {
    selectedItem?: CarouselItem;
    selectedServices?: string[];
    selectedOption?: string; // OX 버튼 선택된 옵션
    isSelected: boolean;
  };
  loadingType?: 'searching' | 'waiting' | 'dbcalling';
  timestamp: number;
}

export interface ChatSession {
  sessionId: string;
  messages: StoredMessage[];
  lastUpdated: number;
}

const STORAGE_KEY = 'me-plus-chat-sessions';
const MAX_SESSIONS = 10; // 최대 세션 수 제한

// 로컬스토리지에서 모든 세션 가져오기
export const getAllSessions = (): ChatSession[] => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch (error) {
    console.error('❌ 세션 로드 실패:', error);
    return [];
  }
};

// 특정 세션 가져오기
export const getSession = (sessionId: string): ChatSession | null => {
  const sessions = getAllSessions();
  return sessions.find((s) => s.sessionId === sessionId) || null;
};

// 세션 저장하기
export const saveSession = (session: ChatSession): void => {
  try {
    let sessions = getAllSessions();

    // 기존 세션 찾기
    const existingIndex = sessions.findIndex(
      (s) => s.sessionId === session.sessionId,
    );

    if (existingIndex >= 0) {
      // 기존 세션 업데이트
      sessions[existingIndex] = { ...session, lastUpdated: Date.now() };
    } else {
      // 새 세션 추가
      sessions.unshift({ ...session, lastUpdated: Date.now() });

      // 최대 세션 수 제한
      if (sessions.length > MAX_SESSIONS) {
        sessions = sessions.slice(0, MAX_SESSIONS);
      }
    }

    localStorage.setItem(STORAGE_KEY, JSON.stringify(sessions));
  } catch (error) {
    console.error('❌ 세션 저장 실패:', error);
  }
};

// 세션 삭제하기
export const deleteSession = (sessionId: string): void => {
  try {
    const sessions = getAllSessions();
    const filtered = sessions.filter((s) => s.sessionId !== sessionId);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered));
    console.log('✅ 세션 삭제 완료:', sessionId);
  } catch (error) {
    console.error('❌ 세션 삭제 실패:', error);
  }
};

// 모든 세션 삭제하기
export const clearAllSessions = (): void => {
  try {
    localStorage.removeItem(STORAGE_KEY);
    console.log('✅ 모든 세션 삭제 완료');
  } catch (error) {
    console.error('❌ 세션 삭제 실패:', error);
  }
};

// 메시지를 StoredMessage 형태로 변환
export const convertToStoredMessage = (
  message: Omit<StoredMessage, 'timestamp'>,
): StoredMessage => {
  return {
    ...message,
    timestamp: Date.now(),
  };
};

// StoredMessage를 일반 Message 형태로 변환
export const convertFromStoredMessage = (
  stored: StoredMessage,
): Omit<StoredMessage, 'timestamp'> => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { timestamp, ...message } = stored;
  return message;
};
