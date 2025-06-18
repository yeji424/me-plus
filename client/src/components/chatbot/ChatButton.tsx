interface ChatButtonProps {
  label: string;
  icon?: React.ReactNode;
  onClick?: () => void;
}

const ChatButton = ({ label, icon, onClick }: ChatButtonProps) => {
  const handleClick = () => {
    // 사용자 버블로 한 번 더 띄우게 하는 함수 넣어야 함
    console.log('사용자 메시지:', label);
    if (onClick) onClick();
  };
  return (
    <button
      onClick={handleClick}
      className="flex items-center p-2 gap-[6px] rounded-[12px] shadow-small bg-white min-w-fit whitespace-nowrap"
    >
      {icon && <span>{icon}</span>}
      <span className="text-xs leading-[19px] text-gray-700">{label}</span>
    </button>
  );
};

export default ChatButton;
