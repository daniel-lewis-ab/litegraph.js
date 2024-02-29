import { Icon } from '@/shared/components/icon/Icon';
import { Popover, PopoverTrigger, PopoverContent } from '@radix-ui/react-popover';
import { faCircleNodes } from '@awesome.me/kit-b6cda292ae/icons/sharp/light';
import { faEllipsisVertical } from '@awesome.me/kit-b6cda292ae/icons/classic/solid';
import { Badge } from '@/shared/components/badge/Badge';
import { OptionsList } from '../optionsList/OptionsList';
import {
  faRocket,
  faClone,
  faTrash,
  faICursor,
  faShare,
  faDownload,
} from '@awesome.me/kit-b6cda292ae/icons/sharp/solid';
import { useState } from 'react';
import { Link } from 'react-router-dom';

type Action = 'edit' | 'duplicate' | 'delete' | 'rename' | 'share' | 'export';

type WorkflowTileProps = {
  type: 'controlnet' | 'image';
  name: string;
  lastEdited: string;
  nodesCount: number;
  imageUrl?: string;
  onActionClick: (action: Action) => void;
};

const workflowToReadable = {
  controlnet: 'Controlnet',
  image: 'Image',
};

export const WorkflowTile = ({ type, name, lastEdited, nodesCount, imageUrl, onActionClick }: WorkflowTileProps) => {
  const [isPopoverOpen, setIsPopoverOpen] = useState(false);

  const closePopover = () => setIsPopoverOpen(false);

  const handleActionClick = (action: Action) => {
    onActionClick(action);
    closePopover();
  };

  return (
    <Link to="#">
      <div
        className="tile-background flex aspect-square flex-col justify-between rounded-lg bg-surface-100 bg-contain px-2.5 py-3"
        style={{ backgroundImage: `url(${imageUrl})` }}
      >
        <div className="flex flex-row justify-between">
          {type && <Badge>{workflowToReadable[type]}</Badge>}
          <Popover open={isPopoverOpen} onOpenChange={setIsPopoverOpen}>
            <PopoverTrigger asChild>
              <button>
                <Icon size={20} icon={faEllipsisVertical} />
              </button>
            </PopoverTrigger>
            <PopoverContent side="bottom" align="end">
              <OptionsList>
                <OptionsList.Item icon={faRocket} onClick={() => handleActionClick('edit')}>
                  Edit
                </OptionsList.Item>
                <OptionsList.Item icon={faClone} onClick={() => handleActionClick('duplicate')}>
                  Duplicate
                </OptionsList.Item>
                <OptionsList.Item icon={faTrash} onClick={() => handleActionClick('delete')}>
                  Delete
                </OptionsList.Item>
                <OptionsList.Item icon={faICursor} onClick={() => handleActionClick('rename')}>
                  Rename
                </OptionsList.Item>
                <OptionsList.Item icon={faShare} onClick={() => handleActionClick('share')}>
                  Share
                </OptionsList.Item>
                <OptionsList.Item icon={faDownload} onClick={() => handleActionClick('export')}>
                  Export JSON
                </OptionsList.Item>
              </OptionsList>
            </PopoverContent>
          </Popover>
        </div>
        <div>
          <p className="text-foreground text-lg font-semibold">{name}</p>
          <div className="mt-4 flex flex-row justify-between">
            {/* @TODO: Change time */}
            <p className="text-foreground-muted text-sm">Edited {lastEdited}</p>
            <div className="flex flex-row items-center">
              <Icon className="text-foreground-muted mr-1" size={19} icon={faCircleNodes} />
              <p className="text-foreground">{nodesCount}</p>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
};
