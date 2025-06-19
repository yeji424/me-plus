import { useEffect, useRef, useState } from 'react';
import Header from '@/components/common/Header';
import NewChatIcon from '@/assets/icon/new_chat_icon.svg?react';
import CallIcon from '@/assets/icon/call_icon.svg?react';
import UserBubble from '@/components/chatbot/UserBubble';
import BotBubble from '@/components/chatbot/BotBubble';
import InputBox from '@/components/chatbot/InputBox';
import { socket } from '@/utils/socket';

type Message =
  | { type: 'user'; text: string }
  | { type: 'bot'; messageChunks: string[] };

const ChatbotPage = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isStreaming, setIsStreaming] = useState(false);
  const [sessionId, setSessionId] = useState<string | null>(null);
  const responseRef = useRef('');

  useEffect(() => {
    const existing = localStorage.getItem('sessionId');
    socket.emit('init-session', existing || null);

    socket.on('session-id', (id: string) => {
      setSessionId(id);
      localStorage.setItem('sessionId', id);
    });

    socket.on(
      'session-history',
      (logs: { role: string; content: string }[]) => {
        const converted: Message[] = logs.map((msg) =>
          msg.role === 'user'
            ? { type: 'user', text: msg.content }
            : { type: 'bot', messageChunks: [msg.content] },
        );
        setMessages(converted);
      },
    );

    return () => {
      socket.off('session-id');
      socket.off('session-history');
    };
  }, []);

  // ✅ 소켓 응답 처리
  useEffect(() => {
    socket.on('stream', (chunk: string) => {
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
    });

    socket.on('done', () => {
      setIsStreaming(false);
    });

    return () => {
      socket.off('stream');
      socket.off('done');
    };
  }, []);

  const handleSendMessage = (text: string) => {
    if (!text.trim() || !sessionId) return;

    const payload = {
      sessionId,
      message: text.trim(),
    };

    setMessages((prev) => [...prev, { type: 'user', text }]);
    setIsStreaming(true);
    setInput('');
    responseRef.current = '';

    socket.emit('recommend-plan', payload);
  };

  const handleNewChat = () => {
    if (!sessionId) return;
    socket.emit('reset-session', { sessionId });
    setMessages([]);
    setInput('');
    responseRef.current = '';
  };

  return (
    <div>
      <Header
        title="요금제 추천 AI 챗봇 Me+"
        iconButtons={[
          { icon: <NewChatIcon />, onClick: handleNewChat },
          { icon: <CallIcon />, onClick: () => {} },
        ]}
      />



      <div className="space-y-2 max-w-[560px] mx-auto mt-4 px-4">
        {messages.map((msg, idx) =>
          msg.type === 'user' ? (
            <UserBubble key={idx} message={msg.text} />
          ) : (
            <BotBubble key={idx} messageChunks={msg.messageChunks} />
          ),
        )}
      </div>

      <div className="fixed bottom-5 left-1/2 transform -translate-x-1/2 w-full max-w-[600px] py-3 bg-transparent flex items-center justify-center z-50">
        <InputBox
          onSend={handleSendMessage}
          value={input}
          onChange={(v) => setInput(v)}
          disabled={isStreaming}
        />
      </div>
    </div>
  );
};

export default ChatbotPage;
