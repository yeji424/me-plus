// import React from 'react';
import Header from '@/components/common/Header';
import NewChatIcon from '@/assets/icon/new_chat_icon.svg?react';
import CallIcon from '@/assets/icon/call_icon.svg?react';
import BotBubble from '@/components/chatbot/BotBubble';

const ChatbotPage = () => {
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
      <BotBubble />
    </div>
  );
};

export default ChatbotPage;
