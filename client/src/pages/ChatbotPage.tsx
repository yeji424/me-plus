import { useEffect, useRef, useState } from 'react';
import Header from '@/components/common/Header';
import NewChatIcon from '@/assets/icon/new_chat_icon.svg?react';
import CallIcon from '@/assets/icon/call_icon.svg?react';
import UserBubble from '@/components/chatbot/UserBubble';
import InputBox from '@/components/chatbot/InputBox';
import BotBubbleFrame from '@/components/chatbot/BotBubbleFrame';
import type { FunctionCall } from '@/components/chatbot/BotBubbleFrame';
import { useChatSocket } from '@/hooks/useChatSocket';
// import GradientScroll from 'react-gradient-scroll-indicator';

type Message =
  | { type: 'user'; text: string }
  | { type: 'bot'; messageChunks: string[]; functionCall?: FunctionCall };

const ChatbotPage = () => {
  const [input, setInput] = useState('');
  const { messages, isStreaming, sendMessage, startNewChat } = useChatSocket();
  const [initialMessages, setInitialMessages] = useState<Message[]>([]);
  const [isInitialized, setIsInitialized] = useState(false);

  // 초기 메시지 설정 (한 번만 설정하고 계속 유지)
  useEffect(() => {
    if (!isInitialized) {
      setInitialMessages([
        {
          type: 'bot',
          messageChunks: [
            '안녕하세요! 요금제 추천 AI 챗봇 Me+입니다 👋\n\n고객님의 사용 패턴과 요구사항을 바탕으로 최적의 요금제를 추천해드립니다.\n\n아래 카드 중 하나를 선택하거나 직접 질문해주세요!',
          ],
        },
        {
          type: 'bot',
          messageChunks: [''],
          functionCall: {
            name: 'showFirstCardList',
            args: {},
          },
        },
      ]);
      setIsInitialized(true);
    }
  }, [isInitialized]);

  // 새 채팅 시작할 때만 초기 메시지 리셋
  const handleNewChat = () => {
    startNewChat();
    setInput('');
    setIsInitialized(false);
    setInitialMessages([]);
  };

  const handleSendMessage = (text: string) => {
    sendMessage(text);
    setInput('');
  };

  const handleButtonClick = (message: string) => {
    sendMessage(message);
  };

  const bottomRef = useRef<HTMLDivElement | null>(null);
  const prevMessageLengthRef = useRef(0);

  // 모든 메시지 (초기 메시지 + 실제 메시지)
  const allMessages = [...initialMessages, ...messages];

  useEffect(() => {
    if (!bottomRef.current) return;

    const isNewMessageAdded = allMessages.length > prevMessageLengthRef.current;
    prevMessageLengthRef.current = allMessages.length;

    // 1) 메시지 추가되면 부드럽게 스크롤
    bottomRef.current.scrollIntoView({
      behavior: isNewMessageAdded ? 'smooth' : 'smooth',
    });

    // 2) 300ms 후에 무조건 딱 맨 아래로 스크롤(스크롤 위치 재조정)
    const timeout = setTimeout(() => {
      bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, 1000);

    return () => clearTimeout(timeout);
  }, [allMessages]);

  return (
    <>
      {/* 1. Header - Fixed */}
      <Header
        title="요금제 추천 AI 챗봇 Me+"
        iconButtons={[
          { icon: <NewChatIcon />, onClick: handleNewChat },
          { icon: <CallIcon />, onClick: () => {} },
        ]}
        isTransparent={true}
        className="custom-header"
      />
      {/* 원래 삭제해도 되는데 같이 넣으니까 더 자연스러워서 넣음 */}
      <div className="pointer-events-none fixed top-13 left-1/2 -translate-x-1/2 w-full max-w-[600px] h-[40px] z-30 bg-gradient-to-b from-[#ffffff] to-transparent" />
      {/* 2. ChatArea - Flex */}
      <div className="gradient-scroll-container flex flex-col h-[100vh]">
        {/* 패딩으로 보이는 영역 조절 (= 스크롤 가능 영역) */}
        {/* 마진으로 안하고 패딩으로 한 이유 : 마진으로 하면 그라데이션 넣은 이유 사라짐 */}
        <div className="relative flex-1 overflow-y-auto pt-[94px] pb-[60px]">
          {/* 메시지 리스트 */}
          <div className="space-y-2 max-w-[560px] min-h-full px-1 -mx-1">
            <div className="h-1" />
            {allMessages.map((msg, idx) =>
              msg.type === 'user' ? (
                <UserBubble key={idx} message={msg.text} />
              ) : (
                <BotBubbleFrame
                  key={idx}
                  messageChunks={msg.messageChunks}
                  functionCall={msg.functionCall}
                  onButtonClick={handleButtonClick}
                />
              ),
            )}
            <div ref={bottomRef} />
          </div>
        </div>
      </div>
      {/* 3. InputBox - Fixed */}
      <div className="fixed bottom-0 left-1/2 transform -translate-x-1/2 w-full max-w-[600px] z-50">
        <div className="bg-background-80 h-[65px]  rounded-xl shadow-[0_-3px_15px_rgba(0,0,0,0.15)] border-t border-gray-100 py-3 px-5">
          <InputBox
            onSend={handleSendMessage}
            value={input}
            onChange={(v) => setInput(v)}
            disabled={isStreaming}
          />
        </div>
      </div>
    </>
  );
};

export default ChatbotPage;
