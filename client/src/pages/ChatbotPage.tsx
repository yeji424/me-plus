import { useSearchParams } from 'react-router-dom';
import { useEffect, useMemo, useRef, useState } from 'react';
import Header from '@/components/common/Header';
import NewChatIcon from '@/assets/icon/new_chat_icon.svg?react';
import CallIcon from '@/assets/icon/call_icon.svg?react';
import UserBubble from '@/components/chatbot/UserBubble';
import InputBox from '@/components/chatbot/InputBox';
import BotBubbleFrame from '@/components/chatbot/BotBubbleFrame';
import LoadingBubble from '@/components/chatbot/LoadingBubble';
import type { FunctionCall } from '@/components/chatbot/BotBubbleFrame';
import { useChatSocket } from '@/hooks/useChatSocket';
import ChatbotIcon from '@/assets/icon/meplus_icon.png';

// 사용자 정보 타입 (TestResultPage와 동일)
interface UserProfile {
  plan: {
    id: string;
    name: string;
    monthlyFee: number;
    benefits: string[];
  };
  usage: {
    call: number;
    message: number;
    data: number;
  };
  preferences: string[];
  source: 'plan-test' | 'url-params';
}

type Message =
  | { type: 'user'; text: string }
  | { type: 'bot'; messageChunks: string[]; functionCall?: FunctionCall }
  | { type: 'loading'; loadingType: 'searching' | 'waiting' | 'dbcalling' };

// URL 파라미터에서 사용자 정보 파싱 함수
const parseUserProfileFromURL = (
  searchParams: URLSearchParams,
): UserProfile | null => {
  try {
    // 방법 1: 전체 profile을 Base64 인코딩된 JSON으로 전달
    const profileParam = searchParams.get('profile');
    if (profileParam) {
      // UTF-8 문자를 올바르게 디코딩하기 위한 방법
      const decodedJSON = decodeURIComponent(escape(atob(profileParam)));
      const decodedProfile = JSON.parse(decodedJSON) as UserProfile;
      decodedProfile.source = 'url-params';
      return decodedProfile;
    }

    // 방법 2: 개별 파라미터로 전달 (선택적)
    const planName = searchParams.get('plan');
    const usage = searchParams.get('usage');
    const preferences = searchParams.get('preferences');

    if (planName && usage && preferences) {
      const [call, message, data] = usage.split(',').map(Number);
      const prefArray = preferences.split('|');

      return {
        plan: {
          id: searchParams.get('planId') || '1',
          name: planName,
          monthlyFee: Number(searchParams.get('fee')) || 0,
          benefits: searchParams.get('benefits')?.split('|') || [],
        },
        usage: { call, message, data },
        preferences: prefArray,
        source: 'url-params',
      };
    }

    return null;
  } catch (error) {
    console.error('URL 파라미터 파싱 실패:', error);
    return null;
  }
};

const ChatbotPage = () => {
  const [input, setInput] = useState('');
  const { messages, isStreaming, sendMessage, startNewChat } = useChatSocket();
  const [initialMessages, setInitialMessages] = useState<Message[]>([]);
  const [isInitialized, setIsInitialized] = useState(false);
  const [searchParams] = useSearchParams();

  // 사용자 정보 확인: URL 파라미터에서만 읽음
  const userProfile = parseUserProfileFromURL(searchParams);

  // userProfile이 있으면 새 채팅 시작
  useEffect(() => {
    if (userProfile) {
      startNewChat(); // 기존 세션 초기화
    }
  }, [userProfile, startNewChat]);

  // 초기 메시지 설정 (사용자 정보에 따라 다르게)
  useEffect(() => {
    if (!isInitialized) {
      if (userProfile) {
        // 맞춤형 요금제 찾기에서 온 사용자
        setInitialMessages([
          {
            type: 'bot',
            messageChunks: [
              `안녕하세요! 요금제 추천 AI 챗봇 Me+입니다 👋\n\n${userProfile.plan.name} 요금제에 대해 추가 문의사항이 있으시거나, 다른 요금제와 비교하고 싶으시면 언제든 말씀해주세요!\n\n현재 고객님의 사용 패턴:\n${userProfile.preferences.map((pref) => `• ${pref}`).join('\n')}`,
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
      } else {
        // 일반 사용자 (기존 로직)
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
      }
      setIsInitialized(true);
    }
  }, [isInitialized, userProfile]);

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

  const containerRef = useRef<HTMLDivElement | null>(null);

  // 모든 메시지 (초기 메시지 + 실제 메시지)
  const allMessages = useMemo(
    () => [...initialMessages, ...messages],
    [initialMessages, messages],
  );
  const prevMessageLengthRef = useRef(allMessages.length);
  const lastMessage = allMessages[allMessages.length - 1];
  const hasActiveFunctionCall =
    lastMessage?.type === 'bot' && lastMessage.functionCall;
  const isNewMessageAdded = allMessages.length > prevMessageLengthRef.current;

  // 새 메시지가 추가되었을 때만 스크롤 조정
  useEffect(() => {
    if (!containerRef.current || !isNewMessageAdded) return;
    const container = containerRef.current;
    container.scrollTop = container.scrollHeight - container.clientHeight;
    prevMessageLengthRef.current = allMessages.length;
  }, [allMessages, isNewMessageAdded]);

  const reversedMessages = useMemo(
    () =>
      allMessages
        .map((msg, index) => ({ ...msg, tempKey: `${msg.type}-${index}` }))
        .reverse(),
    [allMessages],
  );
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
          className="relative flex-1 overflow-y-auto mt-[50px] pb-[60px] flex flex-col-reverse"
        >
          <div className="gap-5 max-w-[560px] min-h-full flex flex-col-reverse">
            {reversedMessages.map((msg, idx) => {
              // 역순 배열에서 이전 메시지 확인 (역순이므로 다음 인덱스가 실제로는 이전 메시지)
              const nextMessage =
                idx < reversedMessages.length - 1
                  ? reversedMessages[idx + 1]
                  : null;
              const isNextBot = nextMessage?.type === 'bot';
              const isCurrentBot = msg.type === 'bot';

              // 연속된 봇 메시지 중 마지막인지 확인 (역순이므로 마지막이 실제로는 첫 번째)
              const showChatbotIcon = isCurrentBot && !isNextBot;

              if (msg.type === 'user') {
                return <UserBubble key={idx} message={msg.text} />;
              } else if (msg.type === 'loading') {
                return (
                  <div key={msg.tempKey} className="flex gap-3 items-start">
                    <div className="flex-shrink-0 w-8 h-8">
                      <img
                        src={ChatbotIcon}
                        alt="챗봇"
                        className="w-full h-full object-contain"
                      />
                    </div>
                    <LoadingBubble type={msg.loadingType} />
                  </div>
                );
              } else {
                return (
                  <BotBubbleFrame
                    key={msg.tempKey}
                    messageChunks={msg.messageChunks}
                    functionCall={msg.functionCall}
                    onButtonClick={handleButtonClick}
                    showChatbotIcon={showChatbotIcon}
                  />
                );
              }
            })}
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
            shouldAutoFocus={!hasActiveFunctionCall}
          />
        </div>
      </div>
    </>
  );
};

export default ChatbotPage;
