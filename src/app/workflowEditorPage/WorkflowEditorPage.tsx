import { Banner } from '@/shared/components/banner/Banner';
import { CreateDeploymentDialogContainer } from '@/shared/components/createDeploymentDialog/CreateDeploymentDialogContainer';
import { useEffect, useRef, useState } from 'react';
import { ImperativePanelGroupHandle, Panel, PanelGroup, PanelResizeHandle } from 'react-resizable-panels';
import { EditorDevTools } from './components/EditorDevTools';
import { EditorFooter } from './components/EditorFooter';
import { EditorIframe } from './components/EditorIframe/EditorIframe';
import { WorkflowEditorHeader } from './components/WorkflowEditorHeader';
import { WorkflowEditorSidebar } from './components/workflowEditorSidebar/WorkflowEditorSidebar';
import { EditorErrorNotification } from './components/workflowEditorSidebar/components/EditorErrorNotification';
import { EditorLogs } from './components/workflowEditorSidebar/components/EditorLogs';
import { EditorSideActionsBar } from './components/workflowEditorSidebar/components/EditorSideActionsBar';
import { LogData } from '@/api/types';

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
  const [activeSidebarSection, setActiveSidebarSection] = useState<'images' | 'executions' | null>(null);
  const [showDeploymentDialog, setShowDeploymentDialog] = useState(false);
  const [isLogsVisible, setIsLogsVisible] = useState(false);
  const [areLogsExpanded, setAreLogsExpanded] = useState(false);
  const innerPanelRef = useRef<ImperativePanelGroupHandle | null>(null);
  const [isErrorNotificationVisible, setIsErrorNotificationVisible] = useState(false);
  const toggleLogsFullWidth = () => innerPanelRef.current?.setLayout(areLogsExpanded ? [90, 20] : [0, 100]);
  const handleViewLogsClick = () => {
    setIsLogsVisible(true);
    setIsErrorNotificationVisible(false);
  };

  useEffect(() => {
    const hasErrors = logs.some((log) => log.level.toUpperCase() === 'ERROR');
    setIsErrorNotificationVisible(hasErrors);
  }, [logs]);

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
              <WorkflowEditorHeader
                workflowName={workflowName}
                onRunWorkflowClick={onCreateNewWorkflowExecution}
                onSaveClick={onSaveWorkflow}
                onDeployClick={() => setShowDeploymentDialog(true)}
              />
              <div className="flex flex-1 flex-col">
                <PanelGroup direction="vertical" ref={innerPanelRef} autoSaveId="logsAndIframe">
                  <Panel defaultSize={75}>
                    <div className="relative h-full">
                      <EditorIframe />
                      {isErrorNotificationVisible && (
                        <div className="absolute right-4 top-4">
                          <EditorErrorNotification
                            onCloseClick={() => setIsErrorNotificationVisible(false)}
                            onViewLogsClick={handleViewLogsClick}
                          />
                        </div>
                      )}
                    </div>
                  </Panel>
                  <PanelResizeHandle />
                  {isLogsVisible && (
                    <Panel defaultSize={25} minSize={5} onResize={(size) => setAreLogsExpanded(size === 100)}>
                      <EditorLogs
                        logs={logs}
                        isExpanded={areLogsExpanded}
                        onToggleExpand={toggleLogsFullWidth}
                        onCloseClick={() => setIsLogsVisible(false)}
                      />
                    </Panel>
                  )}
                </PanelGroup>
              </div>
              <EditorFooter />
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
    </>
  );
};
