import React from 'react';
import BotBubble from './BotBubble';
import CarouselButtonGroup from './ChatButtonGroups/CarouselButtonGroup';
import OttButtonGroup from './ChatButtonGroups/OttButtonGroup';
import OXButtonGroup from './ChatButtonGroups/OXButtonGroup';
import TextButtonGroup from './ChatButtonGroups/TextButtonGroup';
import ToggleCard from './ToggleCard';
import FirstCardList from './FirstCardList';
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
export interface TextItem {
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
    | 'requestTextButtons'
    | 'showPlanLists'
    | 'showFirstCardList';
  args?: {
    items?: CarouselItem[];
    options?: string[] | OXOption[];
    textItems?: TextItem[];
    question?: string;
    plan?: PlanData;
    plans?: PlanData[];
  };
}
export interface BotBubbleFrameProps {
  messageChunks: string[];
  functionCall?: FunctionCall;
  onButtonClick?: (message: string) => void;
  showChatbotIcon?: boolean;
}

const BotBubbleFrame = ({
  messageChunks,
  functionCall,
  onButtonClick,
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
          />
        ) : null;
      case 'requestOTTServiceList':
        return <OttButtonGroup onButtonClick={onButtonClick} />;
      case 'requestTextButtons':
        return args?.textItems || args?.options ? (
          <TextButtonGroup
            options={
              args.textItems ||
              (args.options as string[])?.map((opt, idx) => ({
                id: idx.toString(),
                label: opt,
              })) ||
              []
            }
            onButtonClick={onButtonClick}
          />
        ) : null;
      case 'showPlanLists':
        return args?.plans ? (
          <div className="space-y-3">
            {args.plans.map((plan, index) => (
              <ToggleCard key={plan._id || index} plan={plan} />
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
          <div className="flex-shrink-0 w-8 h-8 mt-1">
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
        <div className="flex-1 space-y-2">
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

export default React.memo(BotBubbleFrame);
