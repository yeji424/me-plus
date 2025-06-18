import React from 'react';

interface Detail {
  key: string;
  value: string;
}

interface ToggleCardContentProps {
  details: Detail[];
}

const ToggleCardContent = ({ details }: ToggleCardContentProps) => {
  const descriptionItem = details.find((item) => item.key === '요금제설명');
  const otherDetails = details.filter((item) => item.key !== '요금제설명');

  return (
    <div className="flex flex-col gap-y-[26px] mt-3 mb-3">
      {/* 설명 */}
      <div className="text-[14px] text-secondary-purple-60 break-all">
        {descriptionItem && <div>{descriptionItem.value}</div>}
      </div>

      {/* 상세 정보 그리드 */}
      <div className="grid w-[274px] grid-cols-[24%_76%] gap-x-[5px] gap-y-[10px] text-xs text-secondary-purple-60 text-[12px] py-[10px]">
        {otherDetails.map(({ key, value }, idx) => (
          <React.Fragment key={idx}>
            <div className="text-secondary-purple-60">{key}</div>
            <div className="text-gray700">{value}</div>
          </React.Fragment>
        ))}
      </div>

      <button className="cursor-pointer flex items-center justify-center rounded-[5px] border-secondary-purple-60 bg-white text-secondary-purple-60 text-[12px] py-[10px] border-[0.5px] border-secondary-purple-60">
        요금제 자세히 보기
      </button>
    </div>
  );
};

export default ToggleCardContent;
