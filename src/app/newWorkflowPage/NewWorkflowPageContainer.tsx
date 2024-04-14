import { useCreateWorkflowMutation } from '@/api/hooks/useCreateWorkflowMutation/useCreateWorkflowMutation';
import { NewWorkflowFormData, NewWorkflowPage } from './NewWorkflowPage';

export const NewWorkflowPageContainer = () => {
  const { mutateAsync } = useCreateWorkflowMutation();

  const handleSubmit = async (data: NewWorkflowFormData) => {
    return await mutateAsync({ name: data.name });
  };

  return <NewWorkflowPage onSubmit={handleSubmit} />;
};

export default NewWorkflowPageContainer;
