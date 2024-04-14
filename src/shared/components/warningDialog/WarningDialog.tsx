import { ReactNode } from 'react';
import { Dialog } from '@/shared/components/dialog/Dialog';
import { Icon } from '@/shared/components/icon/Icon';
import { faCircleExclamation } from '@awesome.me/kit-b6cda292ae/icons/sharp/light';

export const WarningDialogContent = ({
  title,
  desc,
  children,
}: {
  title: string;
  desc?: string;
  children: ReactNode;
}) => (
  <div className="flex flex-col items-center">
    <div className="mb-6 flex rounded-full bg-surface-4 p-3 *:text-error-9">
      <Icon icon={faCircleExclamation} size={28} />
    </div>
    <Dialog.Title>{title}</Dialog.Title>
    <p className="mb-6 mt-1 text-center text-sm text-text-muted">{desc}</p>
    <div className="flex w-full flex-col">{children}</div>
  </div>
);
