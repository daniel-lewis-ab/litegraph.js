import { Icon, IconProps } from '@/shared/components/icon/Icon';
import { faXmark } from '@awesome.me/kit-b6cda292ae/icons/classic/regular';
import clsx from 'clsx';
import { ReactNode } from 'react';

type EditorSectionProps = {
  icon?: IconProps['icon'];
  title: string;
  children: ReactNode;
  className?: string;
  onClose(): void;
};

export const EditorSection = ({ children, title, icon, className, onClose }: EditorSectionProps) => (
  <div className={clsx('flex h-full flex-col p-2', className)}>
    <div className="mb-4 flex flex-row items-center justify-between">
      <div className="flex flex-row items-center">
        {icon && <Icon icon={icon} size={20} />}
        <p className="ml-2 font-medium">{title}</p>
      </div>
      <button onClick={onClose}>
        <Icon icon={faXmark} size={20} className="*:text-icon-muted" />
      </button>
    </div>
    {children}
  </div>
);
