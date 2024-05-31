import { useQuery } from '@tanstack/react-query';
import { QueryKeys } from '@/api/queryKeys';
import { apiEndpoints } from '@/api/apiEndpoints';
import { axiosClient } from '@/api/axiosClient';
import { LoadingModelsResponse } from '@/api/types';

const getLoadingModels = async () => {
  const response = await axiosClient.get<LoadingModelsResponse>(apiEndpoints.loadingModels);

  if (response.data) {
    return response.data.filter((model) => model.status === 'IMPORTING' || model.status === 'READY');
  }

  return response.data;
};

export const useLoadingModelsQuery = () => {
  const { data, ...rest } = useQuery({ queryKey: QueryKeys.loadingModels, queryFn: getLoadingModels, retry: 0 });

  return { loadingModels: data, ...rest };
};
