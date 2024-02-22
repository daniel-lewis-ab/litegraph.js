import { Icon } from '@/shared/components/icon/Icon';
import { Logo } from '../icons/Logo';
import { LayoutProps } from './Layout.types';
import {
  faCircleUser,
  faDatabase,
  faGear,
  faRocket,
  faCodeBranch,
  faHeartPulse,
} from '@awesome.me/kit-b6cda292ae/icons/classic/light';

export const Layout = ({ children }: LayoutProps) => (
  <div className="flex flex-row min-h-screen">
    <div className="border-r border-r-[#626289] w-[64px] flex flex-col items-center justify-between">
      <Logo className="mt-2" />
      <div className="flex flex-col *:my-[20px]">
        <Icon size={30} icon={faRocket} color="#9F9FC5" />
        <Icon size={30} icon={faCodeBranch} color="#9F9FC5" />
        <Icon size={30} icon={faDatabase} color="#9F9FC5" />
        <Icon size={30} icon={faHeartPulse} color="#9F9FC5" />
      </div>
      <div className="h-[64px]"></div>
    </div>
    <div className="flex flex-col flex-grow">
      <header className="flex flex-row justify-between items-center border-b border-[#626289] h-[64px] px-6">
        <div className="flex flex-row items-center">
          <p className="pl-3 text-2xl font-medium">Workflows</p>
        </div>
        <div className="flex flex-row *:mx-4">
          <Icon size={30} icon={faGear} color="#9F9FC5" />
          <Icon size={30} icon={faCircleUser} color="#9F9FC5" />
        </div>
      </header>
      <main className="flex grow p-4">{children}</main>
    </div>
  </div>
);
