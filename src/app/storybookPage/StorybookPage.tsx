/* eslint-disable no-console */

import { Button } from '@/shared/components/button/Button';
import { Icon } from '@/shared/components/icon/Icon';
import { Input } from '@/shared/components/input/Input';
import { OptionsList } from '@/shared/components/optionsList/OptionsList';
import {
  faDownload,
  faGalleryThumbnails,
  faMagnifyingGlass,
  faPlus,
  faRocket,
  faShare,
  faUpload,
} from '@awesome.me/kit-b6cda292ae/icons/sharp/solid';

import { useTheme } from '@/hooks/useTheme/useTheme';
import { Switch } from '@/shared/components/switch/Switch';
import { faMoonStars, faSunBright } from '@awesome.me/kit-b6cda292ae/icons/sharp/light';
import { faClone, faICursor, faPen, faTrash } from '@awesome.me/kit-b6cda292ae/icons/sharp/solid';
import { useState } from 'react';
import { PageActions } from '../workflowsPage/components/PageActions';

const ButtonSeries = ({ size }: { size: 'xs' | 'sm' | 'md' | 'lg' | 'xl' }) => {
  return (
    <div className="flex flex-col items-start space-y-4">
      <div className="flex flex-row items-center *:mr-4">
        <h3 className="w-[120px]">Primary</h3>
        <Button size={size} color="primary">
          Filled
        </Button>
        <Button size={size} color="primary" variant="ringed">
          Ringed
        </Button>
        <Button size={size} color="primary" variant="ghost">
          Ghost
        </Button>
        <Button size={size} color="primary" variant="soft">
          Soft
        </Button>
        <Button size={size} color="primary" variant="glass">
          Glass
        </Button>
        <div className="flex gap-3"></div>
      </div>

      <div className="flex flex-row items-center *:mr-4">
        <h3 className="w-[120px]">Secondary</h3>
        <Button size={size} color="secondary">
          Filled
        </Button>
        <Button size={size} color="secondary" variant="ringed">
          Ringed
        </Button>
        <Button size={size} color="secondary" variant="ghost">
          Ghost
        </Button>
        <Button size={size} color="secondary" variant="soft">
          Soft
        </Button>
        <Button size={size} color="secondary" variant="glass">
          Glass
        </Button>
      </div>

      <div className="flex flex-row items-center *:mr-4">
        <h3 className="w-[120px]">Disabled</h3>
        <Button size={size} disabled variant="filled">
          Filled
        </Button>
        <Button size={size} disabled variant="ringed">
          Ringed
        </Button>
        <Button size={size} disabled variant="ghost">
          Ghost
        </Button>
        <Button size={size} disabled variant="soft">
          Soft
        </Button>
        <Button size={size} disabled variant="glass">
          Glass
        </Button>
      </div>
      <div className="flex flex-row items-center *:mr-4">
        <h3 className="w-[120px]">Success</h3>
        <Button size={size} color="success">
          Filled
        </Button>
        <Button size={size} color="success" variant="ringed">
          Ringed
        </Button>
        <Button size={size} color="success" variant="ghost">
          Ghost
        </Button>
        <Button size={size} color="success" variant="soft">
          Soft
        </Button>
        <Button size={size} color="success" variant="glass">
          Glass
        </Button>
      </div>
      <div className="flex flex-row items-center *:mr-4">
        <h3 className="w-[120px]">Error</h3>
        <Button size={size} color="error">
          Filled
        </Button>
        <Button size={size} color="error" variant="ringed">
          Ringed
        </Button>
        <Button size={size} color="error" variant="ghost">
          Ghost
        </Button>
        <Button size={size} color="error" variant="soft">
          Soft
        </Button>
        <Button size={size} color="error" variant="glass">
          Glass
        </Button>
      </div>
      <div className="flex flex-row items-center *:mr-4">
        <h3 className="w-[120px]">Warning</h3>
        <Button size={size} color="warning">
          Filled
        </Button>
        <Button size={size} color="warning" variant="ringed">
          Ringed
        </Button>
        <Button size={size} color="warning" variant="ghost">
          Ghost
        </Button>
        <Button size={size} color="warning" variant="soft">
          Soft
        </Button>
        <Button size={size} color="warning" variant="glass">
          Glass
        </Button>
      </div>
    </div>
  );
};

export const StorybookPage = () => {
  const { theme, switchTheme } = useTheme();
  const [switched, setSwitched] = useState(false);

  return (
    <div className=" flex flex-col space-y-8 p-8">
      <div className="mb-4">
        <Button
          onClick={switchTheme}
          type="button"
          color="primary"
          variant="ghost"
          size="lg"
          leftIcon={theme === 'dark' ? faMoonStars : faSunBright}
        >
          Theme: {theme}
        </Button>
      </div>
      <h2 className="text-2xl">Inputs</h2>
      <div className="flex flex-col items-start *:mr-4">
        <p>Primary</p>
        <Input placeholder="Search this page..." leftIcon={<Icon icon={faMagnifyingGlass} />} />
      </div>
      <div className="flex flex-col items-start *:mr-4">
        <p>Secondary</p>
        <Input placeholder="My workflow name" variant="secondary" />
      </div>
      <h2 className="mt-6 text-2xl">Options list</h2>
      <div style={{ width: 200 }}>
        <OptionsList>
          <OptionsList.Item icon={faRocket} onClick={() => console.log('edit')}>
            Deploy
          </OptionsList.Item>
          <OptionsList.Item icon={faClone} onClick={() => console.log('duplicate')}>
            Duplicate
          </OptionsList.Item>
          <OptionsList.Item icon={faTrash} onClick={() => console.log('delete')}>
            Delete
          </OptionsList.Item>
          <OptionsList.Item icon={faICursor} onClick={() => console.log('rename')}>
            Rename
          </OptionsList.Item>
          <OptionsList.Item icon={faPen} onClick={() => console.log('edit')}>
            Edit
          </OptionsList.Item>
          <OptionsList.Item icon={faShare} onClick={() => console.log('share')}>
            Share
          </OptionsList.Item>
          <OptionsList.Item icon={faDownload} onClick={() => console.log('export')}>
            Export JSON
          </OptionsList.Item>
        </OptionsList>
      </div>
      <h2 className="mt-6 text-2xl">Buttons</h2>
      <div className="flex flex-col space-y-5">
        <h3 className="text-xl">xl</h3>
        <ButtonSeries size="xl" />
        <h3 className="text-xl">lg</h3>
        <ButtonSeries size="lg" />
        <h3 className="text-xl">md</h3>
        <ButtonSeries size="md" />
        <h3 className="text-xl">sm</h3>
        <ButtonSeries size="sm" />
        <h3 className="text-xl">xs</h3>
        <ButtonSeries size="xs" />
      </div>
      <h2 className="mb-4 mt-6 text-xl">Page Actions</h2>
      <div className="flex flex-col">
        <PageActions>
          <PageActions.Action to={'#'} icon={faPlus} text="New Workflow" />
          <PageActions.Action to={'#'} icon={faUpload} text="Import" />
          <PageActions.Action to={'#'} icon={faGalleryThumbnails} text="Browse Templates" />
        </PageActions>
      </div>

      <h2 className="mb-4 mt-6 text-xl">Switches</h2>
      <div className="flex flex-col">
        <Switch className="mr-4" checked={switched} onClick={() => setSwitched(!switched)} />
      </div>
    </div>
  );
};

export default StorybookPage;
