import clsx from 'clsx';
import { Popover, PopoverTrigger, PopoverContent } from '@radix-ui/react-popover';
import { Icon } from '@/shared/components/icon/Icon';
import { DiscordIcon } from '@/shared/components/icons/DiscordIcon';
import { TimeSince } from '@/shared/components/timeSince/TimeSince';
import { faArrowRight } from '@awesome.me/kit-b6cda292ae/icons/sharp/solid';
import { faEllipsisVertical } from '@awesome.me/kit-b6cda292ae/icons/sharp/light';
import { Button } from '@/shared/components/button/Button';
import { Switch } from '@/shared/components/switch/Switch';
import { faTrash, faArrowDownToLine } from '@awesome.me/kit-b6cda292ae/icons/sharp/solid';
import { OptionsList } from '@/shared/components/optionsList/OptionsList';
import { useState } from 'react';
import { CopyTextButton } from '@/shared/components/copyTextButton/CopyTextButton';
import { DeploymentStatus, DeploymentType } from '@/api/types';
import toast from 'react-hot-toast';
import { constants } from '@/contants';
import { CodeIcon } from '@/shared/components/icons/CodeIcon';

const DeploymentStatusText = ({ status }: { status: DeploymentStatus }) => (
  <span
    className={clsx(
      status === 'ONLINE' && 'text-success-11 dark:text-success-10',
      status === 'PAUSED' && 'text-warning-11 dark:text-warning-10',
    )}
  >
    {status === 'ONLINE' ? 'Running' : 'Paused'}
  </span>
);

type DeploymentListItemProps = {
  id: string;
  name: string;
  created_at: string;
  deployed_at?: string;
  status: DeploymentStatus;
  type: DeploymentType;
  executionExample?: string;
  onStatusChange(id: string, status: DeploymentStatus): void;
  onDelete(): void;
  onDownload(): Promise<void>;
  onPopoverOpen(): void;
};

export const DeploymentListItem = ({
  id,
  name,
  executionExample,
  created_at,
  deployed_at,
  status,
  type,
  onStatusChange,
  onDelete,
  onDownload,
  onPopoverOpen,
}: DeploymentListItemProps) => {
  const [isPopoverOpen, setIsPopoverOpen] = useState(false);
  const textToCopy = type === 'DISC' ? `/workflows name: ${name}` : executionExample!;

  const handleDownloadClick = async () => {
    try {
      await onDownload();
    } catch (e) {
      toast.error("Couldn't download JSON");
    }
  };

  const handlePopoverOpenChange = (isOpen: boolean) => {
    setIsPopoverOpen(isOpen);
    if (isOpen) {
      onPopoverOpen();
    }
  };

  const addToDiscordServerClick = () => window.open(constants.addBotToDiscordUrl, '_blank');
  const viewApiGuideClick = () => alert('@TODO');

  return (
    <li className="flex flex-row rounded-2xl bg-surface-2 p-2">
      <div className="rounded-lg bg-surface-4 px-7 py-8">
        {type === 'DISC' ? <DiscordIcon /> : <CodeIcon className="h-[36px] w-[48px]" />}
      </div>
      <div className="flex flex-1 flex-row items-center justify-between">
        <div className="ml-6">
          <h3 className="text-2xl font-medium text-text-base">{name}</h3>
          <div className="mt-2 *:font-medium">
            <DeploymentStatusText status={status} /> <Icon className="text-text-muted" icon={faArrowRight} />{' '}
            <span className="text-text-muted">
              {deployed_at ? 'Deployed ' : 'Created '} <TimeSince time={deployed_at ?? created_at} />
            </span>
          </div>
        </div>
        <div className="flex flex-row items-center">
          <CopyTextButton className="mr-8 w-[320px] flex-1" text={textToCopy} />
          <Button
            variant="ringed"
            color="secondary"
            className="mr-6 !border-border-base"
            onClick={type === 'DISC' ? addToDiscordServerClick : viewApiGuideClick}
          >
            {type === 'DISC' ? 'Add Salt AI Bot' : 'View API Guide'}
          </Button>
          <Switch
            className="mr-4"
            checked={status === 'ONLINE'}
            onClick={() => onStatusChange(id, status === 'ONLINE' ? 'PAUSED' : 'ONLINE')}
          />
          <Popover open={isPopoverOpen} onOpenChange={handlePopoverOpenChange}>
            <PopoverTrigger className="px-1.5 *:text-icon-muted">
              <Icon size={20} icon={faEllipsisVertical} />
            </PopoverTrigger>
            <PopoverContent side="bottom" align="end" className="z-10" onClick={(e) => e.preventDefault()}>
              <OptionsList onClick={() => setIsPopoverOpen(false)}>
                <OptionsList.Item className="pr-8" icon={faArrowDownToLine} onClick={handleDownloadClick}>
                  Download JSON
                </OptionsList.Item>
                <OptionsList.Item className="pr-8" icon={faTrash} onClick={onDelete}>
                  Delete
                </OptionsList.Item>
              </OptionsList>
            </PopoverContent>
          </Popover>
        </div>
      </div>
    </li>
  );
};
