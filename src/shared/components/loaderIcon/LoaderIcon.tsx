import clsx from 'clsx';
import { faLoader } from '@awesome.me/kit-b6cda292ae/icons/sharp/light';
import { Icon } from '../icon/Icon';

type LoaderIconProps = {
  className?: string;
};

export const LoaderIcon = ({ className }: LoaderIconProps) => (
  <Icon icon={faLoader} className={clsx('animate-spin', className)} size={24} />
);
