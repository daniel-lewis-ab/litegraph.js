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
        'duration-400 hover:bg-surface-5 flex w-full items-center rounded-md p-2 transition-all',
        className,
      )}
      onClick={onClick}
      type="button"
    >
      <Icon size={16} icon={icon} className="text-surface-7 *:text-surface-8 mr-2.5" />
      <span className="font-medium">{children}</span>
    </button>
  </li>
);

export const OptionsList = ({ children, onClick }: { children: ReactNode; onClick?: () => void }) => (
  <ul className="border-surface-4 bg-surface-4 rounded-lg border p-1 shadow-lg" onClick={onClick}>
    {children}
  </ul>
);

OptionsList.Item = Item;
