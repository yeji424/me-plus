import { useState } from 'react';
import Header from '@/components/common/Header';
import NewChatIcon from '@/assets/icon/new_chat_icon.svg?react';
import CallIcon from '@/assets/icon/call_icon.svg?react';
import UserBubble from '@/components/chatbot/UserBubble';
import InputBox from '@/components/chatbot/InputBox';
import BotBubbleFrame from '@/components/chatbot/BotBubbleFrame';
import { useChatSocket } from '@/hooks/useChatSocket';

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
            <BotBubbleFrame
              key={idx}
              messageChunks={msg.messageChunks}
              functionCall={msg.functionCall}
            />
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
