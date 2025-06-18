import { useEffect, useRef, useState } from 'react';
import { socket } from '@/utils/socket';
import type {
  CarouselItem,
  FunctionCall,
} from '@/components/chatbot/BotBubbleFrame';

type Message =
  | { type: 'user'; text: string }
  | { type: 'bot'; messageChunks: string[]; functionCall?: FunctionCall };

export const useChatSocket = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isStreaming, setIsStreaming] = useState(false);
  const [sessionId, setSessionId] = useState<string | null>(null);
  const responseRef = useRef('');

  // 세션 초기화 및 히스토리 로드
  useEffect(() => {
    const existing = localStorage.getItem('sessionId');
    socket.emit('init-session', existing || null);

    const handleSessionId = (id: string) => {
      setSessionId(id);
      localStorage.setItem('sessionId', id);
    };

    const handleSessionHistory = (
      logs: { role: string; content: string }[],
    ) => {
      const converted: Message[] = logs.map((msg) =>
        msg.role === 'user'
          ? { type: 'user', text: msg.content }
          : { type: 'bot', messageChunks: [msg.content] },
      );
      setMessages(converted);
    };

    const handleCarouselButtons = (items: CarouselItem[]) => {
      setMessages((prev) => [
        ...prev,
        {
          type: 'bot',
          messageChunks: ['다음 항목 중 하나를 선택해주세요:'],
          functionCall: {
            name: 'requestCarouselButtons',
            args: { items },
          },
        },
      ]);
    };

    socket.on('session-id', handleSessionId);
    socket.on('session-history', handleSessionHistory);
    socket.on('carousel-buttons', handleCarouselButtons);

    return () => {
      socket.off('session-id', handleSessionId);
      socket.off('session-history', handleSessionHistory);
      socket.off('carousel-buttons', handleCarouselButtons);
    };
  }, []);

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

    const handleDone = () => {
      setIsStreaming(false);
    };

    socket.on('stream', handleStream);
    socket.on('done', handleDone);

    return () => {
      socket.off('stream', handleStream);
      socket.off('done', handleDone);
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
