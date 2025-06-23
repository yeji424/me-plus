import React, { useEffect, useRef } from 'react';
import SendIcon from '@/assets/icon/send.svg?react'; // 이 라인 추가

interface InputBoxProps {
  value: string;
  onChange: (value: string) => void;
  onSend: (message: string) => void;
  disabled?: boolean;
  shouldAutoFocus?: boolean;
}

const InputBox = ({
  value,
  onChange,
  onSend,
  disabled = false,
  shouldAutoFocus = true,
}: InputBoxProps) => {
  const inputRef = useRef<HTMLInputElement>(null); // 추가

  // 컴포넌트 마운트 시 포커스 설정
  useEffect(() => {
    if (shouldAutoFocus) {
      const timer = setTimeout(() => {
        inputRef.current?.focus();
      }, 100);
      return () => clearTimeout(timer);
    }
  }, [shouldAutoFocus]);

  // disabled 상태가 변경될 때 포커스 처리
  useEffect(() => {
    if (!disabled && shouldAutoFocus) {
      const timer = setTimeout(() => {
        inputRef.current?.focus();
      }, 100);
      return () => clearTimeout(timer);
    }
  }, [disabled, shouldAutoFocus]);

  const handleSubmit = () => {
    if (!value.trim() || disabled) return;
    onSend(value);
    onChange(''); // 전송 후 초기화
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') handleSubmit();
  };

  return (
    <div className=" border-gray-100 flex items-center w-full max-w-[560px]">
      <input
        ref={inputRef}
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder="AI챗봇에게 물어보고 싶은 내용을 질문하세요."
        className="flex-grow h-10 w-full bg-white rounded-full focus:outline-none text-gray-700 placeholder-gray-400 text-sm px-5"
        disabled={disabled}
        autoFocus={shouldAutoFocus}
      />
      <button
        type="button"
        onClick={handleSubmit}
        disabled={disabled}
        className={`ml-3 rounded-full w-10 h-10 sm:w-8 sm:h-8 flex items-center justify-center transition-all duration-200 flex-shrink-0 ${
          disabled
            ? 'bg-gray-300 cursor-not-allowed'
            : 'bg-secondary-purple-80 hover:bg-secondary-purple-60 active:scale-95'
        }`}
      >
        <SendIcon className="w-[18px] h-[18px]" />
      </button>
    </div>
  );
};

export default InputBox;
