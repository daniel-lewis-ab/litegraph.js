import { FontAwesomeIconProps } from '@fortawesome/react-fontawesome';
import { ReactNode } from 'react';
import { Icon } from '../icon/Icon';

const Item = ({
  icon,
  children,
  onClick,
}: {
  icon: FontAwesomeIconProps['icon'];
  children: ReactNode;
  onClick(): void;
}) => (
  <li>
    <button
      className="duration-400 flex w-full items-center rounded-md p-2 transition-all hover:bg-surface-5"
      onClick={onClick}
      type="button"
    >
      <Icon size={16} icon={icon} className="mr-2.5 text-surface-7 *:text-surface-8" />
      <span className="font-medium">{children}</span>
    </button>
  </li>
);

export const OptionsList = ({ children }: { children: ReactNode }) => (
  <ul className="rounded-lg border border-surface-4 bg-surface-4 p-1 shadow-lg">{children}</ul>
);

OptionsList.Item = Item;
