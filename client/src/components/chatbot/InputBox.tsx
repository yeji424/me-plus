import React, { useState } from 'react';

interface InputBoxProps {
  onSend: (message: string) => void;
}

const InputBox = ({ onSend }: InputBoxProps) => {
  const [input, setInput] = useState('');

  const handleSubmit = () => {
    if (!input.trim()) return;
    onSend(input);
    setInput(''); // 전송 후 input 초기화
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') handleSubmit();
  };

  return (
    <div className="bg-white rounded-full px-4 py-2 shadow flex items-center w-full">
      <input
        type="text"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder="AI챗봇에게 물어보고 싶은 내용을 질문하세요."
        className="flex-grow focus:outline-none text-gray-700 placeholder-gray-400 h-10 rounded-full px-3"
      />
      <button
        type="button"
        onClick={handleSubmit}
        className="ml-2 bg-purple-600 text-white rounded-full px-4 py-2 hover:bg-purple-700 transition h-10 flex items-center justify-center"
      >
        전송
      </button>
    </div>
  );
};

export default InputBox;
