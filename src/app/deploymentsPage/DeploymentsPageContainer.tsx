import { useDeploymentsQuery } from '@/api/hooks/useDeploymentsQuery/useDeploymentsQuery';
import { DeploymentsPage } from './DeploymentsPage';
import CenteredLoader from '@/shared/components/centeredLoader/CenteredLoader';
import { useChangeDeploymentStateMutation } from '@/api/hooks/useChangeDeploymentStateMutation/useChangeDeploymentStateMutation';
import { useDeleteDeploymentMutation } from '@/api/hooks/useDeleteDeploymentMutation/useDeleteDeploymentMutation';
import { DeploymentStatus } from '@/api/types';
import { useQueryClient } from '@tanstack/react-query';
import { fetchDeploymentById } from '@/api/hooks/useDeploymentQuery/useDeploymentQuery';

function downloadToStringJson(data: string, filename = 'file.json') {
  const blob = new Blob([data], { type: 'application/json' });
  const href = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = href;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

export const DeploymentsPageContainer = () => {
  const queryClient = useQueryClient();
  const { isLoading } = useDeploymentsQuery();
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
    downloadToStringJson(res.workflow_json, `${res.name}.json`);
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
      // @TODO Deployments: Update when API working
      deployments={[]}
      // deployments={deployments?.results ?? []}
      onDeploymentStatusChange={handleDeploymentStatusChange}
      onDeploymentDelete={handleDeploymentDelete}
      onDownloadDeploymentJson={handleDownloadDeployment}
      prefetchDeployment={handlePrefetchDeployment}
    />
  );
};
