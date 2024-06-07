import { faCircleExclamation } from '@awesome.me/kit-b6cda292ae/icons/classic/solid';
import { Button } from '../../button/Button';
import { Icon } from '../../icon/Icon';
import { ContentHeader } from './ContentHeader';
import { DeploymentErrorCode } from '@/api/types';

// eslint-disable-next-line react-refresh/only-export-components
export const deploymentErrorMessage: Record<DeploymentErrorCode, string> = {
  deployment_validation_error: 'The most recent job execution must be successful in order to proceed with deployment',
  deployment_workflow_version_exists_error: 'This workflow version is already deployed, please choose another one',
  deployment_name_exists_error: 'This deployment name is already in use, please choose another one',
};

export const DeploymentFailedContent = ({
  variant,
  errorCode,
  onAcknowledgedClick,
}: {
  variant: 'big' | 'small';
  errorCode: DeploymentErrorCode | null;
  onAcknowledgedClick(): void;
}) => (
  <>
    <ContentHeader variant={variant} icon={<Icon icon={faCircleExclamation} className="text-error-9" size={20} />}>
      Deployment Failed
    </ContentHeader>
    <p className="mb-4 text-sm font-normal text-text-subtle">
      {errorCode && deploymentErrorMessage[errorCode]
        ? deploymentErrorMessage[errorCode]
        : 'Error occurred during deployment. Please try again.'}
    </p>
    <Button variant="filled" color="error" size="sm" onClick={onAcknowledgedClick}>
      Ok
    </Button>
  </>
);
