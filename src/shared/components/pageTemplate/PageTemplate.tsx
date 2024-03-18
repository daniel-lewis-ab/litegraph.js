/* eslint-disable react/display-name */
import { ReactNode } from 'react';
import { Icon } from '@/shared/components/icon/Icon';
import { faArrowUpRightFromSquare } from '@awesome.me/kit-b6cda292ae/icons/sharp/regular';
import { Button } from '../button/Button';
import { constants } from '@/contants';

export const PageTemplate = ({ children }: { children: ReactNode }) => (
  <div className="flex w-full flex-col px-3 lg:px-16">{children}</div>
);

PageTemplate.Header = ({ children }: { children: ReactNode }) => (
  <div className="mb-16 mt-8 space-y-6">
    <div className="flex items-center space-x-3">
      <span className="inline rounded-lg bg-surface-5  px-2 py-1 text-sm font-medium text-secondary-12">Beta</span>
      <Button
        variant="filled"
        color="secondary"
        size="xs"
        onClick={() => window.open(constants.discordFeedbackUrl, '_blank')}
      >
        Feedback&nbsp; <Icon icon={faArrowUpRightFromSquare} size={12} />
      </Button>
    </div>
    {children}
  </div>
);

PageTemplate.Title = ({ children }: { children: ReactNode }) => (
  <h1 className="inline-block text-5xl font-medium">{children}</h1>
);
