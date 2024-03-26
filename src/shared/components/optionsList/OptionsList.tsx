import { FontAwesomeIconProps } from '@fortawesome/react-fontawesome';
import { ReactNode } from 'react';
import clsx from 'clsx';
import { Icon } from '../icon/Icon';

const Item = ({
  icon,
  children,
  className,
  onClick,
}: {
  icon: FontAwesomeIconProps['icon'];
  children: ReactNode;
  className?: string;
  onClick(): void;
}) => (
  <li>
    <button
      className={clsx(
        'duration-400 flex w-full items-center rounded-md p-2 transition-all hover:bg-surface-5',
        className,
      )}
      onClick={onClick}
      type="button"
    >
      <Icon size={16} icon={icon} className="mr-2.5 text-surface-7 *:text-text-muted" />
      <span className="font-medium">{children}</span>
    </button>
  </li>
);

export const OptionsList = ({ children, onClick }: { children: ReactNode; onClick?: () => void }) => (
  <ul className="rounded-lg border border-surface-4 bg-surface-4 p-1 shadow-lg" onClick={onClick}>
    {children}
  </ul>
);

OptionsList.Item = Item;
