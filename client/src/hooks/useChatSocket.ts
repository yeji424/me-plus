import { useEffect, useRef, useState } from 'react';
import { socket } from '@/utils/socket';
import type {
  CarouselItem,
  FunctionCall,
  PlanData,
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
          messageChunks: [''],
          functionCall: {
            name: 'requestCarouselButtons',
            args: { items },
          },
        },
      ]);
    };

    const handleOXCarouselButtons = (data: { options: string[] }) => {
      setMessages((prev) => [
        ...prev,
        {
          type: 'bot',
          messageChunks: [''],
          functionCall: {
            name: 'requestOXCarouselButtons',
            args: { options: data.options },
          },
        },
      ]);
    };

    const handleOTTServiceList = (data: {
      question: string;
      options: string[];
    }) => {
      setMessages((prev) => [
        ...prev,
        {
          type: 'bot',
          messageChunks: [''],
          functionCall: {
            name: 'requestOTTServiceList',
            args: { question: data.question, options: data.options },
          },
        },
      ]);
    };

    const handlePlanLists = (plan: PlanData) => {
      setMessages((prev) => [
        ...prev,
        {
          type: 'bot',
          messageChunks: [''],
          functionCall: {
            name: 'showPlanLists',
            args: { plan },
          },
        },
      ]);
    };

    const handleTextButtons = (data: {
      question: string;
      options: string[];
    }) => {
      setMessages((prev) => [
        ...prev,
        {
          type: 'bot',
          messageChunks: [''],
          functionCall: {
            name: 'requestTextButtons',
            args: { question: data.question, options: data.options },
          },
        },
      ]);
    };

    socket.on('session-id', handleSessionId);
    socket.on('session-history', handleSessionHistory);
    socket.on('carousel-buttons', handleCarouselButtons);
    socket.on('ox-carousel-buttons', handleOXCarouselButtons);
    socket.on('ott-service-list', handleOTTServiceList);
    socket.on('plan-lists', handlePlanLists);
    socket.on('text-buttons', handleTextButtons);

    return () => {
      socket.off('session-id', handleSessionId);
      socket.off('session-history', handleSessionHistory);
      socket.off('carousel-buttons', handleCarouselButtons);
      socket.off('ox-carousel-buttons', handleOXCarouselButtons);
      socket.off('ott-service-list', handleOTTServiceList);
      socket.off('plan-lists', handlePlanLists);
      socket.off('text-buttons', handleTextButtons);
    };
  }, []);

  // 스트리밍 응답 처리
  useEffect(() => {
    const handleStream = (chunk: string) => {
      responseRef.current += chunk;

      console.log('📥 Stream chunk:', chunk, responseRef.current);
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

    const handleError = (error: any) => {
      console.error('❌ Socket error:', error);
      setIsStreaming(false);
      setMessages((prev) => [
        ...prev,
        {
          type: 'bot',
          messageChunks: [
            '죄송합니다. 연결에 문제가 발생했습니다. 다시 시도해 주세요.',
          ],
        },
      ]);
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
