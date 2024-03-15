import { useQuery } from '@tanstack/react-query';
import { QueryKeys } from '@/api/queryKeys';
import { DeploymentDetails } from '@/api/types';
import { apiEndpoints } from '@/api/apiEndpoints';
import { axiosClient } from '@/api/axiosClient';

export const fetchDeploymentById = async (deploymentId: string): Promise<DeploymentDetails> => {
  const response = await axiosClient.get<DeploymentDetails>(apiEndpoints.deployment(deploymentId));

  if (response.status === 200) {
    return response.data;
  }

  throw new Error('Failed to get deployment');
};

export const useDeploymentQuery = (deploymentId: string) => {
  const { data, ...rest } = useQuery({
    queryKey: [QueryKeys.deployments, deploymentId],
    queryFn: () => fetchDeploymentById(deploymentId),
    retry: 0,
    enabled: !!deploymentId,
  });

  return { deployment: data, ...rest };
};
