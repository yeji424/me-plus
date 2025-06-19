interface ButtonProps {
  color?: 'primary' | 'secondary';
  children: React.ReactNode;
  onClick?: () => void;
  disabled?: boolean;
  isModal?: boolean;
}

const colorClasses: Record<string, string> = {
  primary: 'bg-secondary-purple-80 text-white',
  secondary: 'bg-secondary-purple-40 text-gray700',
};

const Button: React.FC<ButtonProps> = ({
  color = 'primary',
  children = '계속할래요',
  onClick,
  disabled = false,
  isModal = false,
}) => {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`
        px-4 py-[9px] rounded-[10px] font-semibold w-full text-sm
        ${isModal ? 'h-[42px]' : 'h-full'}
        ${colorClasses[color] || colorClasses.primary}
        ${disabled ? 'opacity-50 cursor-not-allowed' : 'hover:cursor-pointer'}
      `}
    >
      {children}
    </button>
  );
};

export default Button;
