import { ReactNode } from 'react';
import clsx from 'clsx';

type ButtonProps = {
  children: ReactNode;
  className?: string;
  // @TODO: Add variants 'ghost' | 'soft' | 'ringed' | 'disabled'
  variant?: 'filled';
  color?: 'primary' | 'secondary' | 'tertiary' | 'surface' | 'success' | 'error';
  // No difference between md and lg on designs
  size?: 'sm' | 'md' | 'xl';
  disabled?: boolean;
  onClick?: () => void;
};

// TBD Later, not all buttons match the one used on designs so it's to be unified first
export const Button = ({ children, size = 'md', color, className }: ButtonProps) => (
  <button
    className={clsx(
      'rounded-xl font-medium',
      size === 'xl' && 'px-6 py-3',
      size === 'md' && 'px-4 py-2',
      size === 'sm' && 'px-6 py-2',
      color === 'primary' && 'text-on-primary bg-primary',
      color === 'secondary' && 'text-on-secondary bg-secondary',
      color === 'tertiary' && 'text-on-tertiary bg-tertiary',
      color === 'surface' && 'text-foreground bg-surface',
      color === 'success' && 'text-on-success bg-success',
      color === 'error' && 'text-on-error bg-error',
      className,
      // color === 'primary' && variant === 'soft' && 'bg-[]'
    )}
  >
    {children}
  </button>
);
