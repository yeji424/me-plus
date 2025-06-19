interface ButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  disabled?: boolean;
  variant?: 'primary' | 'secondary' | 'outline' | 'gradient' | 'danger';
  size?: 'small' | 'medium' | 'large';
  fullWidth?: boolean;
  className?: string;
  type?: 'button' | 'submit' | 'reset';
}

const Button: React.FC<ButtonProps> = ({
  children,
  onClick,
  disabled = false,
  variant = 'primary',
  size = 'medium',
  fullWidth = false,
  className = '',
  type = 'button',
}) => {
  const getVariantStyles = (): string => {
    switch (variant) {
      case 'primary':
        return 'bg-secondary-purple-80 text-white hover:bg-secondary-purple-90';
      case 'secondary':
        return 'bg-secondary-purple-40 text-gray700 hover:bg-secondary-purple-50';
      case 'outline':
        return 'border-2 border-secondary-purple-80 text-secondary-purple-80 bg-transparent hover:bg-secondary-purple-10';
      case 'gradient':
        return 'bg-gradation text-white hover:opacity-90';
      case 'danger':
        return 'bg-red-500 text-white hover:bg-red-600';
      default:
        return 'bg-secondary-purple-80 text-white hover:bg-secondary-purple-90';
    }
  };

  const getSizeStyles = (): {
    padding: string;
    fontSize: string;
    height: string;
    borderRadius: string;
  } => {
    switch (size) {
      case 'small':
        return {
          padding: 'px-3 py-2',
          fontSize: 'text-xs',
          height: 'h-8',
          borderRadius: 'rounded-md',
        };
      case 'medium':
        return {
          padding: 'px-4 py-[9px]',
          fontSize: 'text-sm',
          height: 'h-[42px]',
          borderRadius: 'rounded-[10px]',
        };
      case 'large':
        return {
          padding: 'px-6 py-3',
          fontSize: 'text-base',
          height: 'h-12',
          borderRadius: 'rounded-[12px]',
        };
      default:
        return {
          padding: 'px-4 py-[9px]',
          fontSize: 'text-sm',
          height: 'h-[42px]',
          borderRadius: 'rounded-[10px]',
        };
    }
  };

  const variantStyles = getVariantStyles();
  const sizeStyles = getSizeStyles();

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`
        ${sizeStyles.padding} 
        ${sizeStyles.fontSize} 
        ${sizeStyles.height} 
        ${sizeStyles.borderRadius}
        ${variantStyles}
        ${fullWidth ? 'w-full' : 'w-auto'}
        font-semibold
        focus:outline-none focus:ring-2 focus:ring-secondary-purple-50
        ${
          disabled
            ? 'opacity-50 cursor-not-allowed hover:opacity-50'
            : 'hover:cursor-pointer'
        }
        ${className}
      `}
    >
      {children}
    </button>
  );
};

export default Button;
