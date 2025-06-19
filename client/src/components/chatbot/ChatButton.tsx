interface ChatButtonProps {
  label: string;
  icon?: React.ReactNode;
  onClick?: () => void;
  disabled?: boolean;
}

const ChatButton = ({
  label,
  icon,
  onClick,
  disabled = false,
}: ChatButtonProps) => {
  const handleClick = () => {
    if (disabled) return;
    console.log('사용자 메시지:', label);
    if (onClick) onClick();
  };

  return (
    <button
      onClick={handleClick}
      disabled={disabled}
      className={`flex items-center p-[10px] gap-[6px] rounded-[12px] shadow-small min-w-fit whitespace-nowrap transition-all ${
        disabled ? 'bg-white ' : 'bg-white hover:bg-gray-50 cursor-pointer'
      }`}
    >
      {icon && <span className={disabled ? 'opacity-50' : ''}>{icon}</span>}
      <span
        className={`text-[14px] leading-[19px] ${disabled ? 'text-gray-400' : 'text-gray-700'}`}
      >
        {label}
      </span>
    </button>
  );
};

export default ChatButton;
