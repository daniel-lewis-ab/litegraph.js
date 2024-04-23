import { useWorkflowsQuery } from '@/api/hooks/useWorkflowsQuery/useWorkflowsQuery';
import { WorkflowsPage } from './WorkflowsPage';
import { CenteredLoader } from '@/shared/components/centeredLoader/CenteredLoader';
import { useDeleteWorkflowMutation } from '@/api/hooks/useDeleteWorkflowMutation/useDeleteWorkflowMutation';
import { useFetchWorkflowDetails } from '@/api/hooks/useWorkflowDetailsQuery/useWorkflowDetailsQuery';
import toast from 'react-hot-toast';
import { saveWorkflowContentToFile } from '@/shared/functions/saveToFile';
import { PageErrorTemplate } from '@/shared/components/pageErrorTemplate/PageErrorTemplate';

export const WorkflowsPageContainer = () => {
  const { fetchWorkflowDetails: fetchWorkflow, prefetchWorkflowDetails: prefetchWorkflow } = useFetchWorkflowDetails();
  const { workflows, isLoading, isError } = useWorkflowsQuery();
  const { mutateAsync: deleteWorkflow } = useDeleteWorkflowMutation();

  if (isLoading) {
    return <CenteredLoader />;
  }

  if (isError) {
    return <PageErrorTemplate variant="down" inApp />;
  }

  const onDelete = async (id: string) => {
    await deleteWorkflow(id);
  };

  const handleExport = async (id: string) => {
    try {
      const res = await fetchWorkflow(id);
      saveWorkflowContentToFile(res.content, `${res.name}.json`);
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
