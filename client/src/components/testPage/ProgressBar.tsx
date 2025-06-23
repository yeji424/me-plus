import React from 'react';

interface ProgressBarProps {
  currentStep: number;
  totalSteps?: number;
}

const ProgressBar: React.FC<ProgressBarProps> = ({
  currentStep,
  totalSteps = 7,
}) => {
  const percentage = Math.min((currentStep / totalSteps) * 100, 100);

  return (
    <div className="w-full mt-6">
      <div className="flex justify-center text-[16px] text-secondary-purple-80 font-semibold mb-2">
        <span>{`${currentStep} / ${totalSteps}`}</span>
      </div>
      <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
        <div
          className="h-full bg-gradient-to-r from-[#5B038C] to-[#EB008B] transition-all duration-300"
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
};

export default ProgressBar;
