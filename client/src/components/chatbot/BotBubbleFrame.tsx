import BotBubble from './BotBubble';
import CarouselButtonGroup from './ChatButtonGroups/CarouselButtonGroup';
import OttButtonGroup from './ChatButtonGroups/OttButtonGroup';
import OXButtonGroup from './ChatButtonGroups/OXButtonGroup';

export interface OXOption {
  id: 'o' | 'x';
  label: string;
}

export interface CarouselItem {
  id: string;
  label: string;
}

export interface FunctionCall {
  name: 'requestCarouselButtons' | 'requestOXButtons' | 'requestOttButtons';
  args?: {
    items?: CarouselItem[];
    options?: OXOption[];
  };
}
export interface BotBubbleFrameProps {
  messageChunks: string[];
  functionCall?: FunctionCall;
}

const BotBubbleFrame = ({
  messageChunks,
  functionCall,
}: BotBubbleFrameProps) => {
  return (
    <div className="space-y-2">
      <BotBubble messageChunks={messageChunks} />
      {functionCall &&
        (() => {
          const { name, args } = functionCall;
          switch (name) {
            case 'requestCarouselButtons':
              return args?.items ? (
                <CarouselButtonGroup options={args.items} />
              ) : null;
            case 'requestOXButtons':
              return args?.options ? (
                <OXButtonGroup options={args.options} />
              ) : null;
            case 'requestOttButtons':
              return <OttButtonGroup />;
            default:
              return null;
          }
        })()}
    </div>
  );
};

export default BotBubbleFrame;
