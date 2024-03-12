import { routes } from '@/routes/routes';
import { Icon } from '@/shared/components/icon/Icon';
import { faEllipsisVertical } from '@awesome.me/kit-b6cda292ae/icons/classic/solid';
import { faDownload, faPen, faRocket, faTrash } from '@awesome.me/kit-b6cda292ae/icons/sharp/solid';
import { faDiagramProject } from '@awesome.me/kit-b6cda292ae/icons/sharp/thin';
import { Popover, PopoverContent, PopoverTrigger } from '@radix-ui/react-popover';
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { OptionsList } from '../optionsList/OptionsList';
import { TimeSince } from '../timeSince/TimeSince';

type Action = 'deploy' | 'edit' | 'duplicate' | 'delete' | 'rename' | 'share' | 'export';

type WorkflowTileProps = {
  id: string;
  name: string;
  lastEdited: string;
  onActionClick: (action: Action) => Promise<void>;
};

export const WorkflowTile = ({ id, name, lastEdited, onActionClick }: WorkflowTileProps) => {
  const [isPopoverOpen, setIsPopoverOpen] = useState(false);

  const closePopover = () => setIsPopoverOpen(false);

  const handleActionClick = async (action: Action) => {
    await onActionClick(action);
    closePopover();
  };

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
                  className="flex h-8 w-8 flex-row items-center justify-center rounded-lg bg-surface-2 p-3 hover:bg-surface-1 dark:hover:bg-surface-4"
                >
                  <Icon size={20} icon={faEllipsisVertical} className="text-surface-8" />
                </button>
              </PopoverTrigger>
              <PopoverContent
                side="bottom"
                sideOffset={10}
                align="end"
                className="PopoverContent z-10"
                onClick={(e) => e.preventDefault()}
              >
                <OptionsList>
                  <OptionsList.Item icon={faRocket} onClick={() => handleActionClick('deploy')}>
                    Deploy
                  </OptionsList.Item>
                  {/* <OptionsList.Item icon={faClone} onClick={() => toast.success('Duplicate TBD')}>
                    Duplicate
                  </OptionsList.Item> */}
                  <OptionsList.Item icon={faTrash} onClick={() => onActionClick('delete')}>
                    Delete
                  </OptionsList.Item>
                  {/* <OptionsList.Item icon={faICursor} onClick={() => toast('Rename TBD')}>
                    Rename
                  </OptionsList.Item> */}
                  <OptionsList.Item icon={faPen} onClick={() => handleActionClick('edit')}>
                    Edit
                  </OptionsList.Item>
                  {/* <OptionsList.Item icon={faShare} onClick={() => handleActionClick('share')}>
                    Share
                  </OptionsList.Item> */}
                  <OptionsList.Item icon={faDownload} onClick={() => handleActionClick('export')}>
                    Export JSON
                  </OptionsList.Item>
                </OptionsList>
              </PopoverContent>
            </Popover>
          </div>
          <div>
            <p className="text-lg font-medium text-foreground">{name}</p>
            {lastEdited && (
              <div className="mt-4 flex flex-row justify-between">
                <p className="text-sm text-foreground-muted">
                  Edited <TimeSince time={lastEdited} />
                </p>
                {/* <div className="flex flex-row items-center">
                <Icon className="text-foreground-muted mr-1" size={19} icon={faCircleNodes} />
                <p className="text-foreground">{nodesCount}</p>
              </div> */}
              </div>
            )}
          </div>
        </div>
      </Link>
    </>
  );
};
