import { WorkflowExecution, WorkflowStatus } from '@/api/types';
import { Button } from '@/shared/components/button/Button';
import { GradientFrame } from '@/shared/components/gradientFrame/GradientFrame';
import { Icon } from '@/shared/components/icon/Icon';
import { LoaderIcon } from '@/shared/components/loaderIcon/LoaderIcon';
import { faXmark } from '@awesome.me/kit-b6cda292ae/icons/classic/regular';
import { faCheck, faExclamation } from '@awesome.me/kit-b6cda292ae/icons/classic/solid';
import clsx from 'clsx';
import { Fragment, useState } from 'react';
import toast from 'react-hot-toast';
import { EditorSection } from '../EditorSection';
import './ExecutionsSection.scss';

const StatusIcon = ({ className, status }: { className?: string; status: WorkflowStatus }) => (
  <div
    className={clsx(
      'flex h-4 w-4 items-center justify-center rounded-md *:text-black',
      status === 'COMPLETED' && 'bg-success-10',
      status === 'FAILED' && 'bg-error-9',
      (status === 'PENDING' || status === 'RUNNING') && 'bg-success-7',
      className,
    )}
  >
    {status === 'COMPLETED' && <Icon icon={faCheck} size={10} />}
    {status === 'FAILED' && <Icon icon={faExclamation} size={10} />}
  </div>
);

const ExecutionItem = ({
  index,
  completionDuration,
  status,
  onRemoveClick,
  onLoadClick,
  onMouseOverLoadBtn,
}: {
  index: number;
  completionDuration?: number;
  status: WorkflowStatus;
  onRemoveClick(): void;
  onLoadClick(): Promise<void>;
  onMouseOverLoadBtn?(): void;
}) => {
  const [isLoadingContent, setIsLoadingContent] = useState(false);
  const isRunningOrPending = status === 'PENDING' || status === 'RUNNING';
  const Container = isRunningOrPending ? GradientFrame : Fragment;

  const handleLoadClick = async () => {
    try {
      setIsLoadingContent(true);
      await onLoadClick();
      setIsLoadingContent(false);
    } catch (e) {
      toast.error('Error while trying to load execution');
    }
  };

  return (
    <Container {...(isRunningOrPending ? { className: 'w-full' } : {})}>
      <div
        className={clsx(
          'flex flex-row items-center justify-between rounded-xl *:text-sm',
          isRunningOrPending ? 'execution-item-bg' : 'border border-surface-2 bg-surface-3',
        )}
      >
        <div
          className={clsx(
            'flex flex-row items-center pl-5 *:font-medium',
            isRunningOrPending ? '*:text-success-10' : '*:text-text-muted',
          )}
        >
          <p className="mr-2 w-6 whitespace-nowrap pr-2">{index}</p>
          <StatusIcon status={status} />
          {status === 'COMPLETED' && <p className="ml-3">{completionDuration ?? 0}s</p>}
          {/* @TODO: Display error */}
          {status === 'FAILED' && <p className="ml-3 !text-error-9">Error occurred</p>}
          {status === 'RUNNING' && <p className="ml-3">Running...</p>}
          {status === 'PENDING' && <p className="ml-3">Pending...</p>}
        </div>
        <div className="flex flex-row items-center">
          {!isRunningOrPending && (
            <button onClick={onRemoveClick}>
              <Icon icon={faXmark} size={15} className="mr-2.5 *:text-icon-muted" />
            </button>
          )}
          <Button
            variant="ringed"
            color="secondary"
            size="xs"
            className={clsx('m-1 w-[60px]', isRunningOrPending && 'pointer-events-none invisible')}
            onClick={handleLoadClick}
            onMouseOver={onMouseOverLoadBtn}
            disabled={isLoadingContent}
          >
            {isLoadingContent ? <LoaderIcon size={16} /> : 'Load'}
          </Button>
        </div>
      </div>
    </Container>
  );
};

export const ExecutionsSection = ({
  executions,
  onLoadExecutionClick,
  onRemoveExecutionClick,
  prefetchExecutionDetails,
  onClose,
}: {
  executions: WorkflowExecution[];
  onLoadExecutionClick(exId: string): Promise<void>;
  onRemoveExecutionClick(exId: string): void;
  prefetchExecutionDetails(exId: string): void;
  onClose(): void;
}) => {
  const [activeTab, setActiveTab] = useState<'queue' | 'history'>('queue');
  const executionsToDisplay = activeTab === 'queue' ? executions.slice(0, 5) : executions;

  return (
    <EditorSection title="Jobs" onClose={onClose}>
      {executions.length === 0 ? <p className="text-text-subtle">Jobs queue is empty</p> : null}
      {executions.length > 0 ? (
        <>
          <div className="mb-4">
            <button
              onClick={() => setActiveTab('queue')}
              className={clsx(
                'rounded-lg px-4 py-2 font-medium text-text-muted transition-all',
                activeTab === 'queue' && 'bg-surface-4 !text-surface-12',
              )}
            >
              Queue
            </button>
            <button
              onClick={() => setActiveTab('history')}
              className={clsx(
                'rounded-lg px-4 py-2 font-medium text-text-muted transition-all',
                activeTab === 'history' && 'bg-surface-4 !text-surface-12',
              )}
            >
              History
            </button>
          </div>
          <p className="mb-1 text-sm font-medium text-text-muted">Latest</p>
          <div className=" no-scrollbar flex h-full flex-col overflow-auto *:mb-1">
            {executionsToDisplay.map((ex, i) => (
              <ExecutionItem
                key={ex.id}
                index={executions.length - i}
                status={ex.status}
                completionDuration={ex.completion_duration}
                onLoadClick={() => onLoadExecutionClick(ex.id)}
                onRemoveClick={() => onRemoveExecutionClick(ex.id)}
                onMouseOverLoadBtn={() => prefetchExecutionDetails(ex.id)}
              />
            ))}
          </div>
        </>
      ) : null}
    </EditorSection>
  );
};
