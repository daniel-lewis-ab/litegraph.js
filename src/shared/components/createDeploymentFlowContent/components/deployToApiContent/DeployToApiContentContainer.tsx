import { useCreateDeploymentMutation } from '@/api/hooks/useCreateDeploymentMutation/useCreateDeploymentMutation';
import { DeployToApiContent, DeployToApiContentProps } from './DeployToApiContent';

export const DeployToApiContentContainer = (props: Omit<DeployToApiContentProps, 'onSubmit'>) => {
  const { mutateAsync: createDeployment } = useCreateDeploymentMutation();

  const handleCreateDeployment = async () => await createDeployment({ workflow_id: props.workflowId, type: 'API' });

  return <DeployToApiContent {...props} onSubmit={handleCreateDeployment} />;
};
