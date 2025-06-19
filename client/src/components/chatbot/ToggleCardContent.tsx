import React from 'react';
import type { ColorTheme } from './ToggleCard';

interface Detail {
  key: string;
  value: string;
}

interface ToggleCardContentProps {
  details: Detail[];
  detailUrl: string;
  colorTheme: ColorTheme;
}

const ToggleCardContent = ({
  details,
  detailUrl,
  colorTheme,
}: ToggleCardContentProps) => {
  const descriptionItem = details.find((item) => item.key === '요금제설명');
  const otherDetails = details.filter((item) => item.key !== '요금제설명');

  return (
    <div className="flex flex-col gap-y-[26px] mt-3 mb-3">
      {/* 설명 */}
      <div className={`text-[14px] ${colorTheme.textColor} break-all`}>
        {descriptionItem && <div>{descriptionItem.value}</div>}
      </div>

      {/* 상세 정보 그리드 */}
      <div
        className={`grid w-[274px] grid-cols-[24%_76%] gap-x-[5px] gap-y-[10px] text-xs ${colorTheme.textColor} text-[12px] py-[10px]`}
      >
        {otherDetails.map(({ key, value }, idx) => (
          <React.Fragment key={idx}>
            <div className={colorTheme.textColor}>{key}</div>
            <div className="text-gray700 whitespace-pre-line">{value}</div>
          </React.Fragment>
        ))}
      </div>

      <a
        href={detailUrl}
        target="_blank"
        rel="noopener noreferrer"
        className={`cursor-pointer flex items-center justify-center rounded-[5px] ${colorTheme.borderColor} bg-white ${colorTheme.textColor} text-[12px] py-[10px] border-[0.5px] ${colorTheme.borderColor} ${colorTheme.hoverBgColor} hover:text-white transition-colors duration-200`}
      >
        요금제 자세히 보기
      </a>
    </div>
  );
};

export default ToggleCardContent;
