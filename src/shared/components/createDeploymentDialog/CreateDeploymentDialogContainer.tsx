import { useCreateDeploymentMutation } from '@/api/hooks/useCreateDeploymentMutation/useCreateDeploymentMutation';
import { CreateDeploymentDialog, CreateDeploymentDialogProps, NewDeploymentFormData } from './CreateDeploymentDialog';

export const CreateDeploymentDialogContainer = (props: Omit<CreateDeploymentDialogProps, 'onSubmit'>) => {
  const { mutateAsync: createDeployment } = useCreateDeploymentMutation();

  const handleCreateDeployment = async (values: NewDeploymentFormData) => {
    await createDeployment({ name: values.name, workflow_id: values.workflowId });
  };

  return <CreateDeploymentDialog {...props} onSubmit={handleCreateDeployment} />;
};
