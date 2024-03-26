import { apiEndpoints } from '@/api/apiEndpoints';
import { QueryKeys } from '@/api/queryKeys';
import { axiosClient } from '@/api/axiosClient';
import { GetWorkflowResponse } from '@/api/types';
import { useQuery } from '@tanstack/react-query';

const getWorkflow = async (id: string) => {
  const response = await axiosClient.get<GetWorkflowResponse>(apiEndpoints.workflow(id));

  if (response.status === 200) {
    return response.data;
  }

  throw new Error('Failed to get workflows');
};

export const useWorkflowQuery = (id: string) => {
  const { data, ...rest } = useQuery({ queryKey: [QueryKeys.workflows, id], queryFn: () => getWorkflow(id), retry: 0 });

  return { workflow: data, ...rest };
};
