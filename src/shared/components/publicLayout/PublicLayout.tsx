import { ReactNode } from 'react';
import { PublicFooter } from './components/PublicFooter';
import { PublicMenubar } from './components/PublicMenubar';
import { PublicContainer } from './components/PublicContainer';
import './PublicLayout.scss';

export const PublicLayout = ({ children }: { children: ReactNode }) => {
  return (
    <div className="flex min-h-screen flex-row font-aeonik">
      <div className="flex flex-grow flex-col">
        <PublicMenubar />
        <main>{children}</main>
        <PublicFooter />
      </div>
    </div>
  );
};

PublicLayout.Container = PublicContainer;
