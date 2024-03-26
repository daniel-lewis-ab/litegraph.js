import { useState } from 'react';
import { WorkflowHeader } from './components/WorkflowHeader';
import { EditorIframe } from './components/EditorIframe';
import { CreateDeploymentDialogContainer } from '@/shared/components/createDeploymentDialog/CreateDeploymentDialogContainer';

export const WorkflowEditorPage = ({
  workflowId,
  workflowName,
  workflowsRunningCount,
  onCreateNewWorkflowExecution,
  onSaveWorkflow,
}: {
  workflowId: string;
  workflowName: string;
  workflowsRunningCount?: number;
  onCreateNewWorkflowExecution(): void;
  onSaveWorkflow(): void;
}) => {
  const [activeSidebarSection, setActiveSidebarSection] = useState<'images' | 'executions' | null>(null);
  const [showDeploymentDialog, setShowDeploymentDialog] = useState(false);

  return (
    <div className="flex h-screen flex-row p-1.5">
      <div
        className={`flex flex-1 flex-col ${activeSidebarSection !== null ? 'flex grow basis-0' : 'flex basis-full'}`}
      >
        <WorkflowHeader
          workflowName={workflowName}
          activeSection={activeSidebarSection}
          onOpenSidebarSectionClick={setActiveSidebarSection}
          onRunClick={onCreateNewWorkflowExecution}
          onSaveClick={onSaveWorkflow}
          onDeployClick={() => setShowDeploymentDialog(true)}
          workflowsRunningCount={workflowsRunningCount}
        />
        <EditorIframe />
        <CreateDeploymentDialogContainer
          workflowId={workflowId}
          isOpen={showDeploymentDialog}
          onClose={() => setShowDeploymentDialog(false)}
        />
      </div>
    </div>
  );
};
