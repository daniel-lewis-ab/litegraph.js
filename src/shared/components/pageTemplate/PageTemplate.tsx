/* eslint-disable react/display-name */
import { constants } from '@/contants';
import { Icon } from '@/shared/components/icon/Icon';
import { faArrowUpRightFromSquare } from '@awesome.me/kit-b6cda292ae/icons/sharp/regular';
import clsx from 'clsx';
import { ReactNode } from 'react';
import { Button } from '../button/Button';
import styles from './PageTempalte.module.scss';

export const PageTemplate = ({
  children,
  className,
  banner,
}: {
  children: ReactNode;
  className?: string;
  banner?: ReactNode;
}) => (
  <>
    {banner}
    <div className={clsx(styles.pageTemplateContainer, 'flex w-full flex-col px-3', className)}>{children}</div>
  </>
);

PageTemplate.Header = ({ children, showFeedback = true }: { children: ReactNode; showFeedback?: boolean }) => (
  <div className="mb-16 mt-8 space-y-6">
    <div className="flex items-center space-x-3">
      <span className="inline rounded-lg bg-surface-5  px-2 py-1 text-sm font-medium text-secondary-12">Beta</span>
      {showFeedback && <PageTemplate.FeedbackButton />}
    </div>
    {children}
  </div>
);

PageTemplate.Title = ({ children }: { children: ReactNode }) => (
  <h1 className="inline-block text-5xl font-medium">{children}</h1>
);

PageTemplate.FeedbackButton = () => (
  <Button
    variant="filled"
    color="secondary"
    size="xs"
    onClick={() => window.open(constants.discordFeedbackUrl, '_blank')}
  >
    Feedback&nbsp; <Icon icon={faArrowUpRightFromSquare} size={12} />
  </Button>
);
