import { Banner } from '@/shared/components/banner/Banner';
import { CreateDeploymentDialogContainer } from '@/shared/components/createDeploymentDialog/CreateDeploymentDialogContainer';
import { useEffect, useState } from 'react';
import { Panel, PanelGroup, PanelResizeHandle } from 'react-resizable-panels';
import { EditorDevTools } from './components/EditorDevTools';
import { EditorHeader } from './components/EditorHeader';
import { EditorSidebar } from './components/editorSidebar/EditorSidebar';
import { LogData } from '@/api/types';
import { useStateWithLocalStorage } from '@/hooks/useStateWithLocalStorage/useStateWithLocalStorage';
import { ImportModelDialog } from './components/importModelDialog/ImportModelDialog';
import { EditorFooterContainer } from './components/editorFooter/EditorFooterContainer';
import { useEditorNotifications } from '@/hooks/useEditorNotifications/useEditorNotifications';
import { EditorMainPanel } from './components/editorMainPanel/EditorMainPanel';
import { EditorSideActionsBar } from './components/EditorSideActionsBar';

type WorkflowEditorPageProps = {
  workflowId: string;
  workflowName: string;
  workflowsRunningCount?: number;
  logs: LogData[];
  onCreateNewWorkflowExecution(): Promise<void>;
  onSaveWorkflow(): void;
};

export const WorkflowEditorPage = ({
  workflowId,
  workflowName,
  workflowsRunningCount,
  logs,
  onCreateNewWorkflowExecution,
  onSaveWorkflow,
}: WorkflowEditorPageProps) => {
  const [showDeploymentDialog, setShowDeploymentDialog] = useState(false);
  const [isLogsVisible, setIsLogsVisible] = useStateWithLocalStorage('isLogsVisible', false);
  const [showImportModelDialog, setShowImportModelDialog] = useState(false);
  const [activeSidebarSection, setActiveSidebarSection] = useStateWithLocalStorage<'images' | 'executions' | null>(
    'activeSidebarSection',
    null,
  );
  const { addNotification } = useEditorNotifications();

  useEffect(() => {
    const hasErrors = logs.some((log) => log.level.toUpperCase() === 'ERROR');
    if (hasErrors) {
      addNotification({ type: 'general' });
    }
  }, [logs, addNotification]);

  return (
    <>
      <div className="flex h-screen flex-row bg-surface-1 p-1.5 font-inter">
        <PanelGroup direction="horizontal" autoSaveId="editor">
          <Panel defaultSize={75} minSize={40} className="flex flex-1">
            <div
              className={`flex flex-1 flex-col ${activeSidebarSection !== null ? 'flex grow basis-0' : 'flex basis-full'}`}
            >
              <Banner className="rounded-lg">
                <Banner.EditorBannerContent />
              </Banner>
              <EditorHeader
                workflowName={workflowName}
                onRunWorkflowClick={onCreateNewWorkflowExecution}
                onSaveClick={onSaveWorkflow}
                onDeployClick={() => setShowDeploymentDialog(true)}
                onImportModelClick={() => setShowImportModelDialog(true)}
              />
              <div className="flex flex-1 flex-col">
                <EditorMainPanel logs={logs} isLogsVisible={isLogsVisible} setIsLogsVisible={setIsLogsVisible} />
              </div>
              <EditorFooterContainer />
            </div>
          </Panel>
          <PanelResizeHandle />
          <EditorSideActionsBar
            activeSection={activeSidebarSection}
            areLogsOpen={isLogsVisible}
            workflowsRunningCount={workflowsRunningCount}
            onOpenSidebarSectionClick={setActiveSidebarSection}
            onLogsClick={() => setIsLogsVisible(!isLogsVisible)}
          />
          {activeSidebarSection !== null && (
            <Panel minSize={15}>
              <div className="flex h-full overflow-hidden">
                <EditorSidebar
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
        <ImportModelDialog isOpen={showImportModelDialog} onClose={() => setShowImportModelDialog(false)} />
        {import.meta.env.MODE === 'development' && import.meta.env.VITE_WEBSOCKET_URL.includes('localhost') ? (
          <EditorDevTools />
        ) : null}
      </div>
    </>
  );
};
