import clsx from 'clsx';
import { ReactNode } from 'react';
import { Icon, IconProps } from '../icon/Icon';
import { LoaderIcon } from '../loaderIcon/LoaderIcon';
import './Button.scss';
import { Link, To } from 'react-router-dom';

type LinkProps = {
  to?: To;
  asLink?: boolean;
};

type ButtonProps = LinkProps & {
  children: ReactNode;
  className?: string;
  variant?: 'filled' | 'ghost' | 'soft' | 'glass' | 'ringed';
  color?: 'primary' | 'secondary' | 'success' | 'error' | 'warning';
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  disabled?: boolean;
  type?: 'button' | 'submit';
  isLoading?: boolean;
  leftIcon?: IconProps['icon'];
  rightIcon?: IconProps['icon'];
  onClick?: () => void;
};

const iconSize = (size: string) => {
  return size === 'xl' ? 20 : size === 'lg' ? 18 : size === 'md' ? 14 : size === 'sm' ? 12 : 11;
};

export const Button = ({
  children,
  size = 'md',
  color = 'primary',
  variant,
  leftIcon,
  rightIcon,
  className,
  onClick,
  disabled,
  type = 'button',
  isLoading,
  asLink,
  to,
}: ButtonProps) => {
  const ButtonOrLink = asLink && to ? Link : 'button';

  return (
    <ButtonOrLink
      to={to!}
      type={type}
      className={clsx(
        'button',
        'rounded-lg font-medium',
        size === 'xs' && 'space-x-1 rounded-md px-2 py-1 text-xs',
        size === 'sm' && 'space-x-1 px-3 py-1.5 text-sm',
        size === 'xl' && 'space-x-2 rounded-xl px-4 py-[13px] text-xl',
        size === 'lg' && 'space-x-2 rounded-xl px-4 py-[10.5px] text-lg',
        size === 'md' && 'space-x-2 rounded-lg px-4 py-2',

        variant && `button--${variant}`,
        color && `button--color-${color}`,
        disabled && 'button--disabled',
        className,
      )}
      onClick={onClick}
      disabled={disabled ?? isLoading}
    >
      {leftIcon && <Icon icon={leftIcon} size={iconSize(size)} />}
      {isLoading ? <LoaderIcon /> : <span>{children}</span>}
      {rightIcon && <Icon icon={rightIcon} size={iconSize(size)} />}
    </ButtonOrLink>
  );
};
