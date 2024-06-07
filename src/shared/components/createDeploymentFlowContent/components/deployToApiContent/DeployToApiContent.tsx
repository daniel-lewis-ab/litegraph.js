import { useState } from 'react';
import { faCircleCheck } from '@awesome.me/kit-b6cda292ae/icons/classic/solid';
import { Button } from '../../../button/Button';
import { ContentHeader } from '../ContentHeader';
import { DeploymentFailedContent, deploymentErrorMessage } from '../DeploymentFailedContent';
import { Icon } from '../../../icon/Icon';
import { faClone } from '@awesome.me/kit-b6cda292ae/icons/classic/regular';
import toast from 'react-hot-toast';
import { faArrowUpRightFromSquare } from '@awesome.me/kit-b6cda292ae/icons/sharp/light';
import { constants } from '@/contants';
import { CodeIcon } from '../../../icons/CodeIcon';
import axios, { AxiosError } from 'axios';
import { CreateDeploymentErrorData, Deployment, DeploymentErrorCode } from '@/api/types';
import { Tooltip } from '@/shared/components/tooltip/Tooltip';
import { faCircleInfo } from '@awesome.me/kit-b6cda292ae/icons/sharp/light';
import { Link } from 'react-router-dom';
import { routes } from '@/routes/routes';

const CurlCommandBlock = ({ executionExample }: { executionExample: string }) => {
  const handleCopyClick = () => {
    navigator.clipboard
      .writeText(executionExample)
      .then(() => {
        toast.success('Copied to clipboard');
      })
      .catch(() => {
        toast.error('Failed to copy to clipboard');
      });
  };

  return (
    <div
      className="relative flex cursor-pointer flex-row overflow-hidden rounded-lg bg-surface-3 p-4 text-left font-mono text-text-subtle"
      onClick={handleCopyClick}
    >
      <pre
        className="max-h-[120px] overflow-hidden whitespace-pre-wrap break-all text-sm"
        dangerouslySetInnerHTML={{
          __html: executionExample.replace(/\n/g, '<br/>'),
        }}
      ></pre>
      <div className="absolute bottom-0 left-0 right-0 top-0 h-[152px]">
        <div className="absolute bottom-0 left-0 right-0 h-[60px] bg-gradient-to-b from-[rgba(25,25,31,0.5)] to-[#19191F]" />
      </div>

      <Icon icon={faClone} size={16} className="ml-2 text-white" />
    </div>
  );
};

export type DeployToApiContentProps = {
  workflowId: string;
  variant: 'small' | 'big';
  onSubmit(): Promise<Deployment>;
  onClose(): void;
};

export const DeployToApiContent = ({ variant, onSubmit, onClose }: DeployToApiContentProps) => {
  const [operationStatus, setOperationStatus] = useState<null | 'success' | 'error'>(null);
  const [errorCode, setErrorCode] = useState<DeploymentErrorCode | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [deploymentCreated, setDeploymentCreated] = useState<null | Deployment>(null);

  const handleFormSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const res = await onSubmit();
      setDeploymentCreated(res);
      setOperationStatus('success');
    } catch (e) {
      if (axios.isAxiosError(e) && e.response?.data?.error_code in deploymentErrorMessage) {
        const error = e as AxiosError<CreateDeploymentErrorData>;
        setErrorCode((error.response?.data?.error_code as DeploymentErrorCode) ?? null);
      }
      setOperationStatus('error');
    } finally {
      setIsLoading(false);
    }
  };

  if (operationStatus === 'error') {
    return <DeploymentFailedContent variant={variant} onAcknowledgedClick={onClose} errorCode={errorCode} />;
  }

  if (operationStatus === 'success' && deploymentCreated) {
    return (
      <>
        <ContentHeader variant={variant} icon={<Icon icon={faCircleCheck} className="text-success-10" size={20} />}>
          Deployment Successful
        </ContentHeader>
        <p className="mb-4 text-sm text-text-subtle">
          Run this script to execute the workflow or embed it in your app. Manage your deployments on the{' '}
          <Link to={routes.deployments} className="underline">
            Deployment Page.
          </Link>
        </p>
        <div>
          {/* @TODO: Remove ?? When api updated */}
          <CurlCommandBlock executionExample={deploymentCreated.execution_example ?? ''} />
        </div>
        {/* @TODO: Link */}
        <a
          className="mt-4 text-left text-sm text-text-subtle"
          href={constants.supportUrl}
          target="_blank"
          rel="noreferrer"
        >
          Read API Guide <Icon icon={faArrowUpRightFromSquare} className="ml-1.5" />
        </a>
      </>
    );
  }

  return (
    <>
      <ContentHeader variant={variant} icon={variant === 'big' ? null : <CodeIcon />}>
        Deploy to API
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
      <div className="mb-2 text-left">
        <div className="mb-4 mt-2 flex items-center">
          <div className="flex h-[24px] w-[24px] flex-shrink-0 items-center justify-center rounded-full bg-primary-4 text-[#FF802B]">
            1
          </div>
          <p className="ml-2 text-sm">Deploy to our endpoint</p>
        </div>
        <div className="mb-4 flex items-start">
          <div className="flex h-[24px] w-[24px] flex-shrink-0 items-center justify-center rounded-full bg-primary-4 text-[#FF802B]">
            2
          </div>
          <p className="ml-2 text-sm">Use the provided curl command to execute or embed your workflow</p>
        </div>
      </div>
      <form onSubmit={handleFormSubmit} className="w-full">
        <Button size="sm" type="submit" className="w-full" isLoading={isLoading}>
          Deploy
        </Button>
      </form>
    </>
  );
};
