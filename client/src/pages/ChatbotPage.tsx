import { useSearchParams } from 'react-router-dom';
import { useEffect, useMemo, useRef, useState, useCallback } from 'react';
import React from 'react';
import Header from '@/components/common/Header';
import NewChatIcon from '@/assets/icon/new_chat_icon.svg?react';
import CallIcon from '@/assets/icon/call_icon.svg?react';
import UserBubble from '@/components/chatbot/UserBubble';
import InputBox from '@/components/chatbot/InputBox';
import BotBubbleFrame from '@/components/chatbot/BotBubbleFrame';
import LoadingBubble from '@/components/chatbot/LoadingBubble';
import type {
  FunctionCall,
  CarouselItem,
} from '@/components/chatbot/BotBubbleFrame';
import { useChatSocket } from '@/hooks/useChatSocket';
import ChatbotIcon from '@/assets/icon/meplus_icon.png';
import Modal from '@/components/common/Modal';
import Button from '@/components/common/Button';
import LoadingSpinner from '@/components/common/LoadingSpinner';
import type { UserProfile } from '@/utils/chatStorage';

// 사용자 정보 타입 제거 (chatStorage에서 import)

type Message =
  | { type: 'user'; text: string }
  | {
      type: 'bot';
      messageChunks: string[];
      functionCall?: FunctionCall;
      selectedData?: { selectedItem: CarouselItem; isSelected: boolean };
    }
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

// 컴포넌트들을 메모이제이션하여 불필요한 재렌더링 방지
const MemoizedHeader = React.memo(Header);
const MemoizedInputBox = React.memo(InputBox);
const MemoizedUserBubble = React.memo(UserBubble);
const MemoizedBotBubbleFrame = React.memo(BotBubbleFrame);
const MemoizedLoadingBubble = React.memo(LoadingBubble);

const ChatbotPage = () => {
  const [input, setInput] = useState('');
  const {
    messages,
    isStreaming,
    isInitialLoading,
    storedUserProfile, // 복원된 사용자 프로필
    sendMessage,
    updateCarouselSelection,
    updateOttSelection,
    updateOxSelection,
    startNewChat,
    setUserProfile, // 사용자 프로필 설정 함수
  } = useChatSocket();
  const [initialMessages, setInitialMessages] = useState<Message[]>([]);
  const [isInitialized, setIsInitialized] = useState(false);
  const [searchParams] = useSearchParams();
  const [showBackModal, setShowBackModal] = useState(false);
  const [showCallModal, setShowCallModal] = useState(false);
  const hasInitializedForUrlParams = useRef(false); // URL 파라미터 초기화 여부 추적

  // 사용자 정보 확인: URL 파라미터에서만 읽음 - 메모이제이션으로 최적화
  const urlUserProfile = useMemo(
    () => parseUserProfileFromURL(searchParams),
    [searchParams],
  );
  // 최종 사용자 프로필: URL 파라미터가 있으면 우선, 없으면 저장된 프로필 사용
  const userProfile = urlUserProfile || storedUserProfile;

  // URL 파라미터 사용자의 경우 프로필 저장
  useEffect(() => {
    if (urlUserProfile && !hasInitializedForUrlParams.current) {
      hasInitializedForUrlParams.current = true;
      setUserProfile(urlUserProfile); // 사용자 프로필 저장
    }
  }, [urlUserProfile, setUserProfile]);

  // 초기 메시지 설정 (사용자 정보에 따라 다르게)
  useEffect(() => {
    // 로딩이 완료되고, 아직 초기화되지 않았고, 기존 메시지가 없을 때만 실행
    if (!isInitialLoading && !isInitialized) {
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
  }, [isInitialLoading, isInitialized, userProfile, messages.length]);

  const handleClose = () => {
    setShowBackModal(false);
    setShowCallModal(false);
  };
  // 인라인 함수들을 useCallback으로 최적화
  const handleInputChange = useCallback((value: string) => {
    setInput(value);
  }, []);

  const handleNewChat = useCallback(() => {
    startNewChat();
    setInput('');
    setIsInitialized(false);
    setInitialMessages([]);
  }, [startNewChat]);

  const handleSendMessage = useCallback(
    (text: string) => {
      sendMessage(text);
      setInput('');
    },
    [sendMessage],
  );

  const handleButtonClick = useCallback(
    (message: string) => {
      sendMessage(message);
    },
    [sendMessage],
  );

  const containerRef = useRef<HTMLDivElement | null>(null);

  // 모든 메시지 (초기 메시지 + 실제 메시지)
  const allMessages = useMemo(
    () => [...initialMessages, ...messages],
    [initialMessages, messages],
  );

  // 새로 추가: 캐러셀 선택 처리 (업데이트 방식)
  const handleCarouselSelect = useCallback(
    (carouselData: CarouselItem[], selectedItem: CarouselItem) => {
      // 실제 function_call 메시지의 인덱스를 찾기 (messages 배열에서만)
      const actualIndex = messages.findIndex((msg) => {
        return (
          msg.type === 'bot' &&
          msg.functionCall?.name === 'requestCarouselButtons' &&
          JSON.stringify(msg.functionCall.args?.items) ===
            JSON.stringify(carouselData)
        );
      });

      console.log('🔍 전체 messages 배열 길이:', messages.length);
      console.log('🔍 전체 allMessages 배열 길이:', allMessages.length);

      if (actualIndex !== -1) {
        updateCarouselSelection(actualIndex, selectedItem);
      } else {
        console.warn(
          '⚠️ function_call 메시지를 찾을 수 없어서 업데이트를 건너뜁니다.',
        );
      }
    },
    [updateCarouselSelection, messages, allMessages],
  );

  // 새로 추가: OTT 선택 처리
  const handleOttSelect = useCallback(
    (selectedServices: string[], displayIndex?: number) => {
      console.log('🎬 OTT 선택:', { selectedServices, displayIndex });

      // 실제 function_call 메시지의 인덱스를 찾기 (messages 배열에서만)
      const actualIndex = messages.findIndex((msg) => {
        return (
          msg.type === 'bot' &&
          msg.functionCall?.name === 'requestOTTServiceList'
        );
      });

      if (actualIndex !== -1) {
        updateOttSelection(actualIndex, selectedServices);
      } else {
        console.warn('⚠️ OTT function_call 메시지를 찾을 수 없습니다.');
      }
    },
    [updateOttSelection, messages],
  );

  // 새로 추가: OX 선택 처리
  const handleOxSelect = useCallback(
    (selectedOption: string, displayIndex?: number) => {
      console.log('🔘 OX 선택:', { selectedOption, displayIndex });

      // 실제 function_call 메시지의 인덱스를 찾기 (messages 배열에서만)
      const actualIndex = messages.findIndex((msg) => {
        return (
          msg.type === 'bot' &&
          msg.functionCall?.name === 'requestOXCarouselButtons'
        );
      });

      if (actualIndex !== -1) {
        updateOxSelection(actualIndex, selectedOption);
      } else {
        console.warn('⚠️ OX function_call 메시지를 찾을 수 없습니다.');
      }
    },
    [updateOxSelection, messages],
  );

  const prevMessageLengthRef = useRef(allMessages.length);
  const lastMessage = allMessages[allMessages.length - 1];
  const hasActiveFunctionCall =
    lastMessage?.type === 'bot' && lastMessage.functionCall;
  const isNewMessageAdded = allMessages.length > prevMessageLengthRef.current;

  // 스크롤을 맨 아래로 보내는 함수
  const scrollToBottom = useCallback(() => {
    if (!containerRef.current) return;
    containerRef.current.scrollTo({
      top: 0, // flex-col-reverse에서는 음수값이 맨 아래
      behavior: 'smooth',
    });
  }, []);

  // ToggleCard 위치로 스크롤하는 함수
  const scrollToToggleCard = useCallback((cardElement: HTMLDivElement) => {
    if (!containerRef.current) return;

    // 카드의 위치 정보 가져오기
    const containerRect = containerRef.current.getBoundingClientRect();
    const cardRect = cardElement.getBoundingClientRect();

    // flex-col-reverse 때문에 계산이 복잡함
    // 카드가 뷰포트 상단에 오도록 스크롤 위치 계산
    const scrollTop = containerRef.current.scrollTop;
    const targetScrollTop = scrollTop + (cardRect.top - containerRect.top) - 50;

    containerRef.current.scrollTo({
      top: targetScrollTop,
      behavior: 'smooth',
    });
  }, []);

  // 새 메시지가 추가되었을 때 스크롤 조정
  useEffect(() => {
    if (!isNewMessageAdded) return;

    // 즉시 스크롤 (텍스트 메시지용)
    scrollToBottom();

    // 컴포넌트 렌더링을 위한 지연 스크롤
    const timer = setTimeout(scrollToBottom, 150);

    prevMessageLengthRef.current = allMessages.length;

    return () => clearTimeout(timer);
  }, [allMessages, isNewMessageAdded, scrollToBottom]);

  // ResizeObserver로 컨테이너 크기 변화 감지 (캐러셀 등 동적 컴포넌트용)
  useEffect(() => {
    if (!containerRef.current) return;

    const container = containerRef.current;
    const observer = new ResizeObserver(() => {
      // 컨테이너 내용이 변경되어 크기가 바뀔 때마다 자동 스크롤
      scrollToBottom();
    });

    // 컨테이너의 첫 번째 자식 (실제 메시지들이 들어있는 div) 관찰
    const messageContainer = container.querySelector('div');
    console.log(messageContainer);
    if (messageContainer) {
      observer.observe(messageContainer);
    }

    return () => observer.disconnect();
  }, [scrollToBottom]);

  const reversedMessages = useMemo(
    () =>
      allMessages
        .map((msg, index) => ({ ...msg, tempKey: `${msg.type}-${index}` }))
        .reverse(),
    [allMessages],
  );

  // Header 아이콘 버튼들도 메모이제이션
  const iconButtons = useMemo(
    () => [
      { icon: <NewChatIcon />, onClick: () => setShowBackModal(true) },
      { icon: <CallIcon />, onClick: () => setShowCallModal(true) },
    ],
    [], // setShowBackModal은 setState 함수로 안정적이므로 의존성 불필요
  );
  // 초기 로딩 중일 때는 로딩 스피너만 표시
  if (isInitialLoading) {
    return <LoadingSpinner />;
  }

  return (
    <>
      {/* 1. Header - Fixed */}
      <MemoizedHeader
        title="요금제 추천 AI 챗봇 Me+"
        iconButtons={iconButtons}
      />
      {/* 원래 삭제해도 되는데 같이 넣으니까 더 자연스러워서 넣음 */}
      {/* <div className="pointer-events-none fixed top-13 left-1/2 -translate-x-1/2 w-full max-w-[600px] h-[40px] z-30 bg-gradient-to-b from-[#ffffff] to-transparent" /> */}
      {/* 2. ChatArea - Flex */}
      <div className="px-5 pt-[70px] pb-[70px] gradient-scroll-container flex flex-col h-[100dvh] overflow-x-visible">
        {/* 패딩으로 보이는 영역 조절 (= 스크롤 가능 영역) */}
        {/* 마진으로 안하고 패딩으로 한 이유 : 마진으로 하면 그라데이션 넣은 이유 사라짐 */}
        <div
          ref={containerRef}
          className="relative flex-1 overflow-y-auto  pb-5 flex flex-col-reverse"
        >
          <div className="gap-2 max-w-[560px] min-h-full flex flex-col-reverse">
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
                return (
                  <MemoizedUserBubble key={msg.tempKey} message={msg.text} />
                );
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
                    <MemoizedLoadingBubble type={msg.loadingType} />
                  </div>
                );
              } else {
                return (
                  <MemoizedBotBubbleFrame
                    key={msg.tempKey}
                    messageChunks={msg.messageChunks}
                    functionCall={msg.functionCall}
                    onButtonClick={handleButtonClick}
                    onCarouselSelect={handleCarouselSelect}
                    onOttSelect={handleOttSelect}
                    onOxSelect={handleOxSelect}
                    onToggleCardClick={scrollToToggleCard}
                    messageIndex={allMessages.length - 1 - idx} // 역순 배열에서 실제 인덱스 계산
                    selectedData={msg.selectedData}
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
          <MemoizedInputBox
            onSend={handleSendMessage}
            value={input}
            onChange={handleInputChange}
            disabled={isStreaming}
            shouldAutoFocus={!hasActiveFunctionCall}
          />
        </div>
      </div>
      <Modal
        isOpen={showBackModal}
        onClose={() => setShowBackModal(false)}
        modalTitle="챗봇 상담을 새로 시작하시겠어요?"
        modalDesc="새로 상담을 시작할 경우, 이전에 진행한 상담은 모두 초기화됩니다."
      >
        <Button
          variant="secondary"
          size="medium"
          fullWidth
          onClick={handleClose}
        >
          돌아가기
        </Button>

        <Button
          variant="primary"
          size="medium"
          fullWidth
          onClick={() => {
            handleNewChat();
            handleClose();
          }}
        >
          새로 시작하기
        </Button>
      </Modal>

      <Modal
        isOpen={showCallModal}
        onClose={() => setShowCallModal(false)}
        modalTitle="고객센터 080-019-7000"
        modalDesc="상담원 연결을 시작할 경우, 이전에 진행한 상담은 모두 초기화됩니다."
      >
        <Button
          variant="secondary"
          size="medium"
          fullWidth
          onClick={handleClose}
        >
          돌아가기
        </Button>

        <Button
          variant="primary"
          size="medium"
          fullWidth
          onClick={() => {
            handleNewChat();
            handleClose();
          }}
        >
          전화하기
        </Button>
      </Modal>
    </>
  );
};

export default ChatbotPage;
