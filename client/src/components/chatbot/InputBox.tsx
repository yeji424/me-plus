import React from 'react';

interface InputBoxProps {
  value: string;
  onChange: (value: string) => void;
  onSend: (message: string) => void;
  disabled?: boolean;
}

const InputBox = ({
  value,
  onChange,
  onSend,
  disabled = false,
}: InputBoxProps) => {
  const handleSubmit = () => {
    if (!value.trim() || disabled) return;
    onSend(value);
    onChange(''); // 전송 후 초기화
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') handleSubmit();
  };

  return (
    <div className="bg-white rounded-full px-4 py-2 shadow flex items-center w-full max-w-[560px]">
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder="AI챗봇에게 물어보고 싶은 내용을 질문하세요."
        className="flex-grow focus:outline-none text-gray-700 placeholder-gray-400 h-10 rounded-full px-3"
        disabled={disabled}
      />
      <button
        type="button"
        onClick={handleSubmit}
        disabled={disabled}
        className={`ml-2 rounded-full px-4 py-2 h-10 flex items-center justify-center transition
        ${disabled ? 'bg-gray-300 cursor-not-allowed text-white' : 'bg-purple-600 hover:bg-purple-700 text-white'}`}
      >
        {disabled ? '응답 중' : '전송'}
      </button>
    </div>
  );
};

export default InputBox;
