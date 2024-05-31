import { ReactNode } from 'react';
import { faCircleExclamation } from '@awesome.me/kit-b6cda292ae/icons/sharp/light';
import { Icon } from '../icon/Icon';

type FormFieldProps = {
  children: ReactNode;
  className?: string;
  label?: string;
  htmlFor?: string;
  hint?: string;
  errorMsg?: string;
};

export const FormField = ({ children, className, label, hint, htmlFor, errorMsg }: FormFieldProps) => (
  <div className={className}>
    {label && (
      <label className="mb-2 mt-4 block text-sm font-medium text-text-base" htmlFor={htmlFor}>
        {label}
      </label>
    )}
    {children}
    {!errorMsg && hint && <p className="mt-2 text-xs">{hint}</p>}
    {errorMsg && (
      <p className="mt-2 text-xs text-error-10 *:text-error-10">
        <Icon size={12} icon={faCircleExclamation} /> {errorMsg}
      </p>
    )}
  </div>
);
