import { useQuery } from '@tanstack/react-query';
import { QueryKeys } from '@/api/queryKeys';
import { GetDeploymentsResponse } from '@/api/types';
import { apiEndpoints } from '@/api/apiEndpoints';
import { axiosClient } from '@/api/axiosClient';

const getDeployments = async (): Promise<GetDeploymentsResponse> => {
  const response = await axiosClient.get<GetDeploymentsResponse>(apiEndpoints.deployments);

  if (response.status === 200) {
    return response.data;
  }

  throw new Error('Failed to get deployments');
};

export const useDeploymentsQuery = () => {
  const { data, ...rest } = useQuery({ queryKey: QueryKeys.deployments, queryFn: getDeployments, retry: 0 });

  return { deployments: data, ...rest };
};
