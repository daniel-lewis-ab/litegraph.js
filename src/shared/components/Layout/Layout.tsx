import { Icon } from '@/shared/components/icon/Icon';
import { Logo } from '../icons/Logo';
import { LayoutProps } from './Layout.types';
import { useAuth } from '@/hooks/useAuth/useAuth';
import { NavLink, useNavigate } from 'react-router-dom';
import { Popover, PopoverTrigger, PopoverContent } from '@radix-ui/react-popover';
import clsx from 'clsx';
import {
  faDiagramProject,
  faRocket,
  faDatabase,
  faWavePulse,
  faCircleUser,
  faRightFromBracket,
} from '@awesome.me/kit-b6cda292ae/icons/sharp/light';
import { OptionsList } from '../optionsList/OptionsList';

export const Layout = ({ children }: LayoutProps) => {
  const navigate = useNavigate();
  const { logout } = useAuth();

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  return (
    <div className="flex min-h-screen flex-row">
      <div className="border-r-border-default sticky top-0 flex max-h-screen min-w-[64px] flex-col items-center justify-between border-r">
        <NavLink to="/">
          <Logo className="mt-2" />
        </NavLink>
        <nav className="flex flex-col *:my-[20px]">
          <NavLink to="/" className={({ isActive }) => clsx(isActive ? '*:text-foreground' : 'text-secondary')}>
            <Icon size={30} icon={faDiagramProject} />
          </NavLink>
          <NavLink
            to="/not-implemented"
            className={({ isActive }) => clsx(isActive ? '*:text-foreground' : '*:text-secondary')}
          >
            <Icon size={30} icon={faRocket} />
          </NavLink>
          <NavLink
            to="/not-implemented-1"
            className={({ isActive }) => clsx(isActive ? '*:text-foreground' : '*:text-secondary')}
          >
            <Icon size={30} icon={faDatabase} />
          </NavLink>
          <NavLink
            to="/not-implemented-2"
            className={({ isActive }) => clsx(isActive ? '*:text-foreground' : '*:text-secondary')}
          >
            <Icon size={30} icon={faWavePulse} />
          </NavLink>
        </nav>
        <div className="h-[64px]"></div>
      </div>
      <div className="flex flex-grow flex-col">
        <header className="border-b-border-default sticky top-0 flex h-[64px] min-h-[64px] flex-row items-center justify-between border-b bg-surface px-6">
          <div className="flex flex-row items-center">
            <p className="text-2xl font-medium">Workflows</p>
          </div>
          <div>
            <Popover>
              <PopoverTrigger asChild>
                <button>
                  <Icon size={30} icon={faCircleUser} className="text-secondary" />
                </button>
              </PopoverTrigger>
              <PopoverContent side="bottom" align="end">
                <OptionsList>
                  <OptionsList.Item icon={faRightFromBracket} onClick={handleLogout}>
                    Logout
                  </OptionsList.Item>
                </OptionsList>
              </PopoverContent>
            </Popover>
          </div>
        </header>
        <main className="flex w-full grow p-4">{children}</main>
      </div>
    </div>
  );
};
