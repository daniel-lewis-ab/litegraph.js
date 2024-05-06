import { Icon } from '@/shared/components/icon/Icon';
import { faGrid, faList, faTerminal } from '@awesome.me/kit-b6cda292ae/icons/classic/light';
import clsx from 'clsx';

export const EditorSideActionsBar = ({
  areLogsOpen,
  activeSection,
  workflowsRunningCount,
  onOpenSidebarSectionClick,
  onLogsClick,
}: {
  workflowsRunningCount?: number;
  areLogsOpen: boolean;
  activeSection?: null | 'images' | 'executions';
  onOpenSidebarSectionClick(section: 'images' | 'executions' | null): void;
  onLogsClick(): void;
}) => (
  <div className="ml-1 rounded-lg bg-surface-2 p-1 *:mb-3">
    <button
      onClick={() => onOpenSidebarSectionClick(activeSection === 'executions' ? null : 'executions')}
      className={clsx(
        'relative flex h-10 w-10 items-center justify-center rounded-md *:text-icon-muted hover:*:text-icon-base',
        activeSection === 'executions' && 'bg-surface-4 *:text-text-base',
      )}
    >
      <Icon icon={faList} className="p-1" size={18} />
      {workflowsRunningCount && workflowsRunningCount > 0 ? (
        <div className="absolute -top-1 right-0.5 rounded-full bg-surface-2 p-0.5">
          <p className="flex h-[12px] w-[12px] items-center justify-center rounded-full bg-surface-6 text-[9px] font-bold !text-white">
            {workflowsRunningCount}
          </p>
        </div>
      ) : null}
    </button>
    <button
      onClick={() => onOpenSidebarSectionClick(activeSection === 'images' ? null : 'images')}
      className={clsx(
        'flex h-10 w-10 items-center justify-center rounded-md *:text-icon-muted hover:*:text-icon-base',
        activeSection === 'images' && 'bg-surface-4 *:text-text-base',
      )}
    >
      <Icon icon={faGrid} className="p-1" size={18} />
    </button>
    <button
      onClick={onLogsClick}
      className={clsx(
        'flex h-10 w-10 items-center justify-center rounded-md *:text-icon-muted hover:*:text-icon-base',
        areLogsOpen && 'bg-surface-4 *:text-text-base',
      )}
    >
      <Icon icon={faTerminal} className="p-1" size={18} />
    </button>
  </div>
);