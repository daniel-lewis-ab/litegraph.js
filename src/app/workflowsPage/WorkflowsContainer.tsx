import { useWorkflowsQuery } from '@/api/hooks/useWorkflowsQuery/useWorkflowsQuery';
import { WorkflowsPage } from './Workflows';
import CenteredLoader from '@/shared/components/centeredLoader/CenteredLoader';
import { useDeleteWorkflowMutation } from '@/api/hooks/useDeleteWorkflowMutation/useDeleteWorkflowMutation';

export const WorkflowsContainer = () => {
  const { workflows, isLoading } = useWorkflowsQuery();
  const { mutate: deleteWorkflow } = useDeleteWorkflowMutation();

  if (isLoading) {
    return <CenteredLoader />;
  }

  const onDelete = async (id: string) => {
    await deleteWorkflow(id);
  };

  return <WorkflowsPage workflows={workflows || []} onWorkflowDelete={onDelete} />;
};
