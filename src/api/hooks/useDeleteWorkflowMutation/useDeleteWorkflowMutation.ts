import { useMutation, useQueryClient } from '@tanstack/react-query';
import { axiosClient } from '@/api/axiosClient';
import { apiEndpoints } from '@/api/apiEndpoints';
import { Workflow } from '@/api/types';
import { QueryKeys } from '@/api/queryKeys';

const deleteWorkflow = async (workflowId: string) => {
  const response = await axiosClient.delete(apiEndpoints.workflow(workflowId));

  if (response.status !== 200) {
    throw new Error('Failed to delete workflow');
  }

  return true;
};

export const useDeleteWorkflowMutation = () => {
  const queryClient = useQueryClient();

  const { mutate, ...rest } = useMutation({
    mutationFn: deleteWorkflow,
    onSuccess: (_, workflowId) => {
      queryClient.setQueryData<Workflow[]>(QueryKeys.workflows, (oldWorkflows) => {
        return oldWorkflows?.filter((workflow) => workflow.id !== workflowId) || [];
      });

      queryClient.invalidateQueries({ queryKey: QueryKeys.workflows });
    },
  });

  return { mutate, ...rest };
};
