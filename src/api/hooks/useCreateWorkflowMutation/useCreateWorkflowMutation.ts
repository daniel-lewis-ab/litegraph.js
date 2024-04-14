import { useMutation, useQueryClient } from '@tanstack/react-query';
import { axiosClient } from '@/api/axiosClient';
import { apiEndpoints } from '@/api/apiEndpoints';
import { QueryKeys } from '@/api/queryKeys';
import { GetWorkflowsResponse, Workflow } from '@/api/types';

type CreateWorkflowData = {
  name: string;
};

const DEFAULT_WORKFLOW_DATA = {
  format: 'CMFY',
  content: {},
  api_content: {},
};

const createWorkflow = async (workflowData: CreateWorkflowData): Promise<Workflow> => {
  const response = await axiosClient.post<Workflow>(apiEndpoints.workflows, {
    ...DEFAULT_WORKFLOW_DATA,
    ...workflowData,
  });

  if (response.status !== 201) {
    throw new Error('Failed to create workflow');
  }

  return response.data;
};

export const useCreateWorkflowMutation = () => {
  const queryClient = useQueryClient();

  const { mutate, ...rest } = useMutation<Workflow, Error, CreateWorkflowData>({
    mutationFn: createWorkflow,
    onSuccess: async (newWorkflow) => {
      queryClient.setQueryData<GetWorkflowsResponse>(QueryKeys.workflows, (oldData) => {
        const oldWorkflows = oldData?.results ?? [];
        const newData = {
          count: oldData?.count ? oldData.count + 1 : 1,
          results: [newWorkflow, ...oldWorkflows],
        };

        return newData;
      });

      await queryClient.invalidateQueries({ queryKey: QueryKeys.workflows });
    },
  });

  return { mutate, ...rest };
};
