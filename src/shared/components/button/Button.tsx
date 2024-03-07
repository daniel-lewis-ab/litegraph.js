import { ReactNode } from 'react';
import clsx from 'clsx';
import './Button.scss';

type ButtonProps = {
  children: ReactNode;
  className?: string;
  variant?: 'filled' | 'ghost' | 'soft' | 'glass' | 'ringed' | 'disabled';
  color?: 'primary' | 'secondary' | 'tertiary' | 'surface' | 'success' | 'error';
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  disabled?: boolean;
  type?: 'button' | 'submit';
  onClick?: () => void;
};

export const Button = ({
  children,
  size = 'md',
  color = 'primary',
  variant,
  className,
  onClick,
  disabled,
  type = 'button',
}: ButtonProps) => (
  <button
    type={type}
    className={clsx(
      'button',
      'rounded-xl font-medium',
      size === 'xl' && 'px-4 py-[13px] text-xl',
      size === 'lg' && 'px-4 py-[10.5px] text-lg',
      size === 'md' && 'px-4 py-[10px]',
      size === 'sm' && 'px-3 py-2 text-sm',
      size === 'xs' && 'px-2 py-[7px] text-sm',
      variant && 'button--' + variant,
      color && 'button--color-' + color,
      disabled && 'button--disabled',
      className,
    )}
    onClick={onClick}
  >
    {children}
  </button>
);
