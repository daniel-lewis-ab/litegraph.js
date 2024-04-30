import { Panel, PanelGroup, PanelResizeHandle } from 'react-resizable-panels';
import { CreateDeploymentDialogContainer } from '@/shared/components/createDeploymentDialog/CreateDeploymentDialogContainer';
import { useState } from 'react';
import { EditorDevTools } from './components/EditorDevTools';
import { EditorIframe } from './components/EditorIframe/EditorIframe';
import { WorkflowEditorHeader } from './components/WorkflowEditorHeader';
import { EditorFooter } from './components/EditorFooter';
import { WorkflowEditorSidebar } from './components/workflowEditorSidebar/WorkflowEditorSidebar';
import { EditorSideActionsBar } from './components/workflowEditorSidebar/components/EditorSideActionsBar';

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
    <div className="flex h-screen flex-row bg-surface-1 p-1.5 font-inter">
      <PanelGroup autoSaveId="example" direction="horizontal">
        <Panel defaultSize={75} minSize={40} className="flex flex-1">
          <div
            className={`flex flex-1 flex-col ${activeSidebarSection !== null ? 'flex grow basis-0' : 'flex basis-full'}`}
          >
            <WorkflowEditorHeader
              workflowName={workflowName}
              onRunWorkflowClick={onCreateNewWorkflowExecution}
              onSaveClick={onSaveWorkflow}
              onDeployClick={() => setShowDeploymentDialog(true)}
            />
            <div className="flex h-full flex-row">
              <EditorIframe />
              <EditorSideActionsBar
                activeSection={activeSidebarSection}
                workflowsRunningCount={workflowsRunningCount}
                onOpenSidebarSectionClick={setActiveSidebarSection}
              />
            </div>
            <EditorFooter />
          </div>
        </Panel>
        <PanelResizeHandle />
        {activeSidebarSection !== null && (
          <Panel defaultSize={10}>
            <div className="flex h-full overflow-hidden">
              <WorkflowEditorSidebar
                workflowId={workflowId}
                workflowName={workflowName}
                section={activeSidebarSection}
                onClose={() => setActiveSidebarSection(null)}
              />
            </div>
          </Panel>
        )}
      </PanelGroup>
      <CreateDeploymentDialogContainer
        workflowId={workflowId}
        isOpen={showDeploymentDialog}
        onClose={() => setShowDeploymentDialog(false)}
      />
      {import.meta.env.MODE === 'development' && import.meta.env.VITE_WEBSOCKET_URL.includes('localhost') ? (
        <EditorDevTools />
      ) : null}
    </div>
  );
};
