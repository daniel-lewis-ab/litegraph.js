import { ReactNode } from 'react';
import './PublicLayout.scss';
import { PublicContainer } from './components/PublicContainer';
import { PublicFooter } from './components/PublicFooter';
import { PublicMainNavigation } from './components/PublicMainNavigation';
import { AngledSeparator } from './components/angledSeparator/AngledSeparator';

export const PublicLayout = ({ children, hideFooter = false }: { children: ReactNode; hideFooter?: boolean }) => {
  return (
    <div className="flex min-h-screen flex-row font-aeonik">
      <div className="flex flex-grow flex-col">
        <PublicMainNavigation />
        <main className="flex-1">{children}</main>
        {hideFooter ? null : <PublicFooter />}
      </div>
    </div>
  );
};

PublicLayout.Container = PublicContainer;
PublicLayout.AngledSeparator = AngledSeparator;
