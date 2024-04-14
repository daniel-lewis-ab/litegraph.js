import clsx from 'clsx';
import { DetailedHTMLProps, InputHTMLAttributes, ReactNode, forwardRef, useImperativeHandle, useRef } from 'react';

export type InputProps = DetailedHTMLProps<InputHTMLAttributes<HTMLInputElement>, HTMLInputElement> & {
  leftIcon?: ReactNode;
  inputClassName?: string;
  variant?: 'primary' | 'secondary';
};

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ leftIcon, className, inputClassName, variant = 'primary', ...props }, ref) => {
    const inputRef = useRef<HTMLInputElement>(null);

    const focusInput = () => {
      inputRef.current?.focus();
    };

    useImperativeHandle(ref, () => inputRef.current as unknown as HTMLInputElement);

    return (
      <div
        className={clsx(
          variant === 'primary' &&
            '0 flex flex-row rounded-lg bg-surface-2 p-4 focus-within:ring focus-within:ring-opacity-50',
          className,
        )}
        onClick={focusInput}
      >
        {leftIcon && <div className="mr-3 h-[14px] w-[14px] *:text-text-muted">{leftIcon}</div>}
        <input
          ref={inputRef}
          className={clsx(
            'w-full',
            'font-medium text-text-base placeholder-text-muted outline-none',
            variant === 'primary' && 'bg-transparent',
            variant === 'secondary' && 'rounded-lg  bg-surface-4 px-4 py-2 text-sm',
            inputClassName,
          )}
          {...props}
        />
      </div>
    );
  },
);

Input.displayName = 'Input';
