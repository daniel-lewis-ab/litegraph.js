import { FontAwesomeIconProps } from '@fortawesome/react-fontawesome';
import { Link, To } from 'react-router-dom';
import { ReactNode } from 'react';
import clsx from 'clsx';
import { Icon } from '../icon/Icon';

type LinkProps = {
  to?: To;
  asLink?: boolean;
};

type ItemProps = LinkProps & {
  children: ReactNode;
  icon?: FontAwesomeIconProps['icon'];
  className?: string;
  onClick?(): void;
};

const Item = ({ asLink, to, icon, children, className, onClick }: ItemProps) => {
  const ButtonOrLink = asLink && to ? Link : 'button';

  return (
    <li>
      <ButtonOrLink
        to={to!}
        target="_blank"
        className={clsx(
          'duration-400 flex w-full items-center rounded-md p-2 transition-all hover:bg-surface-5',
          className,
        )}
        onClick={onClick}
        type="button"
      >
        {icon && <Icon size={16} icon={icon} className="mr-2.5 text-surface-7 *:text-text-muted" />}
        <span className="font-medium">{children}</span>
      </ButtonOrLink>
    </li>
  );
};

export const OptionsList = ({ children, onClick }: { children: ReactNode; onClick?: () => void }) => (
  <ul className="rounded-lg border border-surface-4 bg-surface-4 p-1 shadow-lg" onClick={onClick}>
    {children}
  </ul>
);

OptionsList.Item = Item;
