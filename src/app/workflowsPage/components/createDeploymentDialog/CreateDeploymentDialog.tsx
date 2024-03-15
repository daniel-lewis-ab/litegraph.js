import { constants } from '@/contants';
import { Button } from '@/shared/components/button/Button';
import { CopyTextButton } from '@/shared/components/copyTextButton/CopyTextButton';
import { Dialog } from '@/shared/components/dialog/Dialog';
import { FormField } from '@/shared/components/formField/FormField';
import { DiscordIcon } from '@/shared/components/icons/DiscordIcon';
import { RadioIcon } from '@/shared/components/icons/Radio';
import { Input } from '@/shared/components/input/Input';
import { WarningDialogContent } from '@/shared/components/warningDialog/WarningDialog';
import axios from 'axios';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';

export type NewDeploymentFormData = {
  name: string;
  workflowId: string;
};

export type CreateDeploymentDialogProps = {
  isOpen: boolean;
  workflowId: string;
  onSubmit: (data: NewDeploymentFormData) => Promise<void>;
  onClose: () => void;
};

export const CreateDeploymentDialog = ({ isOpen, workflowId, onSubmit, onClose }: CreateDeploymentDialogProps) => {
  const [operationStatus, setOperationStatus] = useState<null | 'success' | 'error'>('success');
  const {
    register,
    handleSubmit,
    formState: { isSubmitting, errors },
    setError,
    getValues,
    reset,
  } = useForm<NewDeploymentFormData>();

  useEffect(() => {
    setOperationStatus(null);
    reset();
  }, [isOpen, reset]);

  const handleFormSubmit = async (data: NewDeploymentFormData) => {
    try {
      await onSubmit(data);
      setOperationStatus('success');
    } catch (e) {
      if (axios.isAxiosError(e)) {
        if (e.response?.data?.error?.code === 'WORKFLOW_NAME_EXISTS') {
          setError('name', { type: 'manual', message: 'Sorry, the workflow slug is unavailable' });
        } else {
          setOperationStatus('error');
        }
      } else {
        setOperationStatus('error');
      }
    }
  };

  const openDiscord = () => window.open(constants.saltAiDiscordUrl, '_blank');
  const addToDiscordServerClick = () => window.open(constants.addBotToDiscordUrl, '_blank');

  const deployForm = (
    <>
      <Dialog.Header>
        <Dialog.Title>New Deployment</Dialog.Title>
      </Dialog.Header>
      <form onSubmit={handleSubmit(handleFormSubmit)}>
        <div className="border-primary-10 mb-4 flex flex-row rounded-lg border p-4">
          <div className="*:text-primary-10 mr-4">
            <RadioIcon filled />
          </div>
          <div className="flex-1">
            <p className="text-color--surface-50 font-semibold">Deploy to Salt AI on Discord</p>
            <p className="text-text-subtle mb-4 text-sm">
              Accessible to anyone that uses <span className="text-text-base">/workflow name</span>
            </p>
            <input hidden {...register('workflowId', { value: workflowId })} />
            <FormField
              label="Workflow name"
              hint="Enter a unique workflow slug"
              htmlFor="name"
              errorMsg={errors.name?.message}
            >
              <Input
                variant="secondary"
                id="name"
                placeholder="descriptive-workflow-name"
                {...register('name', {
                  required: 'This field is required',
                  pattern: {
                    value: /^[A-Za-z0-9-]*$/,
                    message: 'Only letters, numbers, and dashes are allowed',
                  },
                })}
              />
            </FormField>
          </div>
        </div>
        <div className="border-surface-7 mb-6 flex cursor-not-allowed flex-row items-center justify-between rounded-lg border p-4">
          <div className="flex flex-row items-center">
            <div className="*:text-surface-7 mr-4">
              <RadioIcon />
            </div>
            <p className="text-disabled text-surface-7 font-semibold">Deploy to API</p>
          </div>
          <div className="bg-surface-6 rounded-md px-2 py-1 text-xs font-medium">Coming soon</div>
        </div>
        <Button color="primary" className="mb-3 w-full" type="submit" isLoading={isSubmitting}>
          Deploy
        </Button>
      </form>
    </>
  );

  const successResult = (
    <div className="flex flex-col">
      <div className="flex flex-col items-center">
        <div className="bg-surface-4 mb-3 rounded-lg px-7 py-8">
          <DiscordIcon />
        </div>
        <Dialog.Title>Your Deployment is Live</Dialog.Title>
        <p className="text-text-muted mb-6 mt-1 text-sm">Paste your command into Discord to run your workflow</p>
      </div>
      <p className="text-text-base mb-2 self-start text-sm font-medium">Salt AI Bot command</p>
      <CopyTextButton text={`/workflows name: ${getValues().name}`} className="mb-6" />
      <Button color="primary" className="mb-3" onClick={addToDiscordServerClick}>
        Add to Server
      </Button>
      <Button color="secondary" variant="ringed" className="mb-3" onClick={openDiscord}>
        Open Salt AI Discord
      </Button>
    </div>
  );

  const errorResult = (
    <WarningDialogContent
      title="Deployment Failed"
      desc="Ensure that all models/checkpoints are accessible and your workflow is stable."
    >
      <Button variant="filled" color="error" className="w-full" onClick={onClose}>
        Ok
      </Button>
    </WarningDialogContent>
  );

  return (
    <Dialog.Root open={isOpen} onOpenChange={(open) => open === false && onClose()}>
      <Dialog.Content className="w-[35%] min-w-[480px]">
        {operationStatus === null && deployForm}
        {operationStatus === 'success' && successResult}
        {operationStatus === 'error' && errorResult}
      </Dialog.Content>
    </Dialog.Root>
  );
};
