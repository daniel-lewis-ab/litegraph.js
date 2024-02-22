import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Logo } from '../icons/Logo';
import { LayoutProps } from './Layout.types';
import {
  faCircleUser,
  faDatabase,
  faGear,
  faRocket,
  faCodeBranch,
  faHeartPulse,
} from '@fortawesome/free-solid-svg-icons';
import { Badge } from '@/shared/badge/Badge';

export const Layout = ({ children }: LayoutProps) => (
  <div className="flex flex-row min-h-screen">
    <div className="border-r border-r-[#626289] w-[64px] flex flex-col items-center justify-between">
      <Logo className="mt-2" />
      <div className="flex flex-col">
        <div className="h-[64px]">
          <FontAwesomeIcon width={30} className="h-[30px]" icon={faRocket} color="#9F9FC5" />
        </div>
        <div className="h-[64px]">
          <FontAwesomeIcon width={30} className="h-[30px]" icon={faCodeBranch} color="#9F9FC5" />
        </div>
        <div className="h-[64px]">
          <FontAwesomeIcon width={30} className="h-[30px]" icon={faDatabase} color="#9F9FC5" />
        </div>
        <div className="h-[64px]">
          <FontAwesomeIcon width={30} className="h-[30px]" icon={faHeartPulse} color="#9F9FC5" />
        </div>
      </div>
      <div className="h-[64px]"></div>
    </div>
    <div className="flex flex-col flex-grow">
      <header className="flex flex-row justify-between items-center border-b border-[#626289] h-[64px] px-6">
        <div className="flex flex-row items-center">
          <Badge>Free</Badge>
          <p className="pl-3 text-2xl font-medium">Workflows</p>
        </div>
        <div className="flex flex-row">
          <div className="mx-4">
            <FontAwesomeIcon width={30} className="h-[30px]" icon={faGear} color="#9F9FC5" />
          </div>
          <div className="mx-4">
            <FontAwesomeIcon width={30} className="h-[30px]" icon={faCircleUser} color="#9F9FC5" />
          </div>
        </div>
      </header>
      <main className="flex grow p-4">{children}</main>
    </div>
  </div>
);
