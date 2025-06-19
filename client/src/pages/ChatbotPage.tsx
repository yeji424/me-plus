import { useEffect, useRef, useState } from 'react';
import Header from '@/components/common/Header';
import NewChatIcon from '@/assets/icon/new_chat_icon.svg?react';
import CallIcon from '@/assets/icon/call_icon.svg?react';
import UserBubble from '@/components/chatbot/UserBubble';
import InputBox from '@/components/chatbot/InputBox';
import BotBubbleFrame from '@/components/chatbot/BotBubbleFrame';
import { useChatSocket } from '@/hooks/useChatSocket';
import GradientScroll from 'react-gradient-scroll-indicator';

const ChatbotPage = () => {
  const [input, setInput] = useState('');
  const { messages, isStreaming, sendMessage, startNewChat } = useChatSocket();

  const handleSendMessage = (text: string) => {
    sendMessage(text);
    setInput('');
  };

  const handleNewChat = () => {
    startNewChat();
    setInput('');
  };

  const handleButtonClick = (message: string) => {
    sendMessage(message);
  };
  const bottomRef = useRef<HTMLDivElement | null>(null);
  const prevMessageLengthRef = useRef(0);
  useEffect(() => {
    if (!bottomRef.current) return;

    const isNewMessageAdded = messages.length > prevMessageLengthRef.current;
    prevMessageLengthRef.current = messages.length;

    // 1) 메시지 추가되면 부드럽게 스크롤
    bottomRef.current.scrollIntoView({
      behavior: isNewMessageAdded ? 'smooth' : 'smooth',
    });

    // 2) 300ms 후에 무조건 딱 맨 아래로 스크롤(스크롤 위치 재조정)
    const timeout = setTimeout(() => {
      bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, 1000);

    return () => clearTimeout(timeout);
  }, [messages]);

  return (
    <div>
      {/* 1. Header - Fixed */}
      <Header
        title="요금제 추천 AI 챗봇 Me+"
        iconButtons={[
          { icon: <NewChatIcon />, onClick: handleNewChat },
          { icon: <CallIcon />, onClick: () => {} },
        ]}
        isTransparent={false}
      />

      {/* 2. 메시지 영역 - Fixed 위치와 높이 */}
      <div className="fixed top-[72px] bottom-[65px] left-1/2 transform -translate-x-1/2 w-full max-w-[600px] px-5">
        <div className="gradient-scroll-container h-full">
          <GradientScroll
            primaryColor="#f6f7fc"
            fadeColor="transparent"
            fadeHeight="80px"
          >
            <div className="space-y-2 max-w-[560px] mx-auto pb-4">
              {messages.map((msg, idx) =>
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
          </GradientScroll>
        </div>
      </div>

      {/* 3. InputBox - Fixed */}
      <div className="fixed bottom-0 left-1/2 transform -translate-x-1/2 w-full max-w-[600px] z-50">
        <div className="bg-background-80 h-[65px]  rounded-xl shadow-[0_-3px_10px_rgba(0,0,0,0.1)] border-t border-gray-100 py-3 px-5">
          <InputBox
            onSend={handleSendMessage}
            value={input}
            onChange={(v) => setInput(v)}
            disabled={isStreaming}
          />
        </div>
      </div>
    </div>
  );
};

export default ChatbotPage;
