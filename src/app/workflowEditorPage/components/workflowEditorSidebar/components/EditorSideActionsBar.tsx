import { faList, faGrid } from '@awesome.me/kit-b6cda292ae/icons/classic/light';
import clsx from 'clsx';
import { Icon } from '@/shared/components/icon/Icon';

export const EditorSideActionsBar = ({
  activeSection,
  workflowsRunningCount,
  onOpenSidebarSectionClick,
}: {
  workflowsRunningCount?: number;
  activeSection?: null | 'images' | 'executions';
  onOpenSidebarSectionClick(section: 'images' | 'executions' | null): void;
}) => (
  <div className="ml-1 rounded-lg bg-surface-2 p-1 *:mb-3">
    <button
      onClick={() => onOpenSidebarSectionClick(activeSection === 'executions' ? null : 'executions')}
      className={clsx(
        'relative flex h-10 w-10 items-center justify-center rounded-md *:text-icon-muted',
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
        'relative flex h-10 w-10 items-center justify-center rounded-md *:text-icon-muted',
        activeSection === 'images' && 'bg-surface-4 *:text-text-base',
      )}
    >
      <Icon icon={faGrid} className="p-1" size={18} />
    </button>
  </div>
);
