import { useWorkflowExecutionsQuery } from '@/api/hooks/useWorkflowExecutionsQuery/useWorkflowExecutionsQuery';
import { useWorkflowEditor } from '@/hooks/useWorkflowEditor/useWorkflowEditor';
import { useDeleteWorkflowExecutionMutation } from '@/api/hooks/useDeleteWorkflowExecution/useDeleteWorkflowExecution';
import { ExecutionsSection } from './ExecutionsSection';
import { useFetchExecutionDetailsQuery } from '@/api/hooks/useWorkflowExecutionDetailsQuery/useWorkflowExecutionDetailsQuery';
import { faList } from '@awesome.me/kit-b6cda292ae/icons/classic/solid';
import { EditorSection } from '../EditorSection';
import toast from 'react-hot-toast';

export const ExecutionsSectionContainer = ({ workflowId, onClose }: { workflowId: string; onClose(): void }) => {
  const { fetchExecutionDetails } = useFetchExecutionDetailsQuery();
  const { workflowExecutions, isError } = useWorkflowExecutionsQuery(workflowId);
  const { setCurrentWorkflow } = useWorkflowEditor();
  const { mutateAsync: deleteWorkflowExecution } = useDeleteWorkflowExecutionMutation();

  const handleExecutionRemove = async (executionId: string) => {
    try {
      await deleteWorkflowExecution({ executionId, workflowId });
      toast.success('Workflow execution deleted', { position: 'bottom-center' });
    } catch (e) {
      toast.error('Failed to delete workflow execution', { position: 'bottom-center' });
    }
  };

  const handleExecutionLoad = async (executionId: string) => {
    try {
      const res = await fetchExecutionDetails(executionId);

      setCurrentWorkflow({ updateSource: 'react', content: res.workflow_content });
      toast.success('Workflow loaded', { position: 'bottom-center' });
    } catch (e) {
      toast.error('Error while trying to load workflow', { position: 'bottom-center' });
    }
    return Promise.resolve();
  };

  if (isError) {
    return (
      <EditorSection icon={faList} title="Jobs" onClose={onClose}>
        <p>Error occurred</p>
      </EditorSection>
    );
  }

  return (
    <ExecutionsSection
      executions={workflowExecutions?.results ?? []}
      onLoadExecutionClick={handleExecutionLoad}
      onRemoveExecutionClick={handleExecutionRemove}
      onClose={onClose}
    />
  );
};
