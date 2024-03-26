import { Button } from '@/shared/components/button/Button';
import { Icon } from '@/shared/components/icon/Icon';
import { Logo } from '@/shared/components/icons/Logo';
import { OptionsList } from '@/shared/components/optionsList/OptionsList';
import { faImages } from '@awesome.me/kit-b6cda292ae/icons/classic/solid';
import { faAngleLeft } from '@awesome.me/kit-b6cda292ae/icons/sharp/light';
import { faDownload, faList, faPlay } from '@awesome.me/kit-b6cda292ae/icons/classic/solid';
import { Popover, PopoverContent, PopoverTrigger } from '@radix-ui/react-popover';
import clsx from 'clsx';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';

type WorkflowHeaderProps = {
  workflowName: string;
  className?: string;
  activeSection?: null | 'images' | 'executions';
  workflowsRunningCount?: number;
  onOpenSidebarSectionClick(section: 'images' | 'executions' | null): void;
  onRunClick(): void;
  onSaveClick(): void;
  onDeployClick(): void;
};

export const WorkflowHeader = ({
  workflowName,
  className,
  activeSection,
  workflowsRunningCount,
  onOpenSidebarSectionClick,
  onRunClick,
  onSaveClick,
  onDeployClick,
}: WorkflowHeaderProps) => {
  const [areOptionsOpen, setAreOptionOpen] = useState(false);
  const navigate = useNavigate();

  return (
    <header
      className={clsx(
        'mb-1.5 flex flex-row items-center justify-between rounded-xl bg-surface-2 px-3 py-1.5',
        className,
      )}
    >
      <div className="flex flex-row items-center">
        <button className="flex flex-row" onClick={() => navigate(-1)}>
          <Icon icon={faAngleLeft} className="mr-1" />
          <Logo className="mr-4 fill-text-base" />
        </button>
        <Popover open={areOptionsOpen}>
          <PopoverTrigger onClick={() => setAreOptionOpen(true)}>
            <div className="mr-1.5 rounded-lg px-1.5 py-1 font-medium text-text-muted hover:bg-surface-1 dark:hover:bg-surface-4">
              File
            </div>
          </PopoverTrigger>
          <PopoverContent side="bottom" sideOffset={2} align="start" onClick={(e) => e.preventDefault()}>
            <OptionsList onClick={() => setAreOptionOpen(false)}>
              <OptionsList.Item icon={faDownload} onClick={onSaveClick}>
                Export as...
              </OptionsList.Item>
            </OptionsList>
          </PopoverContent>
        </Popover>
      </div>
      <p className="text-sm font-medium text-surface-12">{workflowName}</p>
      <div className="flex flex-row items-center">
        <button onClick={onRunClick} className="mr-3 flex h-8 w-8 items-center justify-center *:text-icon-muted">
          <Icon
            icon={faPlay}
            className="mr-2 p-1 transition-opacity *:text-success-10 hover:opacity-95 active:opacity-85"
            size={20}
          />
        </button>
        <button
          onClick={() => onOpenSidebarSectionClick(activeSection === 'executions' ? null : 'executions')}
          className={clsx(
            'relative mr-3 flex h-8 w-8 items-center justify-center *:text-icon-muted',
            activeSection === 'executions' && '*:text-text-base',
          )}
        >
          <Icon icon={faList} className="mr-2 p-1" size={18} />
          {workflowsRunningCount && workflowsRunningCount > 0 ? (
            <div className="absolute -top-1 right-0.5 rounded-full bg-surface-2 p-0.5">
              <p className="flex h-[12px] w-[12px] items-center justify-center rounded-full bg-surface-6 text-[9px] font-bold !text-white">
                {workflowsRunningCount}
              </p>
            </div>
          ) : null}
        </button>
        <button
          onClick={() => onOpenSidebarSectionClick(activeSection === 'images' ? null : 'images')}
          className={clsx(
            'mr-3 flex h-8 w-8 items-center justify-center *:text-icon-muted',
            activeSection === 'images' && '*:text-text-base',
          )}
        >
          <Icon icon={faImages} className="mr-2 p-1" size={20} />
        </button>
        <Button variant="filled" size="sm" onClick={onDeployClick}>
          Deploy
        </Button>
      </div>
    </header>
  );
};
