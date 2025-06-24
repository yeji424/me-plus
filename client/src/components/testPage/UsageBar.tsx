import calling from '@/assets/icon/calling.png';
import message from '@/assets/icon/message.png';
import data from '@/assets/icon/data.png';

interface UsageBarProps {
  label: string;
  percent: number; // 0 ~ 100 사이
}

const iconMap: Record<string, string> = {
  통화: calling,
  메시지: message,
  데이터: data,
};

const UsageBar = ({ label, percent }: UsageBarProps) => {
  return (
    <div className="flex items-center gap-3 py-2">
      {/* 아이콘 + 라벨 */}
      <div className="flex items-center gap-3 w-[100px]">
        <img src={iconMap[label]} alt={label + ' 아이콘'} className="w-5 h-5" />
        <span className="text-sm font-medium text-gray800">{label}</span>
      </div>

      <div className="relative flex-1 bg-gray200 rounded-full h-4 overflow-hidden">
        {/* 칠해진 그래프 */}
        <div
          className="bg-gradation h-full rounded-full"
          style={{ width: `${percent}%` }}
        ></div>

        {/* 구분선 */}
        <div className="absolute top-0 left-0 w-full h-full flex justify-between">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="w-[1px] bg-white/60 h-full" />
          ))}
        </div>
      </div>
    </div>
  );
};

export default UsageBar;
