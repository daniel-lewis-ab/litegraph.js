import clsx from 'clsx';
import { faLoader } from '@awesome.me/kit-b6cda292ae/icons/sharp/light';
import { Icon } from '../icon/Icon';

type LoaderIconProps = {
  className?: string;
  size?: number;
};

export const LoaderIcon = ({ className, size }: LoaderIconProps) => (
  <Icon icon={faLoader} className={clsx('animate-spin', className)} size={size ?? 24} />
);
