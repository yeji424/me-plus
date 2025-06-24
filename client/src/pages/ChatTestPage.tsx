import TypingDots from '@/components/chatbot/TypingDots';
import LoadingSpinner from '@/components/common/LoadingSpinner';
import { useEffect, useRef, useState } from 'react';
import { io, Socket } from 'socket.io-client';

interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
}
interface CarouselItem {
  id: string;
  label: string;
}
const socket: Socket = io('http://localhost:3001');

const PlanChatTester = () => {
  const [input, setInput] = useState('');
  const [chatLog, setChatLog] = useState<ChatMessage[]>([]);
  const [isStreaming, setIsStreaming] = useState(false);
  const [optionButtons, setOptionButtons] = useState<string[]>([]);
  const [sessionId, setSessionId] = useState<string | null>(null);
  const responseRef = useRef('');

  useEffect(() => {
    const existingSessionId = localStorage.getItem('sessionId');
    socket.emit('init-session', existingSessionId || null);

    socket.on('session-id', (id: string) => {
      setSessionId(id);
      localStorage.setItem('sessionId', id);
    });

    socket.on('session-history', (messages: ChatMessage[]) => {
      setChatLog(messages);
    });

    return () => {
      socket.off('session-id');
      socket.off('session-history');
    };
  }, []);
  useEffect(() => {
    // 기존 stream, done, price-options 외 추가 이벤트 처리

    socket.on('ott-service-list', ({ question, options }) => {
      setChatLog((prev) => [...prev, { role: 'assistant', content: question }]);
      setOptionButtons(options);
    });

    socket.on('carousel-buttons', (items) => {
      setChatLog((prev) => [
        ...prev,
        {
          role: 'assistant',
          content: '다음 항목 중 하나를 선택해주세요:',
        },
      ]);
      setOptionButtons(items.map((item: CarouselItem) => item.label));
    });

    socket.on('plan-details', (plan) => {
      const {
        name,
        monthlyFee,
        description,
        dataGb,
        sharedDataGb,
        voiceMinutes,
        bundleBenefit,
        baseBenefit,
        specialBenefit,
        detailUrl,
      } = plan;

      const formatted = `
      📦 ${name}
      💰 월정액 ${monthlyFee.toLocaleString()}원
      
      📝 ${description}
      
      ━━━━━━━━━━━━━━━━━━
      
      📶 데이터: ${dataGb === -1 ? '무제한' : `${dataGb}GB`}
      🔄 공유데이터: ${sharedDataGb}
      📞 음성통화: ${voiceMinutes}
      🤝 결합 할인: ${bundleBenefit}
      🎁 기본 혜택: ${baseBenefit}
      💎 특별 혜택: ${specialBenefit}
      
      🔗 [요금제 자세히 보기](${detailUrl})
      `;
      setChatLog((prev) => [
        ...prev,
        { role: 'assistant', content: formatted },
      ]);
    });

    socket.on('text-buttons', ({ question, options }) => {
      setChatLog((prev) => [...prev, { role: 'assistant', content: question }]);
      setOptionButtons(options);
    });

    return () => {
      socket.off('ott-service-list');
      socket.off('carousel-buttons');
      socket.off('plan-details');
      socket.off('text-buttons');
    };
  }, []);
  useEffect(() => {
    socket.on('stream', (chunk: string) => {
      responseRef.current += chunk;

      setChatLog((prev) => {
        const last = prev[prev.length - 1];
        if (last?.role === 'assistant') {
          return [
            ...prev.slice(0, -1),
            { role: 'assistant', content: responseRef.current },
          ];
        } else {
          return [...prev, { role: 'assistant', content: chunk }];
        }
      });
    });

    // ✅ 응답 완료 시 스트리밍 상태 해제
    socket.on('done', () => {
      setIsStreaming(false);
    });

    socket.on('disconnect', () => {
      setIsStreaming(false);
    });
    socket.on('price-options', (options: string[]) => {
      setChatLog((prev) => [
        ...prev,
        {
          role: 'assistant',
          content: '요금제 추천을 위해 아래 가격대 중 하나를 선택해주세요:',
        },
      ]);

      setOptionButtons(options); // 버튼 목록 상태 저장
    });
    return () => {
      socket.off('stream');
      socket.off('done'); // 정리해주기
    };
  }, []);

  const sendPrompt = (text?: string) => {
    const messageToSend = text || input.trim();
    if (!messageToSend || !sessionId) return;

    const payload = {
      sessionId,
      message: messageToSend,
    };
    setChatLog((prev) => [...prev, { role: 'user', content: messageToSend }]);
    setInput('');
    setIsStreaming(true);
    responseRef.current = '';
    setOptionButtons([]);

    socket.emit('recommend-plan', payload);
  };

  const handleNewChat = () => {
    if (!sessionId) return;
    socket.emit('reset-session', { sessionId });
    setChatLog([]);
    setInput('');
    setOptionButtons([]);
  };

  return (
    <div style={{ padding: '1rem' }}>
      <div>
        <LoadingSpinner />
        <TypingDots />
      </div>
      <div className="h-50" /> <h2>요금제 추천 AI 챗봇</h2>
      <button
        onClick={handleNewChat}
        disabled={isStreaming}
        style={{
          marginBottom: '1rem',
          padding: '0.5rem 1rem',
          borderRadius: '6px',
          border: '1px solid #ccc',
          background: '#fff',
          cursor: 'pointer',
        }}
      >
        🆕 새 대화 시작
      </button>
      <div
        style={{
          border: '1px solid #ccc',
          padding: '1rem',
          borderRadius: '4px',
          minHeight: '300px',
          maxHeight: '400px',
          overflowY: 'auto',
          marginBottom: '1rem',
        }}
      >
        {chatLog.length === 0 ? (
          <p style={{ color: '#888' }}>대화를 시작해보세요!</p>
        ) : (
          chatLog.map((msg, idx) => (
            <div
              key={idx}
              style={{
                marginBottom: '1rem',
                textAlign: msg.role === 'user' ? 'right' : 'left',
              }}
            >
              <strong>{msg.role === 'user' ? '나' : 'AI'}</strong>
              <div
                style={{
                  background: msg.role === 'user' ? '#dbeafe' : '#f3f4f6',
                  display: 'inline-block',
                  padding: '0.5rem 1rem',
                  borderRadius: '10px',
                  maxWidth: '80%',
                  whiteSpace: 'pre-wrap',
                }}
              >
                {msg.content}
              </div>
            </div>
          ))
        )}
      </div>
      <div style={{ display: 'flex', gap: '0.5rem' }}>
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter' && !isStreaming) sendPrompt();
          }}
          placeholder="질문을 입력하세요..."
          style={{
            flex: 1,
            padding: '0.5rem',
            borderRadius: '4px',
            border: '1px solid #ccc',
          }}
          disabled={isStreaming}
        />
        <button onClick={() => sendPrompt()} disabled={isStreaming}>
          {isStreaming ? '응답 중...' : '보내기'}
        </button>
      </div>
      {optionButtons.length > 0 && (
        <div style={{ display: 'flex', gap: '0.5rem', marginTop: '1rem' }}>
          {optionButtons.map((opt) => (
            <button
              key={opt}
              onClick={() => sendPrompt(opt)}
              style={{
                padding: '0.5rem 1rem',
                background: '#f3f4f6',
                border: '1px solid #ccc',
                borderRadius: '8px',
                cursor: 'pointer',
              }}
            >
              {opt}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default PlanChatTester;
