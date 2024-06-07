import { useCreateDeploymentMutation } from '@/api/hooks/useCreateDeploymentMutation/useCreateDeploymentMutation';
import { DeployToDiscordContent, DeployToDiscordContentProps, DeployToDiscordFormData } from './DeployToDiscordContent';

export const DeployToDiscordContentContainer = (props: Omit<DeployToDiscordContentProps, 'onSubmit'>) => {
  const { mutateAsync: createDeployment } = useCreateDeploymentMutation();

  const handleCreateDeployment = async (values: DeployToDiscordFormData) => {
    await createDeployment({ name: values.name, workflow_id: values.workflowId, type: 'DISC' });
  };

  return <DeployToDiscordContent {...props} onSubmit={handleCreateDeployment} />;
};
