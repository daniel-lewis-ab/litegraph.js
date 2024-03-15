import { useMutation, useQueryClient } from '@tanstack/react-query';
import { QueryKeys } from '@/api/queryKeys';
import { GetDeploymentsResponse } from '@/api/types'; // Załóżmy, że mamy taki typ
import { axiosClient } from '@/api/axiosClient';
import { apiEndpoints } from '@/api/apiEndpoints';

const deleteDeployment = async (deploymentId: string) => {
  const response = await axiosClient.delete(apiEndpoints.deployment(deploymentId));

  await new Promise((resolve) => setTimeout(resolve, 1000));

  if (response.status !== 200) {
    throw new Error('Failed to delete deployment');
  }

  return true;
};

export const useDeleteDeploymentMutation = () => {
  const queryClient = useQueryClient();

  const { mutate, ...rest } = useMutation({
    mutationFn: deleteDeployment,
    onSuccess: async (_, deploymentId) => {
      queryClient.setQueryData<GetDeploymentsResponse>(QueryKeys.deployments, (oldData) => {
        const newData = {
          ...oldData,
          count: oldData?.count ? oldData.count - 1 : 0,
          results: oldData?.results.filter((deployment) => deployment.id !== deploymentId) ?? [],
        };

        return newData;
      });

      await queryClient.invalidateQueries({ queryKey: QueryKeys.deployments });
    },
  });

  return { mutate, ...rest };
};
