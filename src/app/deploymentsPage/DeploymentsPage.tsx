import { Deployment, DeploymentStatus } from '@/api/types';
import { DeleteDeploymentConfirmationDialog } from './components/DeleteDeploymentConfirmationDialog';
import { useState } from 'react';
import { PageTemplate } from '@/shared/components/pageTemplate/PageTemplate';
import { EmptyDeploymentsPage } from './components/emptyDeploymentsPage/EmptyDeploymentsPage';
import { DeploymentListItem } from './components/DeploymentListItem';

type DeploymentsPageProps = {
  deployments: Deployment[];
  onDeploymentStatusChange: (name: string, status: DeploymentStatus) => void;
  onDeploymentDelete: (id: string) => Promise<boolean>;
  onDownloadDeploymentJson: (id: string) => Promise<void>;
  prefetchDeployment(id: string): void;
};

export const DeploymentsPage = ({
  deployments,
  onDeploymentStatusChange,
  onDeploymentDelete,
  onDownloadDeploymentJson,
  prefetchDeployment,
}: DeploymentsPageProps) => {
  const [deploymentIdToDelete, setDeploymentIdToDelete] = useState<null | string>(null);

  return (
    <PageTemplate className={deployments.length === 0 ? 'max-h-screen' : undefined}>
      <PageTemplate.Header>
        <PageTemplate.Title>Deployments</PageTemplate.Title>
      </PageTemplate.Header>
      {deployments.length === 0 ? (
        <div className="flex flex-col overflow-hidden *:mb-4 last:mb-0" style={{ flex: 1 }}>
          <EmptyDeploymentsPage />
        </div>
      ) : (
        <ul className="mb-4 flex w-full flex-col *:mb-4">
          {deployments.map((deployment) => (
            <DeploymentListItem
              key={deployment.id}
              id={deployment.id}
              name={deployment.name}
              created_at={deployment.created_at}
              deployed_at={deployment.deployed_at}
              status={deployment.status}
              onStatusChange={onDeploymentStatusChange}
              onDelete={() => setDeploymentIdToDelete(deployment.id)}
              onDownload={() => onDownloadDeploymentJson(deployment.id)}
              onPopoverOpen={() => prefetchDeployment(deployment.id)}
            />
          ))}
        </ul>
      )}
      <DeleteDeploymentConfirmationDialog
        isOpen={!!deploymentIdToDelete}
        onClose={() => setDeploymentIdToDelete(null)}
        onConfirm={() => onDeploymentDelete(deploymentIdToDelete!)}
      />
    </PageTemplate>
  );
};
