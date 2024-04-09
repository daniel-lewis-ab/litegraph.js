import '@/shared/components/popover/Popover.scss';
import '@/shared/components/tooltip/Tooltip.scss';
import './Layout.scss';
import { LayoutProps } from './Layout.types';
import { SideMenu } from './SideMenu';

export const Layout = ({ children }: LayoutProps) => {
  return (
    <div className="flex min-h-screen flex-row font-inter">
      <div className="hidden md:flex">
        <SideMenu />
      </div>
      <div className="flex flex-grow flex-col">
        <main className="flex w-full grow p-4">{children}</main>
      </div>
    </div>
  );
};
