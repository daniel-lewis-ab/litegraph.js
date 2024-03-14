import clsx from 'clsx';
import { DetailedHTMLProps, InputHTMLAttributes, ReactNode, forwardRef } from 'react';

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
        '0 flex flex-row rounded-lg bg-surface-2 p-4 focus-within:ring focus-within:ring-opacity-50',
        className,
      )}
    >
      {leftIcon && <div className="*:text-text-muted mr-3 h-[14px] w-[14px]">{leftIcon}</div>}
      <input
        ref={ref}
        className={clsx(
          'w-full',
          'text-text-muted placeholder-text-muted bg-transparent outline-none',
          variant === 'secondary' && 'rounded-lg border border-border-default px-4 py-2 text-sm',
          inputClassName,
        )}
        {...props}
      />
    </label>
  ),
);

Input.displayName = 'Input';
