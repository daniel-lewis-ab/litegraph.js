import { Icon } from '@/shared/components/icon/Icon';
import { Logo } from '../icons/Logo';
import { LayoutProps } from './Layout.types';
import { useAuth } from '@/hooks/useAuth/useAuth';
import { useNavigate } from 'react-router-dom';
import {
  faCodeBranch,
  faRocket,
  faDatabase,
  faWavePulse,
  faCircleUser,
} from '@awesome.me/kit-b6cda292ae/icons/sharp/light';

export const Layout = ({ children }: LayoutProps) => {
  const navigate = useNavigate();
  const { logout } = useAuth();

  const handleLogout = async () => {
    await logout();
    navigate('/login'); // Przekierowanie na stronę logowania po wylogowaniu
  };

  return (
    <div className="flex min-h-screen flex-row">
      <div className="flex w-[64px] flex-col items-center justify-between border-r border-r-[#313155]">
        <Logo className="mt-2" />
        <div className="flex flex-col *:my-[20px]">
          <Icon size={30} icon={faCodeBranch} className="text-secondary" />
          <Icon size={30} icon={faRocket} className="text-secondary" />
          <Icon size={30} icon={faDatabase} className="text-secondary" />
          <Icon size={30} icon={faWavePulse} className="text-secondary" />
        </div>
        <div className="h-[64px]"></div>
      </div>
      <div className="flex flex-grow flex-col">
        <header className="flex h-[64px] flex-row items-center justify-between border-b border-[#313155] px-6">
          <div className="flex flex-row items-center">
            <p className="pl-3 text-2xl font-medium">Workflows</p>
          </div>
          <div className="flex flex-row *:mx-4">
            <Icon size={30} icon={faCircleUser} className="text-secondary" />
            <button onClick={handleLogout}>Logout</button>
          </div>
        </header>
        <main className="flex w-full grow p-4">{children}</main>
      </div>
    </div>
  );
};
