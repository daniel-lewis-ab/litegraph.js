import { CLEAR_TOKENS } from '@/context/authContext/authReducer';
import { useAuth } from '@/hooks/useAuth/useAuth';
import useTheme from '@/hooks/useTheme/useTheme';
import { Icon, IconProps } from '@/shared/components/icon/Icon';
import Tooltip from '@/shared/components/tooltip/Tooltip';
import { faDiscord } from '@awesome.me/kit-b6cda292ae/icons/classic/brands';
import {
  faArrowRightFromBracket,
  faBookOpenCover,
  faDiagramProject,
  faMoonStars,
  faRocket,
  faSunBright,
  faUserCircle,
} from '@awesome.me/kit-b6cda292ae/icons/sharp/light';
import { useQueryClient } from '@tanstack/react-query';
import clsx from 'clsx';
import { ReactNode } from 'react';
import { NavLink } from 'react-router-dom';
import { Logo } from '../icons/Logo';

const ICON_SIZE = 20;

export const SideMenu = () => {
  const queryClient = useQueryClient();
  const { dispatch } = useAuth();
  const { theme, switchTheme } = useTheme();

  const handleLogout = () => {
    dispatch({ type: CLEAR_TOKENS });
    queryClient.clear();
  };

  return (
    <Tooltip.Provider>
      <Tooltip.Root>
        <nav className="sticky top-0 z-10 flex max-h-screen min-w-[80px] flex-col justify-between space-y-4 bg-surface-3 dark:bg-surface-2">
          <div className="flex flex-col">
            <SideMenuButton to="/">
              <Logo className="fill-text-base" />
            </SideMenuButton>

            <SideMenuButton to="/workflows" tooltip="Workflows">
              <Icon size={ICON_SIZE} icon={faDiagramProject} />
            </SideMenuButton>

            <SideMenuButton to="/deployments" tooltip="Deployments">
              <Icon size={ICON_SIZE} icon={faRocket} />
            </SideMenuButton>
          </div>

          <div className="flex flex-col">
            <SideMenuButton tooltip="Docs">
              <Icon size={ICON_SIZE} icon={faBookOpenCover} />
            </SideMenuButton>

            <SideMenuButton onClick={handleLogout} tooltip="Logout" tooltipIcon={faArrowRightFromBracket}>
              <Icon size={ICON_SIZE} icon={faUserCircle} />
            </SideMenuButton>

            <SideMenuButton to="https://discord.gg/saltai" tooltip="Salt AI on Discord">
              <Icon size={ICON_SIZE} icon={faDiscord} />
            </SideMenuButton>

            <SideMenuButton onClick={switchTheme} tooltip="Toggle theme">
              <Icon size={ICON_SIZE} icon={theme === 'dark' ? faMoonStars : faSunBright} />
            </SideMenuButton>
          </div>
        </nav>
      </Tooltip.Root>
    </Tooltip.Provider>
  );
};

type SideMenuButtonProps = {
  children: ReactNode;
  to?: string;
  tooltip?: string;
  tooltipIcon?: IconProps['icon'];
  onClick?: () => void;
};

const SideMenuButton = ({ children, to, onClick, tooltip, tooltipIcon }: SideMenuButtonProps) => {
  return to ? (
    <Tooltip.Root delayDuration={300}>
      <Tooltip.Trigger>
        <NavLink
          to={to}
          className={({ isActive }) =>
            clsx(
              'flex h-[80px] w-[80px] flex-col content-center items-center justify-center p-2',
              isActive ? '*:text-surface-12' : '*:text-surface-8 *:hover:text-surface-10',
            )
          }
        >
          {children}
        </NavLink>
      </Tooltip.Trigger>
      {tooltip && (
        <Tooltip.Content side={'right'} sideOffset={12}>
          {tooltipIcon && <Icon icon={tooltipIcon} className="text-surface-10" size={12} />}
          <span>{tooltip}</span>
        </Tooltip.Content>
      )}
    </Tooltip.Root>
  ) : (
    <Tooltip.Root delayDuration={300}>
      <Tooltip.Trigger>
        <button onClick={onClick} className="group flex h-[80px] w-[80px] p-2" type="button">
          <div className="flex h-full w-full items-center justify-center *:text-surface-8 *:hover:text-surface-10">
            {children}
          </div>
        </button>
      </Tooltip.Trigger>
      {tooltip && (
        <Tooltip.Content side={'right'} sideOffset={12}>
          {tooltipIcon && <Icon icon={tooltipIcon} className="text-surface-10" size={12} />}
          <span>{tooltip}</span>
        </Tooltip.Content>
      )}
    </Tooltip.Root>
  );
};
