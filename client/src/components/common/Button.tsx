import AnimatedCardWrapper from './AnimatedWrapper';

interface ButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  disabled?: boolean;
  variant?: 'primary' | 'secondary' | 'custom';
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
  size = '',
  fullWidth = false,
  className = '',
  type = 'button',
}) => {
  const getVariantStyles = (): string => {
    switch (variant) {
      case 'primary':
        return 'bg-secondary-purple-60 text-white hover:bg-secondary-purple-90';
      case 'secondary':
        return 'bg-secondary-purple-40 text-gray700 hover:bg-secondary-purple-50';
      case 'custom':
        return '';
      default:
        return 'bg-secondary-purple-80 text-white hover:bg-secondary-purple-90';
    }
  };

  const getSizeStyles = (): {
    padding: string;
    fontSize: string;
    height: string;
    borderRadius: string;
    fontWeight: string;
  } => {
    switch (size) {
      case 'small':
        return {
          padding: 'px-3 py-2',
          fontSize: 'text-xs',
          height: 'h-8',
          borderRadius: 'rounded-md',
          fontWeight: 'font-medium',
        };
      case 'medium':
        return {
          padding: 'px-4 py-[9px]',
          fontSize: 'text-[15px]',
          height: 'h-[42px]',
          borderRadius: 'rounded-[10px]',
          fontWeight: 'font-semibold',
        };
      case 'large':
        return {
          padding: 'px-6 py-3',
          fontSize: 'text-[15px]',
          height: 'h-[54px]',
          borderRadius: 'rounded-[12px]',
          fontWeight: 'font-semibold',
        };
      default:
        return {
          padding: 'px-4 py-[9px]',
          fontSize: 'text-[15px]',
          height: 'h-[42px]',
          borderRadius: 'rounded-[10px]',
          fontWeight: 'font-medium',
        };
    }
  };

  const variantStyles = getVariantStyles();
  const sizeStyles = getSizeStyles();

  return (
    <AnimatedCardWrapper
      className={`
        flex items-center justify-center shadow-special
        ${sizeStyles.padding} 
        ${sizeStyles.fontSize} 
        ${sizeStyles.height} 
        ${sizeStyles.borderRadius}
        ${sizeStyles.fontWeight}
        ${variantStyles}
        ${fullWidth ? 'w-full' : 'w-auto'}
        focus:outline-none
        ${
          disabled
            ? 'opacity-50 cursor-not-allowed hover:opacity-50'
            : 'hover:cursor-pointer'
        }
        ${className}

      `}
      onClick={onClick}
    >
      <button
        type={type}
        disabled={disabled}
        className="cursor-pointer w-full h-full flex items-center justify-center"
      >
        {children}
      </button>
    </AnimatedCardWrapper>
  );
};

export default Button;
