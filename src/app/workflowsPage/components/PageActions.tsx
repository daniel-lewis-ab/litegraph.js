import { Link, To } from 'react-router-dom';
import { Icon, IconProps } from '../../../shared/components/icon/Icon';

type PageActionProps = {
  to?: To;
  icon: IconProps['icon'];
  text: string;
  onClick?: () => void;
};

function Action({ to, icon, text, onClick }: PageActionProps) {
  return to ? (
    <Link
      to={to}
      className="group flex flex-row items-center rounded-xl border border-surface-4 px-4 py-2 font-medium hover:border-surface-6"
    >
      <Icon icon={icon} size={20} className="mr-3 rounded-full bg-surface-3 p-4 group-hover:bg-surface-4" />
      {text}
    </Link>
  ) : (
    <button className="bg-surface-3 p-4 text-icon-muted group-hover:bg-surface-5" onClick={onClick} type="button">
      <Icon icon={icon} size={20} />
      {text}
    </button>
  );
}

export const PageActions = ({ children }: { children: React.ReactNode }) => {
  return <div className="mb-8 flex flex-col *:mb-2 *:mr-3 md:flex-row md:*:mb-0">{children}</div>;
};

PageActions.Action = Action;
