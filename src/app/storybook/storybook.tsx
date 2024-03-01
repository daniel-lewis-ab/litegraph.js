import { Icon } from '@/shared/components/icon/Icon';
import { Input } from '@/shared/components/input/Input';
import { faMagnifyingGlass } from '@awesome.me/kit-b6cda292ae/icons/sharp/solid';

export const Storybook = () => (
  <div className="flex flex-row items-start *:mr-4">
    <Input placeholder="Search this page..." leftIcon={<Icon icon={faMagnifyingGlass} />} />
  </div>
);
