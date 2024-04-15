import { useDeploymentsQuery } from '@/api/hooks/useDeploymentsQuery/useDeploymentsQuery';
import { DeploymentsPage } from './DeploymentsPage';
import { CenteredLoader } from '@/shared/components/centeredLoader/CenteredLoader';
import { useChangeDeploymentStateMutation } from '@/api/hooks/useChangeDeploymentStateMutation/useChangeDeploymentStateMutation';
import { useDeleteDeploymentMutation } from '@/api/hooks/useDeleteDeploymentMutation/useDeleteDeploymentMutation';
import { DeploymentStatus } from '@/api/types';
import { useFetchDeployment } from '@/api/hooks/useDeploymentQuery/useDeploymentQuery';
import { saveJsonFile } from '@/shared/functions/saveJsonFile';
import toast from 'react-hot-toast';
import { PageErrorTemplate } from '@/shared/components/pageErrorTemplate/PageErrorTemplate';

export const DeploymentsPageContainer = () => {
  const { prefetchDeployment, fetchDeployment } = useFetchDeployment();
  const { deployments, isLoading, isError } = useDeploymentsQuery();
  const { mutate: changeDeploymentState } = useChangeDeploymentStateMutation();
  const { mutateAsync: deleteDeployment } = useDeleteDeploymentMutation();

  if (isLoading) {
    return <CenteredLoader />;
  }

  if (isError) {
    return <PageErrorTemplate variant="down" inApp />;
  }

  const handleDeploymentStatusChange = (id: string, status: DeploymentStatus) => {
    changeDeploymentState({ id, status });
  };

  const handleDeploymentDelete = async (id: string) => {
    return deleteDeployment(id);
  };

  const handleDownloadDeployment = async (id: string) => {
    try {
      const res = await fetchDeployment(id);
      saveJsonFile(JSON.stringify(res.workflow_json), `${res.name}.json`);
      toast.success('Deployment JSON downloaded');
    } catch (error) {
      toast.error('Failed to download deployment JSON');
    }
  };

  const handlePrefetchDeployment = async (deploymentId: string) => await prefetchDeployment(deploymentId);

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

export default DeploymentsPageContainer;
