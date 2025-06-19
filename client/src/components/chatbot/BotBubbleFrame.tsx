import BotBubble from './BotBubble';
import CarouselButtonGroup from './ChatButtonGroups/CarouselButtonGroup';
import OttButtonGroup from './ChatButtonGroups/OttButtonGroup';
import OXButtonGroup from './ChatButtonGroups/OXButtonGroup';
import TextButtonGroup from './ChatButtonGroups/TextButtonGroup';
import { motion } from 'framer-motion';

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
export interface FunctionCall {
  name:
    | 'requestCarouselButtons'
    | 'requestOXButtons'
    | 'requestOttButtons'
    | 'requestTextButtons';
  args?: {
    items?: CarouselItem[];
    options?: OXOption[];
    textItems?: TextItem[];
  };
}
export interface BotBubbleFrameProps {
  messageChunks: string[];
  functionCall?: FunctionCall;
  onButtonClick?: (message: string) => void;
}

const BotBubbleFrame = ({
  messageChunks,
  functionCall,
  onButtonClick,
}: BotBubbleFrameProps) => {
    const shouldShowMessage =
    !functionCall || messageChunks[0]?.trim() !== '';

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
      case 'requestOXButtons':
        return args?.options ? (
          <OXButtonGroup options={args.options} onButtonClick={onButtonClick} />
        ) : null;
      case 'requestOttButtons':
        return <OttButtonGroup onButtonClick={onButtonClick} />;
      case 'requestTextButtons':
        return args?.textItems ? (
          <TextButtonGroup
            options={args.textItems}
            onButtonClick={onButtonClick}
          />
        ) : null;
      default:
        return null;
    }
  })();

  return (
    <div className="space-y-2">
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
  );
};

export default BotBubbleFrame;
