import type { ReactNode } from 'react';
import { Link } from 'react-router-dom';
import AnimatedWrapper from '@/components/common/AnimatedWrapper';

interface LinkCardProps {
  to: string;
  title: string | ReactNode;
  description?: string | ReactNode;
  icon?: string;
  variant?: 'default' | 'primary' | 'gradient' | 'shadow';
  size?: 'large' | 'medium';
  className?: string;
}

const LinkCard: React.FC<LinkCardProps> = ({
  to,
  title,
  description,
  icon,
  variant = 'default',
  size = 'large',
  className = '',
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
          title: 'text-gradation ',
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
    // maxWidth: string;
  } => {
    switch (size) {
      case 'large':
        return {
          minHeight: 'min-h-[190px]',
          padding: 'py-[28px] px-5',
          titleSize: 'text-2xl',
          descriptionSize: 'text-[13px]',
          // maxWidth: 'max-w-[250px]',
        };
      case 'medium':
        return {
          minHeight: 'min-h-[127px]',
          padding: 'py-5 px-4',
          titleSize: 'text-[21px]',
          descriptionSize: 'text-xs',
          // maxWidth: 'max-w-[110px]',
        };
      default:
        return {
          minHeight: 'min-h-[190px]',
          padding: 'py-[33px] px-[18px]',
          titleSize: 'text-2xl',
          descriptionSize: 'text-[13px]',
          // maxWidth: 'max-w-[250px]',
        };
    }
  };

  const variantStyles = getVariantStyles();
  const sizeStyles = getSizeStyles();

  return (
    <AnimatedWrapper
      className={`w-full h-full ${sizeStyles.minHeight} `}
      to={to}
    >
      <Link
        to={to}
        className={`relative flex w-full h-full ${sizeStyles.minHeight} rounded-[17px] p-[1px] ${variantStyles.wrapper} ${className}`}
      >
        <div
          className={`relative w-full rounded-[16px] ${variantStyles.container} ${sizeStyles.padding}`}
        >
          {/* 텍스트 */}
          <div>
            <div className={`flex flex-col gap-[17px] `}>
              <h1
                className={`inline-block w-fit ${sizeStyles.titleSize} font-semibold whitespace-pre-line ${variantStyles.title}`}
              >
                {title}
              </h1>
              {description && (
                <p
                  className={`w-[70%] font-normal ${sizeStyles.descriptionSize} whitespace-pre-line ${variantStyles.description}`}
                >
                  {description}
                </p>
              )}
            </div>
          </div>
          {icon && (
            <img
              src={icon}
              alt="카드 아이콘"
              className={`absolute ${'bottom-[28px]'} right-5 ${size === 'medium' ? 'w-[53px]' : 'w-[102px]'}`}
            />
          )}
        </div>
      </Link>
    </AnimatedWrapper>
  );
};

export default LinkCard;
