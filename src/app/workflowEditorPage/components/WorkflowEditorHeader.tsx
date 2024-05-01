import { constants } from '@/contants';
import { routes } from '@/routes/routes';
import { Button } from '@/shared/components/button/Button';
import { Icon } from '@/shared/components/icon/Icon';
import { Logo } from '@/shared/components/icons/Logo';
import { OptionsList } from '@/shared/components/optionsList/OptionsList';
import { faDownload, faPlay } from '@awesome.me/kit-b6cda292ae/icons/classic/solid';
import { faAngleLeft } from '@awesome.me/kit-b6cda292ae/icons/sharp/light';
import { Popover, PopoverContent, PopoverTrigger } from '@radix-ui/react-popover';
import clsx from 'clsx';
import { useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';

type WorkflowHeaderProps = {
  workflowName: string;
  className?: string;
  onRunWorkflowClick(): Promise<void>;
  onSaveClick(): void;
  onDeployClick(): void;
};

export const WorkflowEditorHeader = ({
  workflowName,
  className,
  onRunWorkflowClick,
  onSaveClick,
  onDeployClick,
}: WorkflowHeaderProps) => {
  const popoverRef = useRef(null);
  const [optionsSectionOpen, setOptionsSectionOpen] = useState<null | 'file' | 'help'>(null);
  const [isCreatingWorkflow, setIsCreatingWorkflow] = useState(false);
  const navigate = useNavigate();

  const handleRunWorkflowClick = async () => {
    try {
      setIsCreatingWorkflow(true);
      await onRunWorkflowClick();
      setIsCreatingWorkflow(false);
    } catch (e) {
      setIsCreatingWorkflow(false);
    }
  };

  const closeOptions = () => setOptionsSectionOpen(null);

  return (
    <header
      className={clsx(
        'relative mb-1.5 flex flex-row items-center justify-between rounded-xl bg-surface-2 px-3 py-1.5',
        className,
      )}
    >
      <div className="z-10 flex flex-row items-center">
        <button className="flex flex-row" onClick={() => navigate(routes.workflows)}>
          <Icon icon={faAngleLeft} className="mr-1" />
          <Logo className="mr-4 fill-text-base" />
        </button>
        <Popover
          modal
          open={optionsSectionOpen === 'file'}
          onOpenChange={(isOpen) => setOptionsSectionOpen(isOpen ? 'file' : null)}
        >
          <PopoverTrigger onClick={() => setOptionsSectionOpen('file')}>
            <div className="mr-1.5 rounded-lg px-1.5 py-1 font-medium text-text-muted hover:bg-surface-1 dark:hover:bg-surface-4">
              File
            </div>
          </PopoverTrigger>
          <PopoverContent
            ref={popoverRef}
            side="bottom"
            sideOffset={2}
            align="start"
            onClick={(e) => e.preventDefault()}
          >
            <OptionsList onClick={() => setOptionsSectionOpen(null)}>
              <OptionsList.Item icon={faDownload} onClick={onSaveClick}>
                Export JSON
              </OptionsList.Item>
            </OptionsList>
          </PopoverContent>
        </Popover>
        <Popover
          modal
          open={optionsSectionOpen === 'help'}
          onOpenChange={(isOpen) => setOptionsSectionOpen(isOpen ? 'help' : null)}
        >
          <PopoverTrigger onClick={() => setOptionsSectionOpen('help')}>
            <div className="mr-1.5 rounded-lg px-1.5 py-1 font-medium text-text-muted hover:bg-surface-1 dark:hover:bg-surface-4">
              Help
            </div>
          </PopoverTrigger>
          <PopoverContent ref={popoverRef} side="bottom" sideOffset={2} align="start">
            <OptionsList>
              <OptionsList.Item asLink to={constants.helpDocs} onClick={closeOptions}>
                Help docs
              </OptionsList.Item>
              <OptionsList.Item asLink to={constants.supportUrl} onClick={closeOptions}>
                Salt support
              </OptionsList.Item>
              <OptionsList.Item asLink to={constants.requestModelsUrl} onClick={closeOptions} className="pr-12">
                Request nodes/models
              </OptionsList.Item>
              <OptionsList.Item asLink to={constants.discordFeedbackUrl} onClick={closeOptions}>
                Feedback
              </OptionsList.Item>
            </OptionsList>
          </PopoverContent>
        </Popover>
      </div>
      <div className="absolute inset-0 flex items-center justify-center">
        <p className="text-sm font-medium text-surface-12">{workflowName}</p>
      </div>
      <div className="z-10 flex flex-row items-center">
        <button
          disabled={isCreatingWorkflow}
          onClick={handleRunWorkflowClick}
          className="mr-3 flex h-8 w-8 items-center justify-center *:text-icon-muted"
        >
          <Icon
            icon={faPlay}
            className={clsx(
              'mr-2 p-1 transition-opacity *:text-success-10 hover:opacity-95 active:opacity-85',
              isCreatingWorkflow && '!opacity-50',
            )}
            size={20}
          />
        </button>
        <Button variant="filled" size="sm" onClick={onDeployClick}>
          Deploy
        </Button>
      </div>
    </header>
  );
};
