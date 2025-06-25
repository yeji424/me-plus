import BotBubble from './BotBubble';
import CarouselButtonGroup from './ChatButtonGroups/CarouselButtonGroup';
import OttButtonGroup from './ChatButtonGroups/OttButtonGroup';
import OXButtonGroup from './ChatButtonGroups/OXButtonGroup';
import ToggleCard from './ToggleCard';
import FirstCardList from './FirstCardList';
import ImageCard from './ImageCard';
import { motion } from 'framer-motion';
import ChatbotIcon from '@/assets/icon/meplus_icon.png';

export interface OXOption {
  id: 'o' | 'x';
  label: string;
}

export interface CarouselItem {
  id: string;
  label: string;
}

export interface PlanData {
  _id: string;
  category: string;
  name: string;
  description: string;
  isPopular: boolean;
  dataGb: number;
  sharedDataGb: number;
  voiceMinutes: number;
  addonVoiceMinutes: number;
  smsCount: number;
  monthlyFee: number;
  optionalDiscountAmount: number;
  ageGroup: string;
  detailUrl: string;
  bundleBenefit: string | null;
  mediaAddons: string | null;
  premiumAddons: string | null;
  basicService: string;
}

export interface FunctionCall {
  name:
    | 'requestCarouselButtons'
    | 'requestOXCarouselButtons'
    | 'requestOTTServiceList'
    | 'requestTextCard'
    | 'showPlanLists'
    | 'showFirstCardList';
  args?: {
    items?: CarouselItem[];
    options?: string[] | OXOption[];
    question?: string;
    plan?: PlanData;
    plans?: PlanData[];
    title?: string;
    description?: string;
    url?: string;
    buttonText?: string;
    imageUrl?: string;
  };
}

export interface BotBubbleFrameProps {
  messageChunks: string[];
  functionCall?: FunctionCall;
  onButtonClick?: (message: string) => void;
  onCarouselSelect?: (
    carouselData: CarouselItem[],
    selectedItem: CarouselItem,
    messageIndex?: number,
  ) => void;
  onOttSelect?: (selectedServices: string[], messageIndex?: number) => void;
  onOxSelect?: (selectedOption: string, messageIndex?: number) => void;
  onToggleCardClick?: (cardElement: HTMLDivElement) => void;
  messageIndex?: number;
  selectedData?: {
    selectedItem?: CarouselItem;
    selectedServices?: string[];
    selectedOption?: string; // OX 버튼 선택된 옵션 (label)
    isSelected: boolean;
  }; // 모든 버튼 그룹 지원을 위해 확장
  showChatbotIcon?: boolean;
}

const BotBubbleFrame = ({
  messageChunks,
  functionCall,
  onButtonClick,
  onCarouselSelect,
  onOttSelect,
  onOxSelect,
  onToggleCardClick,
  messageIndex,
  selectedData,
  showChatbotIcon = true,
}: BotBubbleFrameProps) => {
  const shouldShowMessage = !functionCall || messageChunks[0]?.trim() !== '';

  const buttonGroup = (() => {
    if (!functionCall) return null;
    const { name, args } = functionCall;
    switch (name) {
      case 'requestCarouselButtons':
        return args?.items ? (
          <CarouselButtonGroup
            options={args.items}
            onButtonClick={onButtonClick}
            onCarouselSelect={(carouselData, selectedItem) =>
              onCarouselSelect?.(carouselData, selectedItem, messageIndex)
            }
            selectedData={selectedData} // 새로 추가
          />
        ) : null;
      case 'requestOXCarouselButtons':
        return args?.options ? (
          <OXButtonGroup
            options={
              Array.isArray(args.options) && typeof args.options[0] === 'string'
                ? (args.options.map((opt, idx) => ({
                    id: idx === 0 ? 'o' : 'x',
                    label: opt,
                  })) as OXOption[])
                : (args.options as OXOption[])
            }
            onButtonClick={onButtonClick}
            onOxSelect={(selectedOption) =>
              onOxSelect?.(selectedOption, messageIndex)
            }
            selectedData={
              selectedData?.selectedOption
                ? {
                    selectedOption: selectedData.selectedOption,
                    isSelected: selectedData.isSelected,
                  }
                : undefined
            }
          />
        ) : null;
      case 'requestOTTServiceList':
        // 디버깅 로그 추가
        console.log(
          '🎬 BotBubbleFrame rendering OTT with selectedData:',
          selectedData,
        );

        return (
          <OttButtonGroup
            onButtonClick={onButtonClick}
            onOttSelect={(selectedServices) =>
              onOttSelect?.(selectedServices, messageIndex)
            }
            selectedData={
              selectedData?.selectedServices
                ? {
                    selectedServices: selectedData.selectedServices,
                    isSelected: selectedData.isSelected,
                  }
                : undefined
            }
          />
        );
      case 'requestTextCard':
        return args?.title &&
          args?.description &&
          args?.url &&
          args?.buttonText ? (
          <ImageCard
            imageUrl={args.imageUrl}
            text={args.description}
            buttonText={args.buttonText}
            onButtonClick={() => window.open(args.url, '_blank')}
          />
        ) : null;
      case 'showPlanLists':
        return args?.plans ? (
          <div className="space-y-3">
            {args.plans.map((plan, index) => (
              <ToggleCard
                key={plan._id || index}
                plan={plan}
                onToggleClick={onToggleCardClick}
              />
            ))}
          </div>
        ) : null;
      case 'showFirstCardList':
        return <FirstCardList onButtonClick={onButtonClick} />;
      default:
        return null;
    }
  })();

  return (
    <div className="space-y-2">
      {/* 챗봇 아이콘 영역 */}
      <div className="flex gap-3 items-start">
        {/* 챗봇 아이콘 - 연속된 봇 메시지 중 첫 번째에만 표시 */}
        {showChatbotIcon ? (
          <div className="flex-shrink-0 w-8 h-8 ">
            <img
              src={ChatbotIcon}
              alt="챗봇"
              className="w-full h-full object-contain"
            />
          </div>
        ) : (
          <div className="flex-shrink-0 w-8 h-8 mt-1" />
        )}

        {/* 메시지 및 버튼 그룹 영역 */}
        <div
          className=" flex-1 space-y-2"
          style={{ maxWidth: 'calc(min(100vw, 600px) - 40px)' }}
        >
          {shouldShowMessage && <BotBubble messageChunks={messageChunks} />}
          {buttonGroup && (
            <motion.div
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.35, ease: 'easeOut' }}
            >
              {buttonGroup}
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
};

export default BotBubbleFrame;
