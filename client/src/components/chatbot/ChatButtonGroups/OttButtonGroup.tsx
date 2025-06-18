import ChatButton from '../ChatButton';
import NetflixIcon from '@/assets/icon/netflix.png';
import TvingIcon from '@/assets/icon/tving.png';
import WatchaIcon from '@/assets/icon/watcha.png';
import DisneyIcon from '@/assets/icon/diseny.png';
import DraggableScroll from '@/components/common/DraggableScroll';

const OttButtonGroup = () => {
  return (
    <DraggableScroll className="flex flex-nowrap gap-1 hide-scrollbar overflow-visible">
      <ChatButton
        label="넷플릭스"
        icon={<img src={NetflixIcon} alt="넷플릭스" />}
      />
      <ChatButton label="티빙" icon={<img src={TvingIcon} alt="티빙" />} />
      <ChatButton label="왓챠" icon={<img src={WatchaIcon} alt="왓챠" />} />
      <ChatButton
        label="디즈니 +"
        icon={<img src={DisneyIcon} alt="디즈니+" />}
      />
    </DraggableScroll>
  );
};

export default OttButtonGroup;
