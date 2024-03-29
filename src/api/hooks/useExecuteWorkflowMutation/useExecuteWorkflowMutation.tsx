import { useMutation, useQueryClient } from '@tanstack/react-query';
import { axiosClient } from '@/api/axiosClient';
import { apiEndpoints } from '@/api/apiEndpoints';
import { QueryKeys } from '@/api/queryKeys';
import {
  GetWorkflowExecutionsResponse,
  PostWorkflowExecutionsResponse,
  WorkflowDetails,
  WorkflowExecution,
  WorkflowExecutionDetails,
} from '@/api/types';

const executeWorkflow = async ({ workflow }: MutationParams) => {
  await new Promise((r) => setTimeout(r, 2000));

  const response = await axiosClient.post<PostWorkflowExecutionsResponse>(apiEndpoints.workflowExecutions(workflow.id));

  if (response.status !== 201) {
    throw new Error('Failed to execute workflow');
  }

  return response.data;
};

type MutationParams = {
  workflow: WorkflowDetails;
};

export const useExecuteWorkflowMutation = () => {
  const queryClient = useQueryClient();

  const { mutate, ...rest } = useMutation<
    PostWorkflowExecutionsResponse,
    Error,
    MutationParams,
    { previousExecutions?: GetWorkflowExecutionsResponse }
  >({
    mutationFn: executeWorkflow,
    onMutate: ({ workflow }) => {
      const previousExecutions = queryClient.getQueryData<GetWorkflowExecutionsResponse>([
        QueryKeys.workflowExecutions,
        workflow.id,
      ]);

      const optimisticUpdate: WorkflowExecution = {
        id: 'optimistic-id',
        operation_id: 'optimistic-operation-id',
        status: 'PENDING',
        workflow_id: workflow.id,
        created_at: new Date().toISOString(),
      };

      queryClient.setQueryData<GetWorkflowExecutionsResponse>(
        [QueryKeys.workflowExecutions, workflow.id],
        (oldData) => {
          const newData: GetWorkflowExecutionsResponse = {
            ...oldData,
            count: (oldData?.count ?? 0) + 1,
            results: [optimisticUpdate, ...(oldData?.results ?? [])],
          };

          return newData;
        },
      );

      return { previousExecutions };
    },
    onSuccess: (execution, { workflow }) => {
      queryClient.setQueryData<GetWorkflowExecutionsResponse>(
        [QueryKeys.workflowExecutions, workflow.id],
        (oldData) => {
          const newData: GetWorkflowExecutionsResponse = {
            count: oldData?.count ?? 1,
            results:
              oldData?.results.map((execution) =>
                execution.id === 'optimistic-id' ? { ...execution, id: execution.id } : execution,
              ) ?? [],
          };

          return newData;
        },
      );

      const newExecutionDetails: WorkflowExecutionDetails = {
        id: execution.id,
        operation_id: execution.operation_id,
        status: execution.status,
        workflow_id: workflow.id,
        workflow_content: workflow.content,
        workflow_api_content: workflow.api_content,
        created_at: execution.created_at,
      };

      queryClient.setQueryData<WorkflowExecutionDetails>([QueryKeys.execution, execution.id], newExecutionDetails);
    },
    onError: (_, __, context) => {
      if (context?.previousExecutions) {
        queryClient.setQueryData(
          [QueryKeys.workflowExecutions, context.previousExecutions],
          context.previousExecutions,
        );
      }
    },
    onSettled: (_, __, { workflow }) => {
      queryClient.invalidateQueries({
        queryKey: [QueryKeys.workflowExecutions, workflow.id],
      });
    },
  });

  return { mutate, ...rest };
};
