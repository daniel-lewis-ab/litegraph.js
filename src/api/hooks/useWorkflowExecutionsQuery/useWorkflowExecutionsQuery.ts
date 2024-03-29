import { apiEndpoints } from '@/api/apiEndpoints';
import { QueryKeys } from '@/api/queryKeys';
import { axiosClient } from '@/api/axiosClient';
import { GetWorkflowExecutionsResponse } from '@/api/types';
import { useQuery } from '@tanstack/react-query';
import { QUERY_CACHE_CONFIG } from '@/api/queryCacheConfig';

const getWorkflowExecutions = async (workflowId: string) => {
  const response = await axiosClient.get<GetWorkflowExecutionsResponse>(apiEndpoints.workflowExecutions(workflowId));

  if (response.status === 200) {
    return response.data;
  }

  throw new Error(`Failed to get workflow executions for workflow ID: ${workflowId}`);
};

export const useWorkflowExecutionsQuery = (workflowId: string) => {
  const { data, ...rest } = useQuery({
    queryKey: [QueryKeys.workflowExecutions, workflowId],
    queryFn: () => getWorkflowExecutions(workflowId),
    staleTime: QUERY_CACHE_CONFIG.executions.staleTime,
    gcTime: QUERY_CACHE_CONFIG.executions.cacheTime,
    enabled: !!workflowId,
  });

  return { workflowExecutions: data, ...rest };
};
