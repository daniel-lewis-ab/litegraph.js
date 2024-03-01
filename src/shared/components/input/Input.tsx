import { DetailedHTMLProps, InputHTMLAttributes, ReactNode } from 'react';
import clsx from 'clsx';

export type InputProps = DetailedHTMLProps<InputHTMLAttributes<HTMLInputElement>, HTMLInputElement> & {
  leftIcon?: ReactNode;
  inputClassName?: string;
};

export const Input = ({ leftIcon, className, inputClassName, ...props }: InputProps) => (
  <label
    className={clsx(
      'focus-within:ring-blue-500 flex flex-row rounded-lg bg-surface-100 p-4 focus-within:ring focus-within:ring-opacity-50',
      className,
    )}
  >
    <div className="*:text-foreground-muted mr-3 h-[14px] w-[14px]">{leftIcon}</div>
    <input
      className={clsx('text-foreground-muted bg-transparent placeholder-foreground-muted outline-none', inputClassName)}
      {...props}
    />
  </label>
);
