import { Icon } from '@/shared/components/icon/Icon';
import { faAngleUp, faClose } from '@awesome.me/kit-b6cda292ae/icons/classic/solid';
import clsx from 'clsx';

export type EditorLogsProps = {
  logs: string[];
  isExpanded: boolean;
  onToggleExpand(): void;
  onCloseClick(): void;
};

export const EditorLogs = ({ logs, isExpanded, onToggleExpand, onCloseClick }: EditorLogsProps) => {
  return (
    <div className="mt-1 h-full rounded-lg bg-surface-2 px-2 py-2.5">
      <div className="flex flex-row justify-between">
        <p className="mb-3 text-sm font-medium">Error logs</p>
        <div>
          <button className="mr-2 hover:*:text-icon-base" onClick={onToggleExpand}>
            <Icon icon={faAngleUp} size={16} className={clsx('text-icon-muted', isExpanded && 'rotate-180')} />
          </button>
          <button onClick={onCloseClick} className="hover:*:text-icon-base">
            <Icon icon={faClose} size={16} className="text-icon-muted" />
          </button>
        </div>
      </div>
      <div className="no-scrollbar h-full overflow-scroll">
        <div
          className={clsx(
            'max-w-[700px] pb-10 font-mono text-sm',
            logs.length > 0 ? 'text-error-10' : 'text-text-subtle',
          )}
        >
          {logs.length > 0 ? logs.map((l) => l) : 'No errors'}
        </div>
      </div>
    </div>
  );
};
