import { useMutation, useQueryClient } from '@tanstack/react-query';
import { axiosClient } from '@/api/axiosClient';
import { apiEndpoints } from '@/api/apiEndpoints';
import { QueryKeys } from '@/api/queryKeys';
import { GetWorkflowExecutionsResponse } from '@/api/types';

const deleteWorkflowExecution = async ({ executionId }: { executionId: string; workflowId: string }) => {
  const response = await axiosClient.delete(apiEndpoints.execution(executionId));

  if (response.status !== 200) {
    throw new Error('Failed to delete workflow execution');
  }

  return true;
};

export const useDeleteWorkflowExecutionMutation = () => {
  const queryClient = useQueryClient();

  const { mutate, ...rest } = useMutation({
    mutationFn: deleteWorkflowExecution,
    onMutate: ({ workflowId, executionId }) => {
      const previousExecutions = queryClient.getQueryData<GetWorkflowExecutionsResponse>([
        QueryKeys.workflowExecutions,
        workflowId,
      ]);

      if (previousExecutions) {
        queryClient.setQueryData<GetWorkflowExecutionsResponse>([QueryKeys.workflowExecutions, workflowId], {
          ...previousExecutions,
          count: previousExecutions.count - 1,
          results: previousExecutions.results.filter((execution) => execution.id !== executionId),
        });
      }

      return { previousExecutions };
    },
    onError: (_, variables, context) => {
      if (context?.previousExecutions) {
        queryClient.setQueryData([QueryKeys.workflowExecutions, variables.workflowId], context.previousExecutions);
      }
    },
  });

  return { mutate, ...rest };
};
