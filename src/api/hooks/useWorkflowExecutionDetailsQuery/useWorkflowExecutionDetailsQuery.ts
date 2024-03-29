import { axiosClient } from '@/api/axiosClient';
import { apiEndpoints } from '@/api/apiEndpoints';
import { WorkflowExecutionDetails } from '@/api/types';
import { QueryKeys } from '@/api/queryKeys';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { QUERY_CACHE_CONFIG } from '@/api/queryCacheConfig';
import { useCallback } from 'react';

export const getWorkflowExecutionDetails = async (executionId: string): Promise<WorkflowExecutionDetails> => {
  const response = await axiosClient.get<WorkflowExecutionDetails>(apiEndpoints.execution(executionId));
  if (response.status === 200) {
    return response.data;
  } else {
    throw new Error('Failed to fetch workflow execution details');
  }
};

export const useWorkflowExecutionDetailsQuery = (executionId: string) => {
  const { data, error, isLoading, isError } = useQuery({
    queryKey: [QueryKeys.execution, executionId],
    queryFn: () => getWorkflowExecutionDetails(executionId),
    staleTime: QUERY_CACHE_CONFIG.executionDetails.staleTime,
    gcTime: QUERY_CACHE_CONFIG.executionDetails.cacheTime,
  });

  return {
    executionDetails: data,
    isLoading,
    error,
    isError,
  };
};

export const useFetchExecutionDetailsQuery = () => {
  const queryClient = useQueryClient();

  const prefetchExecutionDetails = useCallback(
    async (executionId: string) => {
      return await queryClient.prefetchQuery({
        queryKey: [QueryKeys.execution, executionId],
        queryFn: () => getWorkflowExecutionDetails(executionId),
        staleTime: QUERY_CACHE_CONFIG.executionDetails.staleTime,
        gcTime: QUERY_CACHE_CONFIG.executionDetails.cacheTime,
      });
    },
    [queryClient],
  );

  const fetchExecutionDetails = useCallback(
    async (executionId: string) => {
      return await queryClient.fetchQuery({
        queryKey: [QueryKeys.execution, executionId],
        queryFn: () => getWorkflowExecutionDetails(executionId),
        staleTime: QUERY_CACHE_CONFIG.executionDetails.staleTime,
        gcTime: QUERY_CACHE_CONFIG.executionDetails.cacheTime,
      });
    },
    [queryClient],
  );

  return { prefetchExecutionDetails, fetchExecutionDetails };
};
