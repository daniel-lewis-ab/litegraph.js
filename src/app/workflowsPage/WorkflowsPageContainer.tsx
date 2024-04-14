import { useWorkflowsQuery } from '@/api/hooks/useWorkflowsQuery/useWorkflowsQuery';
import { WorkflowsPage } from './WorkflowsPage';
import { CenteredLoader } from '@/shared/components/centeredLoader/CenteredLoader';
import { useDeleteWorkflowMutation } from '@/api/hooks/useDeleteWorkflowMutation/useDeleteWorkflowMutation';
import { useFetchWorkflowDetails } from '@/api/hooks/useWorkflowDetailsQuery/useWorkflowDetailsQuery';
import toast from 'react-hot-toast';
import { saveJsonFile } from '@/shared/functions/saveJsonFile';

export const WorkflowsPageContainer = () => {
  const { fetchWorkflowDetails: fetchWorkflow, prefetchWorkflowDetails: prefetchWorkflow } = useFetchWorkflowDetails();
  const { workflows, isLoading } = useWorkflowsQuery();
  const { mutateAsync: deleteWorkflow } = useDeleteWorkflowMutation();

  if (isLoading) {
    return <CenteredLoader />;
  }

  const onDelete = async (id: string) => {
    await deleteWorkflow(id);
  };

  const handleExport = async (id: string) => {
    try {
      const res = await fetchWorkflow(id);
      saveJsonFile(JSON.stringify(res.content), `${res.name}.json`);
      toast.success('Workflow exported successfully');
    } catch (e) {
      toast.error('Failed to export workflow');
    }
  };

  const handlePrefetchWorkflowDetails = (id: string) => prefetchWorkflow(id);

  return (
    <WorkflowsPage
      workflows={workflows?.results ?? []}
      onWorkflowDelete={onDelete}
      onExportWorkflow={handleExport}
      prefetchWorkflowDetails={handlePrefetchWorkflowDetails}
    />
  );
};

export default WorkflowsPageContainer;
