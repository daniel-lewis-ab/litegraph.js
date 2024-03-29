import { WorkflowExecution, WorkflowStatus } from '@/api/types';
import { Icon } from '@/shared/components/icon/Icon';
import { faList, faCheck, faExclamation } from '@awesome.me/kit-b6cda292ae/icons/classic/solid';
import { faXmark } from '@awesome.me/kit-b6cda292ae/icons/classic/regular';
import { Button } from '@/shared/components/button/Button';
import clsx from 'clsx';
import { EditorSection } from '../EditorSection';
import { useState } from 'react';
import toast from 'react-hot-toast';
import { LoaderIcon } from '@/shared/components/loaderIcon/LoaderIcon';

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
    <div className="flex flex-row items-center justify-between rounded-xl bg-surface-3 *:text-sm">
      <div
        className={clsx(
          'flex flex-row items-center pl-5 *:font-medium',
          status !== 'PENDING' && '*:text-text-muted',
          status === 'PENDING' && '*:text-success-10',
        )}
      >
        <p className="mr-2 w-6 whitespace-nowrap pr-2">{index}</p>
        <StatusIcon status={status} />
        {status === 'COMPLETED' && <p className="ml-3">{completionDuration ?? 0}s</p>}
        {/* @TODO: Display error */}
        {status === 'FAILED' && <p className="ml-3 !text-error-9">Error here</p>}
        {(status === 'PENDING' || status === 'RUNNING') && <p className="ml-3">Running...</p>}
      </div>
      <div className="flex flex-row items-center">
        {status !== 'PENDING' && status !== 'RUNNING' && (
          <button onClick={onRemoveClick}>
            <Icon icon={faXmark} size={15} className="mr-2.5 *:text-icon-muted" />
          </button>
        )}
        <Button
          variant="ringed"
          color="secondary"
          size="sm"
          className={clsx('m-1 w-[60px]', status === 'PENDING' && 'pointer-events-none invisible')}
          onClick={handleLoadClick}
          onMouseOver={onMouseOverLoadBtn}
          disabled={isLoadingContent}
        >
          {isLoadingContent ? <LoaderIcon size={16} /> : 'Load'}
        </Button>
      </div>
    </div>
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
  return (
    <EditorSection icon={faList} title="Jobs" onClose={onClose}>
      {/* @TODO: Tab switch */}
      {executions.length === 0 ? <p className="text-text-subtle">Jobs queue is empty</p> : null}
      {executions.length > 0 ? (
        <>
          <p className="mb-2 text-sm font-medium text-text-muted">Latest</p>
          <div className="no-scrollbar h-full overflow-auto *:mb-2">
            {executions.map((ex, i) => (
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
