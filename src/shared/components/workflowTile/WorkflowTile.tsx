import { routes } from '@/routes/routes';
import { Icon } from '@/shared/components/icon/Icon';
import { faEllipsisVertical } from '@awesome.me/kit-b6cda292ae/icons/classic/solid';
import { faDownload, faTrash } from '@awesome.me/kit-b6cda292ae/icons/sharp/solid';
import { OptionsList } from '../optionsList/OptionsList';
import { faDiagramProject } from '@awesome.me/kit-b6cda292ae/icons/sharp/thin';
import { Popover, PopoverContent, PopoverTrigger } from '@radix-ui/react-popover';
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useFlags } from 'launchdarkly-react-client-sdk';
import { TimeSince } from '../timeSince/TimeSince';
import { CodeIcon } from '../icons/CodeIcon';
import { DiscordIcon } from '../icons/DiscordIcon';
import { FeatureFlags } from '@/context/featureFlagProvider/FeatureFlagProvider';

type WorkflowTileProps = {
  id: string;
  name: string;
  lastEdited: string;
  onDeployClick: (type: 'api' | 'discord') => void;
  onDeleteClick: () => void;
  onExportClick: () => void;
  onTileOptionsMouseOver: () => void;
};

export const WorkflowTile = ({
  id,
  name,
  lastEdited,
  onDeployClick,
  onDeleteClick,
  onExportClick,
  onTileOptionsMouseOver,
}: WorkflowTileProps) => {
  const flags = useFlags<FeatureFlags>();
  const [isPopoverOpen, setIsPopoverOpen] = useState(false);
  const closePopover = () => setIsPopoverOpen(false);

  return (
    <>
      <Link to={routes.workflow(id)} className="workflowTile group">
        <div
          className="relative flex aspect-square flex-col justify-between overflow-hidden rounded-lg border border-surface-1 px-2.5 py-3 hover:border-surface-7"
          // style={{ backgroundImage: `url(${imageUrl})` }}
        >
          <div className="icon absolute inset-0 -z-10 flex justify-center bg-surface-2 group-hover:bg-surface-3">
            <Icon className="h-[45%] w-full pt-[20%] opacity-5" icon={faDiagramProject} />
          </div>
          <div className="flex flex-row justify-end">
            {/* Removed onOpenChange={setIsPopoverOpen} as it's not working correctly on firefox with this */}
            <Popover open={isPopoverOpen}>
              <PopoverTrigger
                asChild
                onClick={(e) => {
                  setIsPopoverOpen((o) => !o);
                  e.preventDefault();
                }}
                onMouseEnter={onTileOptionsMouseOver}
              >
                <button
                  type="button"
                  className="flex h-8 w-8 flex-row items-center justify-center rounded-lg bg-surface-2 p-3 hover:bg-surface-1 dark:hover:bg-surface-4"
                >
                  <Icon size={20} icon={faEllipsisVertical} className="text-surface-8" />
                </button>
              </PopoverTrigger>
              <PopoverContent
                side="bottom"
                sideOffset={10}
                align="end"
                // @TODO: This should not be here, we should create our popover
                className="PopoverContent z-10"
                onClick={(e) => e.preventDefault()}
              >
                <OptionsList onClick={closePopover}>
                  <OptionsList.Item
                    pureIcon={<DiscordIcon variant="small" className="h-[20px] w-[16px]" />}
                    onClick={() => onDeployClick('discord')}
                  >
                    Deploy to Discord
                  </OptionsList.Item>
                  {flags.apiDeploymentEnabled ? (
                    <OptionsList.Item
                      pureIcon={<CodeIcon className="h-[20px] w-[16px]" />}
                      onClick={() => onDeployClick('api')}
                    >
                      Deploy to API
                    </OptionsList.Item>
                  ) : null}
                  <OptionsList.Item icon={faTrash} onClick={onDeleteClick}>
                    Delete
                  </OptionsList.Item>
                  <OptionsList.Item icon={faDownload} onClick={onExportClick}>
                    Export JSON
                  </OptionsList.Item>
                </OptionsList>
              </PopoverContent>
            </Popover>
          </div>
          <div>
            <p className="text-lg font-medium text-text-base">{name}</p>
            {lastEdited && (
              <div className="mt-4 flex flex-row justify-between">
                <p className="text-sm text-text-muted">
                  Edited <TimeSince time={lastEdited} />
                </p>
                {/* <div className="flex flex-row items-center">
                <Icon className="text-text-muted mr-1" size={19} icon={faCircleNodes} />
                <p className="text-text-base">{nodesCount}</p>
              </div> */}
              </div>
            )}
          </div>
        </div>
      </Link>
    </>
  );
};
