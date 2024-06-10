import { constants } from '@/contants';
import { routes } from '@/routes/routes';
import { Button } from '@/shared/components/button/Button';
import { CreateDeploymentFlowContent } from '@/shared/components/createDeploymentFlowContent/CreateDeploymentFlowContent';
import { Icon } from '@/shared/components/icon/Icon';
import { Logo } from '@/shared/components/icons/Logo';
import { OptionsList } from '@/shared/components/optionsList/OptionsList';
import { faPlay } from '@awesome.me/kit-b6cda292ae/icons/classic/light';
import { faAngleLeft, faDownload, faFileImport } from '@awesome.me/kit-b6cda292ae/icons/classic/regular';
import { Popover, PopoverContent, PopoverTrigger } from '@radix-ui/react-popover';
import clsx from 'clsx';
import { ReactNode, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Card = ({ className, children }: { className?: string; children: ReactNode }) => (
  <div
    className={clsx(
      'flex max-w-[391px] flex-col rounded-lg border border-border-muted bg-surface-2 px-4 py-2 py-4',
      className,
    )}
  >
    {children}
  </div>
);

type WorkflowHeaderProps = {
  workflowName: string;
  workflowId: string;
  className?: string;
  onImportModelClick(): void;
  onRunWorkflowClick(): Promise<void>;
  onSaveClick(): void;
};

export const EditorHeader = ({
  workflowId,
  workflowName,
  className,
  onImportModelClick,
  onRunWorkflowClick,
  onSaveClick,
}: WorkflowHeaderProps) => {
  const popoverRef = useRef(null);
  const [optionsSectionOpen, setOptionsSectionOpen] = useState<null | 'file' | 'help'>(null);
  const [isCreatingWorkflow, setIsCreatingWorkflow] = useState(false);
  const [showDeploymentsPopover, setShowDeploymentsPopover] = useState(false);
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
        'relative mb-1.5 flex flex-row items-center justify-between rounded-xl bg-surface-2 py-1.5',
        className,
      )}
    >
      <div className="z-10 flex flex-row items-center gap-4 text-sm font-medium">
        <button
          className="group flex flex-row items-center px-3"
          onClick={() => navigate(routes.workflows)}
          title="Workflows"
        >
          <Icon
            icon={faAngleLeft}
            className="mr-1 transition-all duration-300 ease-in-out group-hover:-translate-x-1 group-hover:opacity-80"
          />
          <Logo className="ml-2 fill-text-base group-hover:opacity-80" />
        </button>
        <div className="flex gap-2">
          <Popover
            modal
            open={optionsSectionOpen === 'file'}
            onOpenChange={(isOpen) => setOptionsSectionOpen(isOpen ? 'file' : null)}
          >
            <PopoverTrigger onClick={() => setOptionsSectionOpen('file')}>
              <div className="rounded-lg px-2 py-1 text-text-subtle hover:text-text-base">File</div>
            </PopoverTrigger>
            <PopoverContent
              ref={popoverRef}
              side="bottom"
              sideOffset={2}
              align="start"
              onClick={(e) => e.preventDefault()}
            >
              <OptionsList onClick={() => setOptionsSectionOpen(null)}>
                <OptionsList.Item icon={faFileImport} onClick={onImportModelClick}>
                  Import model
                </OptionsList.Item>
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
              <div className="rounded-lg px-2 py-1 text-text-subtle hover:text-text-base">Help</div>
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
      </div>
      <div className="absolute inset-0 flex items-center justify-center">
        <p className="text-sm font-medium text-surface-12">{workflowName}</p>
      </div>
      <div className="z-10 mr-2 flex flex-row items-center gap-2">
        <Button
          disabled={isCreatingWorkflow}
          size="sm"
          onClick={handleRunWorkflowClick}
          leftIcon={faPlay}
          className="px-4"
        >
          Run
        </Button>
        <Popover modal open={showDeploymentsPopover} onOpenChange={setShowDeploymentsPopover}>
          <PopoverTrigger className="px-1.5 *:text-icon-muted">
            <Button as="div" color="secondary" variant="ringed" size="sm" className="px-4">
              Deploy
            </Button>
          </PopoverTrigger>
          <PopoverContent
            side="bottom"
            align="end"
            className="z-10"
            sideOffset={12}
            onOpenAutoFocus={(e) => e.preventDefault()}
          >
            <Card>
              <CreateDeploymentFlowContent workflowId={workflowId} onClose={() => setShowDeploymentsPopover(false)} />
            </Card>
          </PopoverContent>
        </Popover>
      </div>
    </header>
  );
};
