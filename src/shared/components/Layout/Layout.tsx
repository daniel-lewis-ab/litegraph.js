import { Icon } from '@/shared/components/icon/Icon';
import { Logo } from '../icons/Logo';
import { LayoutProps } from './Layout.types';
import { NavLink } from 'react-router-dom';
import { Popover, PopoverTrigger, PopoverContent } from '@radix-ui/react-popover';
import { toast } from 'react-hot-toast';
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
import { useAuth } from '@/hooks/useAuth/useAuth';
import { CLEAR_TOKENS } from '@/context/authContext/authReducer';
import { Button } from '../button/Button';

export const Layout = ({ children }: LayoutProps) => {
  const { dispatch } = useAuth();

  const handleLogout = () => {
    dispatch({ type: CLEAR_TOKENS });
  };

  return (
    <div className="flex min-h-screen flex-row">
      <div className="sticky top-0 flex max-h-screen min-w-[64px] flex-col items-center justify-between border-r border-r-border-default">
        <NavLink to="/">
          <Logo className="mt-2" />
        </NavLink>
        <nav className="flex flex-col *:my-[20px]">
          <NavLink to="/" end className={({ isActive }) => clsx(isActive ? '*:text-foreground' : '*:text-secondary')}>
            <Icon size={30} icon={faDiagramProject} />
          </NavLink>
          <NavLink
            to="/not-implemented"
            end
            className={({ isActive }) => clsx(isActive ? '*:text-foreground' : '*:text-secondary')}
          >
            <Icon size={30} icon={faRocket} />
          </NavLink>
          <NavLink
            to="/not-implemented-1"
            end
            className={({ isActive }) => clsx(isActive ? '*:text-foreground' : '*:text-secondary')}
          >
            <Icon size={30} icon={faDatabase} />
          </NavLink>
          <NavLink
            to="/not-implemented-2"
            end
            className={({ isActive }) => clsx(isActive ? '*:text-foreground' : '*:text-secondary')}
          >
            <Icon size={30} icon={faWavePulse} />
          </NavLink>
        </nav>
        <div className="h-[64px]"></div>
      </div>
      <div className="flex flex-grow flex-col">
        <header className="sticky top-0 z-20 flex h-[64px] min-h-[64px] flex-row items-center justify-between border-b border-b-border-default bg-surface px-6">
          <div className="flex flex-row items-center">
            <p className="text-2xl font-medium">Workflows</p>
          </div>
          <div className="flex flex-row">
            <Button variant="soft" color="secondary" size="sm" className="mr-6" onClick={() => toast.error('Error')}>
              Docs
            </Button>
            <Button
              variant="soft"
              color="secondary"
              size="sm"
              className="mr-6"
              onClick={() => toast.success('Success')}
            >
              Feedback
            </Button>
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
