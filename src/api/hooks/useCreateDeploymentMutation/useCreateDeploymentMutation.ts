import { useMutation, useQueryClient } from '@tanstack/react-query';
import { axiosClient } from '@/api/axiosClient';
import { apiEndpoints } from '@/api/apiEndpoints';
import { QueryKeys } from '@/api/queryKeys';
import { Deployment, GetDeploymentsResponse } from '@/api/types';

type CreateDeploymentData = {
  name: string;
  workflow_id: string;
};

const DEFAULT_DEPLOYMENT_DATA = {
  type: 'DISC',
};

const createDeployment = async (deploymentData: CreateDeploymentData): Promise<Deployment> => {
  const response = await axiosClient.post<Deployment>(apiEndpoints.deployments, {
    ...DEFAULT_DEPLOYMENT_DATA,
    ...deploymentData,
  });

  if (response.status !== 201) {
    throw new Error('Failed to create deployment');
  }

  return response.data;
};

export const useCreateDeploymentMutation = () => {
  const queryClient = useQueryClient();

  const { mutate, ...rest } = useMutation<Deployment, Error, CreateDeploymentData>({
    mutationFn: createDeployment,
    onSuccess: async (newDeployment) => {
      queryClient.setQueryData<GetDeploymentsResponse>(QueryKeys.deployments, (oldData) => {
        const newData: GetDeploymentsResponse = {
          count: (oldData?.count ?? 0) + 1,
          results: [newDeployment, ...(oldData?.results ?? [])],
        };
        return newData;
      });

      await queryClient.invalidateQueries({ queryKey: QueryKeys.deployments });
    },
  });

  return { mutate, ...rest };
};
