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
      <label className="mb-2 mt-4 block font-medium" htmlFor={htmlFor}>
        {label}
      </label>
    )}
    {children}
    {!errorMsg && hint && <p className="mt-2 text-xs">{hint}</p>}
    {errorMsg && (
      <p className="*:text-error-10 text-error-10 mt-2 text-xs">
        <Icon size={12} icon={faCircleExclamation} /> {errorMsg}
      </p>
    )}
  </div>
);
