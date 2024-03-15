import { DetailedHTMLProps, InputHTMLAttributes, ReactNode, forwardRef, useImperativeHandle, useRef } from 'react';
import clsx from 'clsx';

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
            '0 bg-surface-2 flex flex-row rounded-lg p-4 focus-within:ring focus-within:ring-opacity-50',
          className,
        )}
        onClick={focusInput}
      >
        {leftIcon && <div className="*:text-text-muted mr-3 h-[14px] w-[14px]">{leftIcon}</div>}
        <input
          ref={inputRef}
          className={clsx(
            'w-full',
            'text-text-basetext-text-base placeholder-text-muted font-plex-mono font-medium outline-none',
            variant === 'primary' && 'bg-transparent',
            variant === 'secondary' && 'bg-surface-4  rounded-lg px-4 py-2 text-sm',
            inputClassName,
          )}
          {...props}
        />
      </div>
    );
  },
);

Input.displayName = 'Input';
