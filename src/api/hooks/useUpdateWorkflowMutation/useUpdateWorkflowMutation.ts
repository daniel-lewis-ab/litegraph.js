import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'react-hot-toast';
import { axiosClient } from '@/api/axiosClient';
import { apiEndpoints } from '@/api/apiEndpoints';
import { QueryKeys } from '@/api/queryKeys';
import { GetWorkflowResponse, GetWorkflowsResponse, WorkflowDetails } from '@/api/types'; // Assuming you have a type for your workflows

const updateWorkflow = async ({ id, name, content, api_content }: Partial<WorkflowDetails> & { id: string }) => {
  const response = await axiosClient.put(apiEndpoints.workflow(id), { name, content, api_content, format: 'CMFY' });

  if (response.status !== 200) {
    throw new Error('Failed to update workflow');
  }

  return response.data;
};

export const useUpdateWorkflowMutation = () => {
  const queryClient = useQueryClient();

  const { mutate, ...rest } = useMutation({
    mutationFn: updateWorkflow,
    onMutate: async ({ id, name, content, api_content }) => {
      await queryClient.cancelQueries({ queryKey: QueryKeys.workflows });

      const previousWorkflows = queryClient.getQueryData<GetWorkflowsResponse>(QueryKeys.workflows);
      const previousWorkflow = queryClient.getQueryData<GetWorkflowResponse>([QueryKeys.workflows, id]);

      // Optimistic update for workflows list cache
      queryClient.setQueryData<GetWorkflowsResponse>(QueryKeys.workflows, (oldData) => {
        if (!oldData) {
          return undefined;
        }

        const updatedResults =
          oldData?.results.map((workflow) =>
            workflow.id === id
              ? { ...workflow, name: name ?? workflow.name, content, api_content, updated_at: new Date().toISOString() }
              : workflow,
          ) ?? [];

        const res: GetWorkflowsResponse = {
          count: oldData?.count ?? 0,
          results: updatedResults,
        };

        return res;
      });

      // Optimistically update the individual workflow cache
      if (previousWorkflow) {
        queryClient.setQueryData<GetWorkflowResponse>([QueryKeys.workflows, id], {
          ...previousWorkflow,
          name: name ?? previousWorkflow.name,
          content: content ?? previousWorkflow.content,
          api_content: api_content ?? previousWorkflow.api_content,
          updated_at: new Date().toISOString(),
        });
      }

      return { previousWorkflows, previousWorkflow };
    },
    onError: (_, __, context) => {
      toast.error('Failed to update workflow');

      // Rollback the cache to previous state
      if (context?.previousWorkflows) {
        queryClient.setQueryData(QueryKeys.workflows, context.previousWorkflows);
      }
      if (context?.previousWorkflow) {
        queryClient.setQueryData([QueryKeys.workflows, context.previousWorkflow.id], context.previousWorkflow);
      }
    },
  });

  return { mutate, ...rest };
};
