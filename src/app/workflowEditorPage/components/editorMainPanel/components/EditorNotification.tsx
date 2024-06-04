/* eslint-disable react/display-name */
import { constants } from '@/contants';
import { useEditorNotifications } from '@/hooks/useEditorNotifications/useEditorNotifications';
import { useWorkflowEditor } from '@/hooks/useWorkflowEditor/useWorkflowEditor';
import { Icon } from '@/shared/components/icon/Icon';
import { faCircleExclamation, faClose } from '@awesome.me/kit-b6cda292ae/icons/sharp/regular';

export const EditorNotification = ({ onViewLogsClick }: { onViewLogsClick(): void }) => {
  const { lastNotification, removeLastNotification } = useEditorNotifications();

  const handleViewLogsClick = () => {
    removeLastNotification();
    onViewLogsClick();
  };

  if (!lastNotification) {
    return null;
  }

  return (
    <div className="flex min-w-[380px] flex-row justify-between rounded-2xl bg-surface-2 p-4">
      <div className="flex flex-row">
        <div className="mr-3">
          <Icon icon={faCircleExclamation} className="*:text-error-9" size={20} />
        </div>
        {lastNotification.type === 'general' && (
          <EditorNotification.GeneralErrorBody onViewLogsClick={handleViewLogsClick} />
        )}
        {lastNotification.type === 'missing_nodes' && (
          <EditorNotification.MissingNodesBody missingNodes={lastNotification.missingNodes} />
        )}
      </div>
      <div>
        <button onClick={removeLastNotification}>
          <Icon icon={faClose} size={16} className="*:text-surface-12 hover:opacity-90" />
        </button>
      </div>
    </div>
  );
};

EditorNotification.GeneralErrorBody = ({ onViewLogsClick }: { onViewLogsClick(): void }) => (
  <div>
    <p className="text-sm font-semibold">An error has occurred</p>
    <button className="text-sm underline" onClick={onViewLogsClick}>
      Review logs
    </button>
  </div>
);

const MissingNodesBody = ({ missingNodes }: { missingNodes: string[] }) => {
  const { currentWorkflow } = useWorkflowEditor();
  const allNodesCount = currentWorkflow?.content?.nodes?.length ?? 0;

  return (
    <div>
      <p className="text-sm font-semibold">Missing nodes</p>
      <p className="mb-2 text-sm">
        {allNodesCount - missingNodes.length} of {allNodesCount} nodes found
      </p>
      <div className="text-sm text-text-subtle *:text-sm *:text-text-subtle">
        Missing:
        <ul className="list-disc pl-5">
          {missingNodes.map((node) => (
            <li key={node}>{node}</li>
          ))}
        </ul>
        <p className="mt-2">
          Use an alternative node or request your node on{' '}
          <a href={constants.discordFeedbackUrl} target="_blank" className="text-white underline" rel="noreferrer">
            Discord
          </a>
        </p>
      </div>
    </div>
  );
};

EditorNotification.MissingNodesBody = MissingNodesBody;
