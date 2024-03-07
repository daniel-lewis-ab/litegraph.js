/* eslint-disable no-console */
import { Button } from '@/shared/components/button/Button';
import { Icon } from '@/shared/components/icon/Icon';
import { Input } from '@/shared/components/input/Input';
import { OptionsList } from '@/shared/components/optionsList/OptionsList';
import { faMagnifyingGlass } from '@awesome.me/kit-b6cda292ae/icons/sharp/solid';
import {
  faRocket,
  faClone,
  faTrash,
  faICursor,
  faShare,
  faDownload,
  faPen,
} from '@awesome.me/kit-b6cda292ae/icons/sharp/solid';

const ButtonSeries = ({ size }: { size: 'xs' | 'sm' | 'md' | 'lg' | 'xl' }) => (
  <div className="flex flex-col items-start">
    <div className="flex flex-row *:mb-4 *:mr-4">
      <Button size={size} color="primary">
        Filled
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
      <Button size={size} color="primary" variant="ringed">
        Ringed
      </Button>
      <Button size={size} disabled color="primary" variant="ringed">
        Disabled
      </Button>
    </div>
    <div className="flex flex-row *:mb-4 *:mr-4">
      <Button size={size} color="secondary">
        Filled
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
      <Button size={size} color="secondary" variant="ringed">
        Ringed
      </Button>
      <Button size={size} disabled color="secondary" variant="ringed">
        Disabled
      </Button>
    </div>
    <div className="flex flex-row *:mb-4 *:mr-4">
      <Button size={size} color="tertiary">
        Filled
      </Button>
      <Button size={size} color="tertiary" variant="ghost">
        Ghost
      </Button>
      <Button size={size} color="tertiary" variant="soft">
        Soft
      </Button>
      <Button size={size} color="tertiary" variant="glass">
        Glass
      </Button>
      <Button size={size} color="tertiary" variant="ringed">
        Ringed
      </Button>
      <Button size={size} disabled color="tertiary" variant="ringed">
        Disabled
      </Button>
    </div>
    <div className="flex flex-row *:mb-4 *:mr-4">
      <Button size={size} color="surface">
        Filled
      </Button>
      <Button size={size} color="surface" variant="ghost">
        Ghost
      </Button>
      <Button size={size} color="surface" variant="soft">
        Soft
      </Button>
      <Button size={size} color="surface" variant="glass">
        Glass
      </Button>
      <Button size={size} color="surface" variant="ringed">
        Ringed
      </Button>
      <Button size={size} disabled color="surface" variant="ringed">
        Disabled
      </Button>
    </div>
    <div className="flex flex-row *:mb-4 *:mr-4">
      <Button size={size} color="success">
        Filled
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
      <Button size={size} color="success" variant="ringed">
        Ringed
      </Button>
      <Button size={size} disabled color="success" variant="ringed">
        Disabled
      </Button>
    </div>
    <div className="flex flex-row *:mb-4 *:mr-4">
      <Button size={size} color="success">
        Filled
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
      <Button size={size} color="error" variant="ringed">
        Ringed
      </Button>
      <Button size={size} disabled color="error" variant="ringed">
        Disabled
      </Button>
    </div>
  </div>
);

// @TODO: Remove this page before going to prod
export const Storybook = () => (
  <div className="flex flex-col">
    <h2 className="text-xl">Input</h2>
    <div className="flex flex-row items-start *:mr-4">
      <Input placeholder="Search this page..." leftIcon={<Icon icon={faMagnifyingGlass} />} />
    </div>
    <h2 className="mt-6 text-xl">Options list</h2>
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
    <h2 className="mt-6 text-xl">Buttons</h2>
    <div className="flex flex-col">
      <p>xl</p>
      <ButtonSeries size="xl" />
      <p>lg</p>
      <ButtonSeries size="lg" />
      <p>md</p>
      <ButtonSeries size="md" />
      <p>sm</p>
      <ButtonSeries size="sm" />
      <p>xs</p>
      <ButtonSeries size="xs" />
    </div>
  </div>
);
