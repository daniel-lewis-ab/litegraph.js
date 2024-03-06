import { apiEndpoints } from '@/api/apiEndpoints';
import { axiosClient } from '@/api/axiosClient';
import { useQuery } from '@tanstack/react-query';

export type Workflow = {
  id: string;
  name: string;
  last_edited: string;
  imageUrl?: string;
  nodesCount?: number;
};

type WorkflowsResponse = {
  results: Workflow[];
};

const getWorkflows = async () => {
  const response = await axiosClient.get<WorkflowsResponse>(apiEndpoints.workflows);

  if (response.status === 200) {
    return response.data;
  }

  throw new Error('Failed to get workflows');
};

export const useWorkflowsQuery = () => {
  const { data, ...rest } = useQuery({ queryKey: ['workflows'], queryFn: getWorkflows, retry: 0 });

  return { workflows: data?.results, ...rest };
};
