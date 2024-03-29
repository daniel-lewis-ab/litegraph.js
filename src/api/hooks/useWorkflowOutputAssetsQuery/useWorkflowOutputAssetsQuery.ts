import { apiEndpoints } from '@/api/apiEndpoints';
import { QueryKeys } from '@/api/queryKeys';
import { axiosClient } from '@/api/axiosClient';
import { GetWorkflowAssetsResponse } from '@/api/types';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useCallback } from 'react';
import { QUERY_CACHE_CONFIG } from '@/api/queryCacheConfig';

const getWorkflowOutputAssets = async (workflowId: string) => {
  const response = await axiosClient.get<GetWorkflowAssetsResponse>(apiEndpoints.workflowOutputAssets(workflowId), {
    params: { workflow_execution_artifact_type: 'OUTPUT' },
  });

  if (response.status === 200) {
    return response.data;
  }

  throw new Error('Failed to get workflows assets');
};

export const useWorkflowOutputAssetsQuery = (workflowId: string) => {
  const { data, ...rest } = useQuery({
    queryKey: [QueryKeys.workflowAssets, workflowId],
    queryFn: () => getWorkflowOutputAssets(workflowId),
    staleTime: QUERY_CACHE_CONFIG.workflowOutputAssets.staleTime,
    gcTime: QUERY_CACHE_CONFIG.workflowOutputAssets.cacheTime,
  });

  return { assets: data, ...rest };
};

export const usePrefetchWorkflowOutputAssets = () => {
  const queryClient = useQueryClient();

  const prefetchWorkflowOutputAssets = useCallback(
    async (workflowId: string) => {
      await queryClient.prefetchQuery({
        queryKey: [QueryKeys.workflowAssets, workflowId],
        queryFn: () => getWorkflowOutputAssets(workflowId),
        staleTime: QUERY_CACHE_CONFIG.workflowOutputAssets.staleTime,
        gcTime: QUERY_CACHE_CONFIG.workflowOutputAssets.cacheTime,
      });
    },
    [queryClient],
  );

  return { prefetchWorkflowOutputAssets };
};
