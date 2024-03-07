import { useMutation, useQueryClient } from '@tanstack/react-query';
import { axiosClient } from '@/api/axiosClient';
import { apiEndpoints } from '@/api/apiEndpoints';
import { GetWorkflowsResponse } from '@/api/types';
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
      queryClient.setQueryData<GetWorkflowsResponse>(QueryKeys.workflows, (oldData) => {
        const newData = {
          ...oldData,
          count: oldData?.count ? oldData.count - 1 : 0,
          results: oldData?.results.filter((workflow) => workflow.id !== workflowId) || [],
        };

        return newData;
      });

      queryClient.invalidateQueries({ queryKey: QueryKeys.workflows });
    },
  });

  return { mutate, ...rest };
};
