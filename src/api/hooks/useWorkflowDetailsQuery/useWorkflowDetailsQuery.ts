import { apiEndpoints } from '@/api/apiEndpoints';
import { QueryKeys } from '@/api/queryKeys';
import { axiosClient } from '@/api/axiosClient';
import { GetWorkflowResponse } from '@/api/types';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { QUERY_CACHE_CONFIG } from '@/api/queryCacheConfig';

const getWorkflow = async (id: string) => {
  const response = await axiosClient.get<GetWorkflowResponse>(apiEndpoints.workflow(id));

  if (response.status === 200) {
    return response.data;
  }

  throw new Error('Failed to get workflows');
};

export const useWorkflowDetailsQuery = (id: string, enabled = true) => {
  const { data, ...rest } = useQuery({
    queryKey: [QueryKeys.workflows, id],
    queryFn: () => getWorkflow(id),
    enabled,
    staleTime: QUERY_CACHE_CONFIG.workflowDetails.staleTime,
  });

  return { workflow: data, ...rest };
};

export const useFetchWorkflowDetails = () => {
  const queryClient = useQueryClient();

  const fetchWorkflowDetails = async (workflowId: string) => {
    return await queryClient.fetchQuery({
      queryKey: [QueryKeys.workflows, workflowId],
      queryFn: () => getWorkflow(workflowId),
      staleTime: QUERY_CACHE_CONFIG.workflowDetails.staleTime,
    });
  };

  const prefetchWorkflowDetails = async (workflowId: string) => {
    return await queryClient.fetchQuery({
      queryKey: [QueryKeys.workflows, workflowId],
      queryFn: () => getWorkflow(workflowId),
      staleTime: QUERY_CACHE_CONFIG.workflowDetails.staleTime,
    });
  };

  return { fetchWorkflowDetails, prefetchWorkflowDetails };
};
