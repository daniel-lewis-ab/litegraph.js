import { apiEndpoints } from '@/api/apiEndpoints';
import { QueryKeys } from '@/api/queryKeys';
import { axiosClient } from '@/api/axiosClient';
import type { GetUserModelResponse, GetUserModelResponseError } from '@/api/types';
import { useQuery } from '@tanstack/react-query';
import type { AxiosError } from 'axios';

const getOwnedModels = async () => {
  try {
    const response = await axiosClient.get<GetUserModelResponse>(apiEndpoints.ownModels);
    return response.data;
  } catch (error) {
    throw error as AxiosError<GetUserModelResponseError>;
  }
};

export const useFetchOwnedModels = () => {
  const { data, ...rest } = useQuery({
    queryKey: [QueryKeys.ownedModels],
    queryFn: () => getOwnedModels(),
  });

  return { ownedModels: data, ...rest };
};
