import { Icon } from '../icon/Icon';
import { ReactNode } from 'react';
import { FontAwesomeIconProps } from '@fortawesome/react-fontawesome';

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
    <button className="flex w-full items-center rounded-md p-2 transition-opacity hover:opacity-85" onClick={onClick}>
      <Icon size={16} icon={icon} className="*:text-foreground-muted mr-2.5" />
      <span className="font-semibold">{children}</span>
    </button>
  </li>
);

export const OptionsList = ({ children }: { children: ReactNode }) => (
  <ul className="border-muted rounded-md bg-surface-200 p-1">{children}</ul>
);

OptionsList.Item = Item;
