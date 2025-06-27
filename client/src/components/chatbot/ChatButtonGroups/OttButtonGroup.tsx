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

  const [selectedServices, setSelectedServices] = useState<string[]>(
    selectedData?.isSelected ? selectedData.selectedServices : [],
  );

  // selectedData가 변경될 때마다 state 업데이트
  useEffect(() => {
    if (selectedData?.isSelected && selectedData.selectedServices) {
      setSelectedServices(selectedData.selectedServices);
    } else {
      setSelectedServices([]);
    }
  }, [selectedData]);

  const handleButtonClick = (label: string) => {
    // 이미 선택이 완료된 상태면 더 이상 선택 불가
    if (selectedServices.length > 0) return;

    const newSelectedServices = [label];
    setSelectedServices(newSelectedServices);
    onButtonClick?.(label);
    onOttSelect?.(newSelectedServices);
  };

  return (
    <>
      <DraggableScroll className="flex flex-nowrap gap-2">
        {OTT_SERVICES.map((service) => (
          <ChatButton
            key={service.id}
            label={service.label}
            icon={<img src={service.icon} alt={service.label} />}
            disabled={
              selectedServices.length > 0 &&
              !selectedServices.includes(service.label)
            } // 다른 서비스가 선택되면 나머지는 비활성화
            onClick={() => handleButtonClick(service.label)}
          />
        ))}
      </DraggableScroll>
    </>
  );
};

export default OttButtonGroup;
