import { Dialog } from '@/shared/components/dialog/Dialog';
import { DeployToDiscordContentContainer } from '../createDeploymentFlowContent/components/deployToDiscordContent/DeployToDiscordContentContainer';
import { DeployToApiContentContainer } from '../createDeploymentFlowContent/components/deployToApiContent/DeployToApiContentContainer';

export type CreateDeploymentDialogProps = {
  deploymentType: null | 'discord' | 'api';
  workflowId?: string;
  onClose: () => void;
};

export const CreateDeploymentDialog = ({ workflowId, deploymentType, onClose }: CreateDeploymentDialogProps) => {
  if (!workflowId) {
    return null;
  }

  return (
    <Dialog.Root open={deploymentType !== null} onOpenChange={(open) => open === false && onClose()}>
      <Dialog.Content onOpenAutoFocus={(e) => e.preventDefault()} className="w-[35%] min-w-[480px] text-center">
        {deploymentType === 'discord' && (
          <DeployToDiscordContentContainer variant="big" workflowId={workflowId} onClose={onClose} />
        )}
        {deploymentType === 'api' && (
          <DeployToApiContentContainer variant="big" workflowId={workflowId} onClose={onClose} />
        )}
      </Dialog.Content>
    </Dialog.Root>
  );
};
