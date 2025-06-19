import { useState } from 'react';
import ChatButton from '../ChatButton';
import NetflixIcon from '@/assets/icon/netflix.png';
import TvingIcon from '@/assets/icon/tving.png';
import WatchaIcon from '@/assets/icon/watcha.png';
import DisneyIcon from '@/assets/icon/diseny.png';
import DraggableScroll from '@/components/common/DraggableScroll';

interface OttService {
  id: string;
  label: string;
  icon: string;
}

const OTT_SERVICES: OttService[] = [
  { id: 'netflix', label: '넷플릭스', icon: NetflixIcon },
  { id: 'tving', label: '티빙', icon: TvingIcon },
  { id: 'watcha', label: '왓챠', icon: WatchaIcon },
  { id: 'disney', label: '디즈니 +', icon: DisneyIcon },
];

interface OttButtonGroupProps {
  onButtonClick?: (message: string) => void;
}

const OttButtonGroup = ({ onButtonClick }: OttButtonGroupProps) => {
  const [clickedButton, setClickedButton] = useState<string | null>(null);

  const handleButtonClick = (label: string) => {
    if (clickedButton) return;

    setClickedButton(label);
    onButtonClick?.(label);
  };

  return (
    <div className="px-1 -mx-1">
      <DraggableScroll className="flex overflow-visible flex-nowrap gap-1  mx-1.5">
        {OTT_SERVICES.map((service) => (
          <ChatButton
            key={service.id}
            label={service.label}
            icon={<img src={service.icon} alt={service.label} />}
            disabled={clickedButton !== null && clickedButton !== service.label}
            onClick={() => handleButtonClick(service.label)}
          />
        ))}
      </DraggableScroll>
    </div>
  );
};

export default OttButtonGroup;
