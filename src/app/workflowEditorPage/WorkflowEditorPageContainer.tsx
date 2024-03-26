import { useWorkflowEditor } from '@/hooks/useWorkflowEditor/useWorkflowEditor';
import { WorkflowEditorPage } from './WorkflowEditorPage';
import { Navigate, useParams } from 'react-router-dom';
import { useExecuteWorkflowMutation } from '@/api/hooks/useExecuteWorkflowMutation/useExecuteWorkflowMutation';
import { useWorkflowQuery } from '@/api/hooks/useWorkflowQuery/useWorkflowQuery';
import CenteredLoader from '@/shared/components/centeredLoader/CenteredLoader';
import toast from 'react-hot-toast';
import { routes } from '@/routes/routes';
import { useCallback, useEffect, useState } from 'react';
import { useUpdateWorkflowMutation } from '@/api/hooks/useUpdateWorkflowMutation/useUpdateWorkflowMutation';
import throttle from 'lodash.throttle';
import { saveJsonFile } from '@/shared/functions/saveJsonFile';
import { constants } from '@/contants';
import { useWorkflowExecutionsQuery } from '@/api/hooks/useWorkflowExecutionsQuery/useWorkflowExecutionsQuery';

export const WorkflowEditorPageContainer = () => {
  const [isInitialWorkflowUpdated, setIsInitialWorkflowUpdated] = useState(false);
  const { id } = useParams();
  const { workflowExecutions } = useWorkflowExecutionsQuery(id!);
  const { workflow, isLoading: isLoadingWorkflow } = useWorkflowQuery(id!);
  const { mutateAsync: createWorkflowExecution } = useExecuteWorkflowMutation(id!);
  const { mutateAsync: updateWorkflow } = useUpdateWorkflowMutation();
  const { currentWorkflow, setCurrentWorkflow } = useWorkflowEditor();
  const workflowsRunningCount = workflowExecutions?.results.filter((w) => w.status === 'loading').length;

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const throttledUpdateWorkflow = useCallback(throttle(updateWorkflow, constants.updateWorkflowThrottleTime), [
    updateWorkflow,
  ]);

  useEffect(() => {
    try {
      if (workflow?.content && isInitialWorkflowUpdated === false) {
        setCurrentWorkflow({ updateSource: 'react', content: workflow.content });
        setIsInitialWorkflowUpdated(true);
      }
    } catch (e) {
      console.error(e);
      toast.error('Error while trying to fetch workflow');
    }
  }, [workflow?.content, setCurrentWorkflow, isInitialWorkflowUpdated]);

  useEffect(() => {
    const updateWorkflowAsync = async () => {
      if (currentWorkflow?.updateSource === 'iframe') {
        await throttledUpdateWorkflow({
          id: id!,
          content: currentWorkflow.content,
          name: workflow!.name,
          api_content: {},
        });
      }
    };

    updateWorkflowAsync();
    // Can't have workflow here as it will be updating all the time
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentWorkflow, throttledUpdateWorkflow]);

  const handleExecuteWorkflow = async () => {
    await createWorkflowExecution();
  };

  const handleSaveWorkflow = () => {
    saveJsonFile(JSON.stringify(currentWorkflow?.content), `${workflow!.name}.json`);
  };

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
