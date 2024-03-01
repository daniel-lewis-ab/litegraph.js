import { DetailedHTMLProps, InputHTMLAttributes, ReactNode } from 'react';

export type InputProps = DetailedHTMLProps<InputHTMLAttributes<HTMLInputElement>, HTMLInputElement> & {
  leftIcon?: ReactNode;
};

export const Input = ({ leftIcon, ...props }: InputProps) => (
  <label className="focus-within:ring-blue-500 flex flex-row rounded-lg bg-surface-100 p-4 focus-within:ring focus-within:ring-opacity-50">
    <div className="*:text-foreground-muted mr-3 h-[14px] w-[14px]">{leftIcon}</div>
    <input className="text-foreground-muted bg-transparent placeholder-foreground-muted outline-none" {...props} />
  </label>
);
