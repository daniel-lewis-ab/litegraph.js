import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'react-hot-toast';
import { axiosClient } from '@/api/axiosClient';
import { apiEndpoints } from '@/api/apiEndpoints';
import { QueryKeys } from '@/api/queryKeys';
import { GetWorkflowExecutionsResponse, PostWorkflowExecutionsResponse, WorkflowExecution } from '@/api/types';

const executeWorkflow = async (workflowId: string) => {
  const response = await axiosClient.post<PostWorkflowExecutionsResponse>(apiEndpoints.workflowExecutions(workflowId));

  if (response.status !== 201) {
    throw new Error('Failed to execute workflow');
  }

  return response.data;
};

export const useExecuteWorkflowMutation = (workflowId: string) => {
  const queryClient = useQueryClient();

  const { mutate, ...rest } = useMutation<PostWorkflowExecutionsResponse, Error, void>({
    mutationFn: () => executeWorkflow(workflowId),
    onSuccess: (data) => {
      queryClient.setQueryData<GetWorkflowExecutionsResponse>([QueryKeys.workflowExecutions, workflowId], (oldData) => {
        const newData: WorkflowExecution = {
          id: data.id,
          operation_id: data.operation_id,
          status: data.status,
          workflow_id: '1',
          content: '{}',
          completion_duration: 0,
        };

        if (!oldData) {
          return {
            count: 1,
            next: null,
            previous: null,
            results: [newData],
          };
        }

        return {
          previous: oldData.previous,
          next: oldData.next,
          count: oldData.count + 1,
          results: [...oldData.results, newData],
        };
      });
    },
    onError: (error) => {
      toast.error(`Failed to execute workflow: ${error.message}`);
    },
  });

  return { mutate, ...rest };
};
