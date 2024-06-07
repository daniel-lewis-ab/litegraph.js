import { faAngleRight, faCircleInfo } from '@awesome.me/kit-b6cda292ae/icons/sharp/light';
import { Icon } from '../icon/Icon';
import { ReactNode, useState } from 'react';
import { CodeIcon } from '../icons/CodeIcon';
import { DiscordIcon } from '../icons/DiscordIcon';
import { DeployToApiContentContainer } from './components/deployToApiContent/DeployToApiContentContainer';
import { DeployToDiscordContentContainer } from './components/deployToDiscordContent/DeployToDiscordContentContainer';
import { Tooltip } from '@/shared/components/tooltip/Tooltip';

type Step = 'selectPlatform' | 'deployToApi' | 'deployToDiscord';

const Item = ({
  icon,
  name,
  desc,
  onClick,
  onInfoClick,
}: {
  icon: ReactNode;
  name: string;
  desc: string;
  onClick(): void;
  onInfoClick(): void;
}) => (
  <div
    className="-mx-3 mb-2 flex flex-row items-center px-3 py-2 first-of-type:-mt-2 last-of-type:-mb-2"
    onClick={onClick}
  >
    <div className="ml-1">{icon}</div>
    <div className="mx-4 flex flex-col items-start justify-start">
      <div className="flex items-center font-medium">
        {name}{' '}
        <Tooltip.Root>
          <Tooltip.Trigger
            onClick={(e) => {
              e.stopPropagation();
              onInfoClick();
            }}
            className="inline-flex cursor-pointer"
          >
            <Icon icon={faCircleInfo} size={12} className="ml-2 text-icon-muted" />
          </Tooltip.Trigger>
          <Tooltip.Content side={'right'} sideOffset={12}>
            Learn more
          </Tooltip.Content>
        </Tooltip.Root>
      </div>
      <p className="mt-1 text-sm text-text-muted">{desc}</p>
    </div>
    <button className="ml-auto mr-1">
      <Icon className="text-icon-muted" icon={faAngleRight} size={16} />
    </button>
  </div>
);

export const CreateDeploymentFlowContent = ({
  step: initStep,
  workflowId,
  onClose,
}: {
  step?: Step;
  workflowId: string;
  onClose(): void;
}) => {
  const [step, setStep] = useState<Step>(initStep ?? 'selectPlatform');

  if (step === 'deployToApi') {
    return <DeployToApiContentContainer variant="small" workflowId={workflowId} onClose={onClose} />;
  } else if (step === 'deployToDiscord') {
    return <DeployToDiscordContentContainer variant="small" workflowId={workflowId} onClose={onClose} />;
  }

  return (
    <>
      {/* @TODO I icon */}
      <Item
        icon={<DiscordIcon variant="small" />}
        name="Deploy to Discord"
        desc="Run this workflow in any Discord server"
        onClick={() => setStep('deployToDiscord')}
        onInfoClick={() => alert('@TODO')}
      />
      <Item
        icon={<CodeIcon />}
        name="Deploy to API"
        desc="Integrate this workflow in your app"
        onClick={() => setStep('deployToApi')}
        onInfoClick={() => alert('@TODO')}
      />
    </>
  );
};
