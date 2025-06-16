// import React from 'react';
import Header from '@/components/common/Header';
import NewChatIcon from '@/assets/icon/new_chat_icon.svg?react';
import CallIcon from '@/assets/icon/call_icon.svg?react';

const ChatbotPage = () => {
  return (
    <main>
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
      <h2>ChatbotPage</h2>
      <CallIcon className="border border-gray-300 hover:text-blue-500 transition-colors" />

      <div className="bg-blue-100">
        <h1 className="text-center text-gray-700 mb-8">
          Tailwind CSS 테스트 중입니다
        </h1>
        <p className="text-lg text-gray-400 mb-4">
          이 문장은 Tailwind의 기본 텍스트 스타일이 적용돼야 합니다.
        </p>
        <button className="px-4 py-2 bg-primary-pink-40 text-white rounded hover:bg-primary-pink transition">
          눌러보세요
        </button>
      </div>
    </main>
  );
};

export default ChatbotPage;
