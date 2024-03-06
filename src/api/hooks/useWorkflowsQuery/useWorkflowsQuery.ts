import { apiEndpoints } from '@/api/apiEndpoints';
import { axiosClient } from '@/api/axiosClient';
import { GetWorkflowsResponse } from '@/api/types';
import { useQuery } from '@tanstack/react-query';

const getWorkflows = async () => {
  const response = await axiosClient.get<GetWorkflowsResponse>(apiEndpoints.workflows);

  if (response.status === 200) {
    return response.data;
  }

  throw new Error('Failed to get workflows');
};

export const useWorkflowsQuery = () => {
  const { data, ...rest } = useQuery({ queryKey: ['workflows'], queryFn: getWorkflows, retry: 0 });

  return { workflows: data?.results, ...rest };
};
