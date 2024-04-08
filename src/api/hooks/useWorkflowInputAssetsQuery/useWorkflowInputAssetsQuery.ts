import { apiEndpoints } from '@/api/apiEndpoints';
import { QueryKeys } from '@/api/queryKeys';
import { axiosClient } from '@/api/axiosClient';
import { GetWorkflowInputAssetsResponse } from '@/api/types';
import { useQuery } from '@tanstack/react-query';
import { QUERY_CACHE_CONFIG } from '@/api/queryCacheConfig';

const getWorkflowInputAssets = async (workflowId: string) => {
  const response = await axiosClient.get<GetWorkflowInputAssetsResponse>(apiEndpoints.workflowInputAssets(workflowId));

  if (response.status === 200) {
    return response.data;
  }

  if (response.status === 404) {
    return [];
  }

  throw new Error('Failed to get workflows input assets');
};

export const useWorkflowInputAssetsQuery = (workflowId: string) => {
  const { data, ...rest } = useQuery({
    queryKey: [QueryKeys.workflowInputAssets, workflowId],
    queryFn: () => getWorkflowInputAssets(workflowId),
    staleTime: QUERY_CACHE_CONFIG.workflowInputAssets.staleTime,
  });

  return { inputAssets: data, ...rest };
};
