import { Icon } from '@/shared/components/icon/Icon';
import { Popover, PopoverTrigger, PopoverContent } from '@radix-ui/react-popover';
import { faEllipsisVertical } from '@awesome.me/kit-b6cda292ae/icons/classic/solid';
import { OptionsList } from '../optionsList/OptionsList';
import { faRocket, faTrash, faDownload, faPen } from '@awesome.me/kit-b6cda292ae/icons/sharp/solid';
import { faDiagramProject } from '@awesome.me/kit-b6cda292ae/icons/sharp/thin';
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { TimeSince } from '../timeSince/TimeSince';
import { routes } from '@/routes/routes';

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
      <Link to={routes.workflow(id)}>
        <div
          className="relative flex aspect-square flex-col justify-between overflow-hidden rounded-lg bg-contain px-2.5 py-3"
          // style={{ backgroundImage: `url(${imageUrl})` }}
        >
          <div className="absolute inset-0 -z-10 flex justify-center bg-surface-100">
            <Icon className="h-[45%] w-full pt-[20%] opacity-10" icon={faDiagramProject} />
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
                <button>
                  <Icon size={20} icon={faEllipsisVertical} />
                </button>
              </PopoverTrigger>
              <PopoverContent side="bottom" align="end" className="z-10" onClick={(e) => e.preventDefault()}>
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
            <p className="text-foreground text-lg font-semibold">{name}</p>
            {lastEdited && (
              <div className="mt-4 flex flex-row justify-between">
                <p className="text-foreground-muted text-sm">
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
