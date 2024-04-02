import { useWorkflowEditor } from '@/hooks/useWorkflowEditor/useWorkflowEditor';
import { WorkflowEditorPage } from './WorkflowEditorPage';
import { Navigate, useParams } from 'react-router-dom';
import { useExecuteWorkflowMutation } from '@/api/hooks/useExecuteWorkflowMutation/useExecuteWorkflowMutation';
import { useWorkflowDetailsQuery } from '@/api/hooks/useWorkflowDetailsQuery/useWorkflowDetailsQuery';
import CenteredLoader from '@/shared/components/centeredLoader/CenteredLoader';
import toast from 'react-hot-toast';
import { routes } from '@/routes/routes';
import { useCallback, useEffect, useState } from 'react';
import { useUpdateWorkflowMutation } from '@/api/hooks/useUpdateWorkflowMutation/useUpdateWorkflowMutation';
import throttle from 'lodash.throttle';
import { saveJsonFile } from '@/shared/functions/saveJsonFile';
import { constants } from '@/contants';
import { useWorkflowExecutionsQuery } from '@/api/hooks/useWorkflowExecutionsQuery/useWorkflowExecutionsQuery';
import { useUpdateWorkflowFromWebsocket } from '@/hooks/useUpdateWorkflowFromWebsocket/useUpdateWorkflowFromWebsocket';
import { usePrefetchWorkflowOutputAssets } from '@/api/hooks/useWorkflowOutputAssetsQuery/useWorkflowOutputAssetsQuery';

export const WorkflowEditorPageContainer = () => {
  // We want to keep it to only send the update once
  const [isInitialWorkflowUpdated, setIsInitialWorkflowUpdated] = useState(false);
  const { id } = useParams();
  const { workflowExecutions } = useWorkflowExecutionsQuery(id!);
  const { workflow, isLoading: isLoadingWorkflow } = useWorkflowDetailsQuery(id!);
  const { mutateAsync: createWorkflowExecution } = useExecuteWorkflowMutation();
  const { mutateAsync: updateWorkflow } = useUpdateWorkflowMutation();
  const { currentWorkflow, setCurrentWorkflow } = useWorkflowEditor();
  const { prefetchWorkflowOutputAssets } = usePrefetchWorkflowOutputAssets();
  const workflowsRunningCount = workflowExecutions?.results.filter((w) => w.status === 'PENDING').length;

  useUpdateWorkflowFromWebsocket();

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const throttledUpdateWorkflow = useCallback(throttle(updateWorkflow, constants.updateWorkflowThrottleTime), [
    updateWorkflow,
  ]);

  useEffect(() => {
    prefetchWorkflowOutputAssets(id!);
  }, [id, prefetchWorkflowOutputAssets]);

  useEffect(() => {
    if (workflow?.content && isInitialWorkflowUpdated === false) {
      setCurrentWorkflow({ updateSource: 'react', content: workflow.content, api_content: workflow.api_content });
      setIsInitialWorkflowUpdated(true);
    }
  }, [workflow, setCurrentWorkflow, isInitialWorkflowUpdated]);

  useEffect(() => {
    const updateWorkflowAsync = async () => {
      if (currentWorkflow?.updateSource === 'iframe') {
        await throttledUpdateWorkflow({
          id: id!,
          content: currentWorkflow.content,
          name: workflow!.name,
          api_content: currentWorkflow.api_content,
        });
      }
    };

    updateWorkflowAsync();
    // Can't have workflow here as it will be updating all the time
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentWorkflow, throttledUpdateWorkflow]);

  const handleExecuteWorkflow = async () => {
    try {
      toast.success('Workflow added to queue', { position: 'bottom-center' });
      await createWorkflowExecution({ workflow: workflow! });
    } catch (e) {
      toast.error('Failed to execute workflow', { position: 'bottom-center' });
    }

    return Promise.resolve();
  };

  const handleSaveWorkflow = () => saveJsonFile(JSON.stringify(currentWorkflow?.content), `${workflow!.name}.json`);

  if (isLoadingWorkflow) {
    return <CenteredLoader isFullscreen />;
  }

  if (isLoadingWorkflow === false && workflow === undefined) {
    toast.error('Workflow not found');
    return <Navigate to={routes.workflows} />;
  }

  return (
    <WorkflowEditorPage
      workflowId={id!}
      workflowName={workflow!.name}
      onCreateNewWorkflowExecution={handleExecuteWorkflow}
      workflowsRunningCount={workflowsRunningCount}
      onSaveWorkflow={handleSaveWorkflow}
    />
  );
};