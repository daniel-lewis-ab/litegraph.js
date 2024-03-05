import { useWorkflowsQuery } from '@/api/hooks/useWorkflowsQuery/useWorkflowsQuery';
import { WorkflowsPage } from './Workflows';
import CenteredLoader from '@/shared/components/centeredLoader/CenteredLoader';

export const WorkflowsContainer = () => {
  const { workflows, isLoading } = useWorkflowsQuery();

  if (isLoading) {
    return <CenteredLoader />;
  }

  const onDelete = async (id: string) => {
    console.log('delte workflow', id);
    return new Promise<void>((resolve) => {
      setTimeout(() => resolve(), 2000);
    });
  };

  return <WorkflowsPage workflows={workflows || []} onWorkflowDelete={onDelete} />;
};
