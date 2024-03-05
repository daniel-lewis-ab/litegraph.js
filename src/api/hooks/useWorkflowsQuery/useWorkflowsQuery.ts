import { apiEndpoints } from '@/api/apiEndpoints';
import { axiosClient } from '@/api/axiosClient';
import { useQuery } from '@tanstack/react-query';

export type Workflow = {
  id: string;
  name: string;
  type: 'controlnet' | 'image';
  lastEdited: string;
  imageUrl?: string;
  nodesCount: number;
};

const getWorkflows = async () => {
  const response = await axiosClient.get<Workflow[]>(apiEndpoints.workflows);

  if (response.status === 200) {
    return response.data;
  }

  throw new Error('Failed to get workflows');
};

export const useWorkflowsQuery = () => {
  const { data: workflows, ...rest } = useQuery({ queryKey: ['workflows'], queryFn: getWorkflows });

  return { workflows, ...rest };
};
