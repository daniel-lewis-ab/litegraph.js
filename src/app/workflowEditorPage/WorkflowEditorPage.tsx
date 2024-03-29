import { useState } from 'react';
import { WorkflowEditorHeader } from './components/WorkflowEditorHeader';
import { WorkflowEditorSidebar } from './components/workflowEditorSidebar/WorkflowEditorSidebar';
import { EditorIframe } from './components/EditorIframe/EditorIframe';
import { CreateDeploymentDialogContainer } from '@/shared/components/createDeploymentDialog/CreateDeploymentDialogContainer';
import { EditorDevTools } from './components/EditorDevTools';

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
  onCreateNewWorkflowExecution(): Promise<void>;
  onSaveWorkflow(): void;
}) => {
  const [activeSidebarSection, setActiveSidebarSection] = useState<'images' | 'executions' | null>(null);
  const [showDeploymentDialog, setShowDeploymentDialog] = useState(false);

  return (
    <div className="flex h-screen flex-row p-1.5">
      <div
        className={`flex flex-1 flex-col ${activeSidebarSection !== null ? 'flex grow basis-0' : 'flex basis-full'}`}
      >
        <WorkflowEditorHeader
          workflowName={workflowName}
          activeSection={activeSidebarSection}
          onOpenSidebarSectionClick={setActiveSidebarSection}
          onRunWorkflowClick={onCreateNewWorkflowExecution}
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
      <div
        className={`duration-300 ${activeSidebarSection !== null ? 'w-[450px]' : 'w-0'} flex h-full overflow-hidden`}
      >
        <WorkflowEditorSidebar
          workflowId={workflowId}
          workflowName={workflowName}
          section={activeSidebarSection}
          onClose={() => setActiveSidebarSection(null)}
        />
      </div>
      {import.meta.env.MODE === 'development' && import.meta.env.VITE_WEBSOCKET_URL.includes('localhost') ? (
        <EditorDevTools />
      ) : null}
    </div>
  );
};
