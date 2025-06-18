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

const OttButtonGroup = () => {
  return (
    <DraggableScroll className="flex flex-nowrap gap-1 hide-scrollbar overflow-visible">
      {OTT_SERVICES.map((service) => (
        <ChatButton
          key={service.id}
          label={service.label}
          icon={<img src={service.icon} alt={service.label} />}
        />
      ))}
    </DraggableScroll>
  );
};

export default OttButtonGroup;
