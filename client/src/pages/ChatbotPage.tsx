import React, { useState } from 'react';
import Header from '@/components/common/Header';
import NewChatIcon from '@/assets/icon/new_chat_icon.svg?react';
import CallIcon from '@/assets/icon/call_icon.svg?react';
import BotBubble from '@/components/chatbot/BotBubble';
import InputBox from '@/components/chatbot/InputBox';
import UserBubble from '@/components/chatbot/UserBubble';

type Message =
  | { type: 'user'; text: string }
  | { type: 'bot'; messageChunks: string[] };

const ChatbotPage = () => {
  const [messages, setMessages] = useState<Message[]>([]);

  const handleSendMessage = (newMessage: string) => {
    if (!newMessage.trim()) return; // 빈 문자열 방지

    // 유저 버블
    setMessages((prev) => [...prev, { type: 'user', text: newMessage }]);

    // 봇 버블
    setTimeout(() => {
      setMessages((prev) => [
        ...prev,
        {
          type: 'bot',
          messageChunks: [
            '혹시 가족 구성원 중 ',
            '**만 18세 이하의',
            ' 청소년 자녀**가 ',
            '있으신가요? ',
            '\n있으시다면 ',
            '**추가 결합 혜택**도 ',
            '안내해드릴게요!',
          ],
        },
      ]);
    }, 1000);
  };

  return (
    <div>
      <Header
        title="요금제 추천 AI 챗봇 Me+"
        iconButtons={[
          {
            icon: <NewChatIcon />,
            onClick: () => {},
          },
          {
            icon: <CallIcon />,
            onClick: () => {},
          },
        ]}
      />

      <div className="border-3 space-y-2 max-w-[560px] mx-auto mt-4 px-4">
        {messages.map((msg, index) =>
          msg.type === 'user' ? (
            <UserBubble key={index} message={msg.text} />
          ) : (
            <BotBubble key={index} messageChunks={msg.messageChunks} />
          ),
        )}
      </div>

      <div className="border-3 fixed bottom-5 left-1/2 transform -translate-x-1/2 w-full max-w-[600px] py-3 bg-transparent flex items-center justify-center z-50">
        <InputBox onSend={handleSendMessage} />
      </div>
    </div>
  );
};

export default ChatbotPage;
