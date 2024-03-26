import { useDeploymentsQuery } from '@/api/hooks/useDeploymentsQuery/useDeploymentsQuery';
import { DeploymentsPage } from './DeploymentsPage';
import CenteredLoader from '@/shared/components/centeredLoader/CenteredLoader';
import { useChangeDeploymentStateMutation } from '@/api/hooks/useChangeDeploymentStateMutation/useChangeDeploymentStateMutation';
import { useDeleteDeploymentMutation } from '@/api/hooks/useDeleteDeploymentMutation/useDeleteDeploymentMutation';
import { DeploymentStatus } from '@/api/types';
import { useQueryClient } from '@tanstack/react-query';
import { fetchDeploymentById } from '@/api/hooks/useDeploymentQuery/useDeploymentQuery';
import { saveJsonFile } from '@/shared/functions/saveJsonFile';

export const DeploymentsPageContainer = () => {
  const queryClient = useQueryClient();
  const { deployments, isLoading } = useDeploymentsQuery();
  const { mutate: changeDeploymentState } = useChangeDeploymentStateMutation();
  const { mutateAsync: deleteDeployment } = useDeleteDeploymentMutation();

  if (isLoading) {
    return <CenteredLoader />;
  }

  const handleDeploymentStatusChange = (id: string, status: DeploymentStatus) => {
    changeDeploymentState({ id, status });
  };

  const handleDeploymentDelete = async (id: string) => {
    return deleteDeployment(id);
  };

  const handleDownloadDeployment = async (id: string) => {
    const res = await queryClient.fetchQuery({
      queryKey: ['deployment', id],
      queryFn: () => fetchDeploymentById(id),
      staleTime: 5 * 60 * 1000, // 5m
    });
    saveJsonFile(res.workflow_json, `${res.name}.json`);
  };

  const handlePrefetchDeployment = async (deploymentId: string) => {
    await queryClient.prefetchQuery({
      queryKey: ['deployment', deploymentId],
      queryFn: () => fetchDeploymentById(deploymentId),
      staleTime: 5 * 60 * 1000,
    });
  };

  return (
    <DeploymentsPage
      deployments={deployments?.results ?? []}
      onDeploymentStatusChange={handleDeploymentStatusChange}
      onDeploymentDelete={handleDeploymentDelete}
      onDownloadDeploymentJson={handleDownloadDeployment}
      prefetchDeployment={handlePrefetchDeployment}
    />
  );
};
