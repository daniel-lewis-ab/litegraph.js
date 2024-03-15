import { useMutation, useQueryClient } from '@tanstack/react-query';
import { QueryKeys } from '@/api/queryKeys';
import { toast } from 'react-hot-toast';
import { DeploymentStatus, GetDeploymentsResponse } from '@/api/types';
import { axiosClient } from '@/api/axiosClient';
import { apiEndpoints } from '@/api/apiEndpoints';

const changeDeploymentState = async ({ id, status }: { id: string; status: DeploymentStatus }) => {
  const response = await axiosClient.put(apiEndpoints.deployment(id), { status });

  if (response.status !== 200) {
    throw new Error('Failed to change deployment state');
  }

  return response.data;
};

export const useChangeDeploymentStateMutation = () => {
  const queryClient = useQueryClient();

  const { mutate, ...rest } = useMutation({
    mutationFn: changeDeploymentState,
    onMutate: async ({ id, status }) => {
      await queryClient.cancelQueries({ queryKey: QueryKeys.deployments });

      const previousDeployments = queryClient.getQueryData<GetDeploymentsResponse>(QueryKeys.deployments);

      queryClient.setQueryData<GetDeploymentsResponse>(QueryKeys.deployments, (oldData) => {
        return {
          ...oldData,
          results:
            oldData?.results.map((deployment) =>
              deployment.id === id ? { ...deployment, status: status } : deployment,
            ) ?? [],
        };
      });

      return { previousDeployments };
    },
    onError: (_, __, context) => {
      toast.error('Failed to change deployment state');
      if (context?.previousDeployments) {
        queryClient.setQueryData(QueryKeys.deployments, context.previousDeployments);
      }
    },
  });

  return { mutate, ...rest };
};
