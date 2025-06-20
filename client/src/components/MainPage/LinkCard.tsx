import { Link } from 'react-router-dom';

interface LinkCardProps {
  to: string;
  title: string;
  description?: string;
  icon?: string;
  variant?: 'default' | 'primary' | 'gradient' | 'shadow';
  size?: 'large' | 'medium';
  className?: string;
  onClick?: () => void;
}

const LinkCard: React.FC<LinkCardProps> = ({
  to,
  title,
  description,
  icon,
  variant = 'default',
  size = 'large',
  className = '',
  onClick,
}) => {
  const getVariantStyles = (): {
    wrapper: string;
    container: string;
    title: string;
    description: string;
  } => {
    switch (variant) {
      case 'primary':
        return {
          wrapper: 'bg-primary-pink',
          container: 'bg-primary-pink',
          title: 'text-background-40',
          description: 'text-background-40',
        };
      case 'gradient':
        return {
          wrapper: 'bg-gradation',
          container: 'bg-background-40',
          title: 'text-gradation',
          description: 'text-secondary-purple-80',
        };
      case 'shadow':
        return {
          wrapper: 'shadow-basic',
          container: 'bg-background-40',
          title: 'text-gray700',
          description: 'text-gray700',
        };
      default:
        return {
          wrapper: 'bg-gray200',
          container: 'bg-background-40',
          title: 'text-gray700',
          description: 'text-gray700',
        };
    }
  };

  const getSizeStyles = (): {
    minHeight: string;
    padding: string;
    titleSize: string;
    descriptionSize: string;
    maxWidth: string;
  } => {
    switch (size) {
      case 'large':
        return {
          minHeight: 'min-h-[190px]',
          padding: 'py-[33px] px-[18px]',
          titleSize: 'text-2xl',
          descriptionSize: 'text-[13px]',
          maxWidth: 'max-w-[250px]',
        };
      case 'medium':
        return {
          minHeight: 'min-h-[127px]',
          padding: 'py-5 px-4',
          titleSize: 'text-[21px]',
          descriptionSize: 'text-xs',
          maxWidth: 'max-w-[110px]',
        };
      default:
        return {
          minHeight: 'min-h-[190px]',
          padding: 'py-[33px] px-[18px]',
          titleSize: 'text-2xl',
          descriptionSize: 'text-[13px]',
          maxWidth: 'max-w-[250px]',
        };
    }
  };

  const variantStyles = getVariantStyles();
  const sizeStyles = getSizeStyles();

  return (
    <Link
      to={to}
      className={`flex w-full h-full ${sizeStyles.minHeight} rounded-[17px] p-[1px] ${variantStyles.wrapper} ${className}`}
      onClick={onClick}
    >
      <div
        className={`flex ${sizeStyles.padding} w-full rounded-[16px] justify-between ${variantStyles.container}`}
      >
        <div
          className={`flex flex-col gap-[17px] w-full flex-[2] ${sizeStyles.maxWidth}`}
        >
          <h1
            className={`${sizeStyles.titleSize} font-semibold w-fit whitespace-pre-line ${variantStyles.title}`}
          >
            {title}
          </h1>
          {description && (
            <p
              className={`${sizeStyles.descriptionSize} whitespace-pre-line ${variantStyles.description}`}
            >
              {description}
            </p>
          )}
        </div>

        {icon && (
          <div className="relative w-full h-full flex-[1]">
            <img
              src={icon}
              alt="카드 이미지"
              className={`absolute right-0 ${
                size === 'medium' ? 'top-1/2 -translate-y-1/2' : 'bottom-0'
              }`}
            />
          </div>
        )}
      </div>
    </Link>
  );
};

export default LinkCard;
