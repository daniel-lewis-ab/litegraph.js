import clsx from 'clsx';
import { ReactNode } from 'react';

export const ContentHeader = ({
  icon,
  children,
  variant,
}: {
  icon: ReactNode;
  children: ReactNode;
  variant: 'big' | 'small';
  hideIcon?: boolean;
}) => (
  <div className={clsx('mb-2 flex items-center', variant === 'big' && 'flex-col justify-center')}>
    {/* @TODO I icon */}
    {icon && (
      <div
        className={clsx(
          'flex items-center justify-center',
          variant === 'big' && 'mb-6  h-[56px] w-[56px]  rounded-full bg-surface-4 *:!h-[30px] *:!w-[30px]',
        )}
      >
        {icon}
      </div>
    )}
    <p className={clsx('mx-2 text-base font-medium', variant === 'big' && 'text-xl font-semibold')}>{children}</p>
  </div>
);
