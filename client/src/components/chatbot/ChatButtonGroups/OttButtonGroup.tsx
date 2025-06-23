import { useState, useEffect } from 'react';
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
  onOttSelect?: (selectedServices: string[]) => void; // 새로 추가
  selectedData?: { selectedServices: string[]; isSelected: boolean }; // 새로 추가
}

const OttButtonGroup = ({
  onButtonClick,
  onOttSelect,
  selectedData,
}: OttButtonGroupProps) => {
  // 디버깅 로그 추가
  console.log('🎬 OttButtonGroup rendered with selectedData:', selectedData);

  const [selectedServices, setSelectedServices] = useState<string[]>(
    selectedData?.isSelected ? selectedData.selectedServices : [],
  );

  // 디버깅 로그 추가
  console.log('🎬 OttButtonGroup selectedServices state:', selectedServices);

  // selectedData가 변경될 때마다 state 업데이트
  useEffect(() => {
    if (selectedData?.isSelected && selectedData.selectedServices) {
      console.log(
        '🔄 Updating selectedServices from props:',
        selectedData.selectedServices,
      );
      setSelectedServices(selectedData.selectedServices);
    } else {
      console.log('🔄 Resetting selectedServices (no selection data)');
      setSelectedServices([]);
    }
  }, [selectedData]);

  const handleButtonClick = (label: string) => {
    // 이미 선택된 서비스인지 확인
    const isAlreadySelected = selectedServices.includes(label);

    let newSelectedServices: string[];
    if (isAlreadySelected) {
      // 이미 선택된 경우 제거
      newSelectedServices = selectedServices.filter(
        (service) => service !== label,
      );
    } else {
      // 새로 선택하는 경우 추가
      newSelectedServices = [...selectedServices, label];
    }

    setSelectedServices(newSelectedServices);
    onButtonClick?.(label);
    onOttSelect?.(newSelectedServices);
  };

  return (
    <div className="px-1 -mx-1">
      <DraggableScroll className="flex overflow-visible flex-nowrap gap-1  mx-1.5">
        {OTT_SERVICES.map((service) => (
          <ChatButton
            key={service.id}
            label={service.label}
            icon={<img src={service.icon} alt={service.label} />}
            disabled={selectedServices.includes(service.label)} // 선택된 서비스는 비활성화로 표시
            onClick={() => handleButtonClick(service.label)}
          />
        ))}
      </DraggableScroll>
    </div>
  );
};

export default OttButtonGroup;
