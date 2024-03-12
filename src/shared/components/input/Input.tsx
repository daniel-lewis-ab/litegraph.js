import { DetailedHTMLProps, InputHTMLAttributes, ReactNode, forwardRef } from 'react';
import clsx from 'clsx';

export type InputProps = DetailedHTMLProps<InputHTMLAttributes<HTMLInputElement>, HTMLInputElement> & {
  leftIcon?: ReactNode;
  inputClassName?: string;
  variant?: 'primary' | 'secondary';
};

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ leftIcon, className, inputClassName, variant = 'primary', ...props }, ref) => (
    <label
      className={clsx(
        variant === 'primary' &&
          '0 bg-surface-100 flex flex-row rounded-lg p-4 focus-within:ring focus-within:ring-opacity-50',
        className,
      )}
    >
      {leftIcon && <div className="mr-3 h-[14px] w-[14px] *:text-foreground-muted">{leftIcon}</div>}
      <input
        ref={ref}
        className={clsx(
          'w-full',
          'bg-transparent text-foreground-muted placeholder-foreground-muted outline-none',
          variant === 'secondary' && 'rounded-lg border border-border-default px-4 py-2 text-sm',
          inputClassName,
        )}
        {...props}
      />
    </label>
  ),
);

Input.displayName = 'Input';
