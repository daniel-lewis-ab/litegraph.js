import { routes } from '@/routes/routes';
import { Icon } from '@/shared/components/icon/Icon';
import { faEllipsisVertical } from '@awesome.me/kit-b6cda292ae/icons/classic/solid';
import { faDownload, faRocket, faTrash } from '@awesome.me/kit-b6cda292ae/icons/sharp/solid';
import { OptionsList } from '../optionsList/OptionsList';
import { faDiagramProject } from '@awesome.me/kit-b6cda292ae/icons/sharp/thin';
import { Popover, PopoverContent, PopoverTrigger } from '@radix-ui/react-popover';
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { TimeSince } from '../timeSince/TimeSince';

type WorkflowTileProps = {
  id: string;
  name: string;
  lastEdited: string;
  onDeployClick: () => void;
  onDeleteClick: () => void;
  onExportClick: () => void;
};

export const WorkflowTile = ({
  id,
  name,
  lastEdited,
  onDeployClick,
  onDeleteClick,
  onExportClick,
}: WorkflowTileProps) => {
  const [isPopoverOpen, setIsPopoverOpen] = useState(false);

  const closePopover = () => setIsPopoverOpen(false);

  // const handleActionClick = async (action: Action) => {
  //   await onActionClick(action);
  //   closePopover();
  // };

  return (
    <>
      <Link to={routes.workflow(id)} className="workflowTile group">
        <div
          className="border-surface-1 hover:border-surface-7 relative flex aspect-square flex-col justify-between overflow-hidden rounded-lg border px-2.5 py-3"
          // style={{ backgroundImage: `url(${imageUrl})` }}
        >
          <div className="icon bg-surface-2 group-hover:bg-surface-3 absolute inset-0 -z-10 flex justify-center">
            <Icon className="h-[45%] w-full pt-[20%] opacity-5" icon={faDiagramProject} />
          </div>
          <div className="flex flex-row justify-end">
            <Popover open={isPopoverOpen} onOpenChange={setIsPopoverOpen}>
              <PopoverTrigger
                asChild
                onClick={(e) => {
                  setIsPopoverOpen((o) => !o);
                  e.preventDefault();
                }}
              >
                <button
                  type="button"
                  className="bg-surface-2 hover:bg-surface-1 dark:hover:bg-surface-4 flex h-8 w-8 flex-row items-center justify-center rounded-lg p-3"
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
                  <OptionsList.Item icon={faRocket} onClick={onDeployClick}>
                    Deploy
                  </OptionsList.Item>
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
            <p className="text-text-base text-lg font-medium">{name}</p>
            {lastEdited && (
              <div className="mt-4 flex flex-row justify-between">
                <p className="text-text-muted text-sm">
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
