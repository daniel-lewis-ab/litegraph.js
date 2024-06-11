import { Button } from '../../../button/Button';
import { Input } from '../../../input/Input';
import { FormField } from '../../../formField/FormField';
import { useEffect, useState } from 'react';
import { faCircleCheck } from '@awesome.me/kit-b6cda292ae/icons/classic/solid';
import { Icon } from '../../../icon/Icon';
import { CopyTextButton } from '../../../copyTextButton/CopyTextButton';
import { constants } from '@/contants';
import { Link } from 'react-router-dom';
import { routes } from '@/routes/routes';
import { ContentHeader } from '../ContentHeader';
import { DeploymentFailedContent, deploymentErrorMessage } from '../DeploymentFailedContent';
import { DiscordIcon } from '../../../icons/DiscordIcon';
import { useForm } from 'react-hook-form';
import axios, { AxiosError } from 'axios';
import { CreateDeploymentErrorData, DeploymentErrorCode } from '@/api/types';
import { Tooltip } from '@/shared/components/tooltip/Tooltip';
import { faCircleInfo } from '@awesome.me/kit-b6cda292ae/icons/sharp/light';

export type DeployToDiscordFormData = {
  name: string;
  workflowId: string;
};

export type DeployToDiscordContentProps = {
  workflowId: string;
  variant: 'big' | 'small';
  onClose(): void;
  onSubmit: (data: DeployToDiscordFormData) => Promise<void>;
};

export const DeployToDiscordContent = ({ workflowId, variant, onSubmit, onClose }: DeployToDiscordContentProps) => {
  const [operationStatus, setOperationStatus] = useState<null | 'success' | 'error'>(null);
  const [errorCode, setErrorCode] = useState<DeploymentErrorCode | null>(null);
  const {
    register,
    handleSubmit,
    formState: { isSubmitting, errors },
    setError,
    getValues,
    reset,
  } = useForm<DeployToDiscordFormData>();
  const openDiscord = () => window.open(constants.saltAiDiscordUrl, '_blank');

  useEffect(() => {
    setOperationStatus(null);
    reset();
  }, [reset]);

  const handleFormSubmit = async (data: DeployToDiscordFormData) => {
    try {
      await onSubmit(data);
      setOperationStatus('success');
    } catch (e) {
      if (axios.isAxiosError(e)) {
        const error = e as AxiosError<CreateDeploymentErrorData>;
        if (error.response?.data?.error_code === 'deployment_name_exists_error') {
          setError('name', { type: 'manual', message: 'Sorry, the workflow slug is unavailable' });
        } else {
          setOperationStatus('error');
          if (e.response?.data?.error_code && e.response?.data?.error_code in deploymentErrorMessage) {
            setErrorCode(e.response.data.error_code as DeploymentErrorCode);
          }
        }
      } else {
        setOperationStatus('error');
      }
    }
  };

  if (operationStatus === 'error') {
    return <DeploymentFailedContent variant={variant} onAcknowledgedClick={onClose} errorCode={errorCode} />;
  }

  if (operationStatus === 'success') {
    return (
      <>
        <ContentHeader variant={variant} icon={<Icon icon={faCircleCheck} className="text-success-10" size={20} />}>
          Deployment Successful
        </ContentHeader>
        <div>
          <p className="font-small mb-4 text-sm font-normal text-text-subtle">
            Paste command into Discord to run the workflow. Manage your deployments on the{' '}
            <Link to={routes.deployments} className="underline">
              Deployment Page
            </Link>
            .
          </p>
          <CopyTextButton
            className="mb-4 w-full"
            textClassName="text-sm"
            text={`/workflows name: ${getValues().name}`}
          />
        </div>
        <Button variant="filled" color="secondary" size="sm" onClick={openDiscord}>
          Open Salt AI Discord
        </Button>
      </>
    );
  }

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="flex flex-col">
      <ContentHeader variant={variant} icon={variant === 'big' ? null : <DiscordIcon variant="small" />}>
        Deploy to Discord
        <Tooltip.Root>
          <Tooltip.Trigger
            onClick={(e) => {
              e.stopPropagation();
              // @TODO
            }}
            className="inline-flex cursor-pointer"
          >
            <Icon icon={faCircleInfo} size={12} className="ml-2 text-icon-muted" />
          </Tooltip.Trigger>
          <Tooltip.Content side={'right'} sideOffset={12}>
            Learn more
          </Tooltip.Content>
        </Tooltip.Root>
      </ContentHeader>
      <div>
        <p className="mb-4 text-sm font-normal text-text-subtle">Deploy to our Salt AI bot and install on any server</p>
        <input hidden {...register('workflowId', { value: workflowId })} />
        <FormField
          label="Set unique workflow name"
          htmlFor="name"
          labelClassName="text-text-subtle"
          className="mb-4"
          errorMsg={errors.name?.message}
        >
          <Input
            variant="secondary"
            id="name"
            placeholder="descriptive-workflow-name"
            maxLength={constants.validation.workflowNameMaxLength}
            {...register('name', {
              maxLength: constants.validation.deploymentNameMaxLength,
              required: 'This field is required',
              pattern: {
                value: /^[A-Za-z0-9-]*$/,
                message: 'Only letters, numbers, and dashes are allowed',
              },
            })}
          />
        </FormField>
      </div>
      <Button size="sm" isLoading={isSubmitting} type="submit">
        Deploy
      </Button>
    </form>
  );
};
