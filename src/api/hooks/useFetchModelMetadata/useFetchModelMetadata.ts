import { apiEndpoints } from '@/api/apiEndpoints';
import { QueryKeys } from '@/api/queryKeys';
import { axiosClient } from '@/api/axiosClient';
import { MetadataResponse, MetadataResponseError } from '@/api/types';
import { useQueryClient } from '@tanstack/react-query';
import { AxiosError } from 'axios';
import { useCallback } from 'react';

const getModelMetadata = async (url: string) => {
  try {
    const response = await axiosClient.get<MetadataResponse>(apiEndpoints.modelMetadata(url));
    return response.data;
  } catch (error) {
    throw error as AxiosError<MetadataResponseError>;
  }
};

export const useFetchModelMetadata = () => {
  const queryClient = useQueryClient();

  const fetchModelMetadata = useCallback(
    async (url: string) => {
      return await queryClient.fetchQuery({
        queryKey: [QueryKeys.urlMetadata, url],
        queryFn: () => getModelMetadata(url),
      });
    },
    [queryClient],
  );

  return { fetchModelMetadata };
};
