import { useState } from 'react';
import { WorkflowEditorHeader } from './components/WorkflowEditorHeader';
import { WorkflowEditorSidebar } from './components/workflowEditorSidebar/WorkflowEditorSidebar';
import { EditorIframe } from './components/EditorIframe/EditorIframe';
import { CreateDeploymentDialogContainer } from '@/shared/components/createDeploymentDialog/CreateDeploymentDialogContainer';
import { Button } from '@/shared/components/button/Button';
import { useWebsocket } from '@/hooks/useWebsocket/useWebsocket';

const EditorDevTools = () => {
  const [msg, setMsg] = useState<string>(`{
    "errors": [],
    "data": {
        "type": "executing",
        "data": {
            "node": "1",
            "prompt_id": "2b850387-f84c-48a9-8370-af35ff1033c9",
            "execution_id": "f8a3dd12-d851-4926-b772-f856f0bacc7f"
        }
    },
    "action": "artcraft_status",
    "response_status": 200,
    "request_id": null
}
`);
  const socket = useWebsocket();

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const sendMessage = (message: any) => {
    socket?.send(JSON.stringify(message));
  };

  return (
    <div className="absolute bottom-0 left-0 w-[400px] bg-surface-4 p-4 *:text-surface-2">
      <p>Send message from websocket:</p>
      <textarea className="h-96 w-full" onChange={(e) => setMsg(e.target.value)} value={msg} />
      <Button onClick={() => sendMessage(JSON.parse(msg))}>Send websocket echo</Button>
    </div>
  );
};

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
      {import.meta.env.MODE === 'development' && import.meta.env.VITE_WEBSOCKET_URL.includes('localhost') ? (
        <EditorDevTools />
      ) : null}
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
    </div>
  );
};
