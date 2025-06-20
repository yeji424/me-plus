import { useEffect, useMemo, useRef, useState } from 'react';
import Header from '@/components/common/Header';
import NewChatIcon from '@/assets/icon/new_chat_icon.svg?react';
import CallIcon from '@/assets/icon/call_icon.svg?react';
import UserBubble from '@/components/chatbot/UserBubble';
import InputBox from '@/components/chatbot/InputBox';
import BotBubbleFrame from '@/components/chatbot/BotBubbleFrame';
import { useChatSocket } from '@/hooks/useChatSocket';
// import GradientScroll from 'react-gradient-scroll-indicator';

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
  const containerRef = useRef<HTMLDivElement | null>(null);
  const reversedMessages = useMemo(
    () =>
      messages
        .map((msg, index) => ({ ...msg, tempKey: `${msg.type}-${index}` }))
        .reverse(),
    [messages],
  );
  useEffect(() => {
    if (!containerRef.current) return;
    const container = containerRef.current;
    container.scrollTop = container.scrollHeight - container.clientHeight;
  }, [messages]);

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
        <div
          ref={containerRef}
          className="border-1 relative flex-1 overflow-y-auto mt-[94px] pb-[60px] flex flex-col-reverse"
        >
          <div className=" space-y-2 max-w-[560px] min-h-full flex flex-col-reverse">
            <div className="h-1" />
            {reversedMessages.map((msg) =>
              msg.type === 'user' ? (
                <UserBubble key={msg.tempKey} message={msg.text} />
              ) : (
                <BotBubbleFrame
                  key={msg.tempKey}
                  messageChunks={msg.messageChunks}
                  functionCall={msg.functionCall}
                  onButtonClick={handleButtonClick}
                />
              ),
            )}
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
