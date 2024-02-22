import { FontAwesomeIcon, FontAwesomeIconProps } from '@fortawesome/react-fontawesome';
import clsx from 'clsx';

type IconProps = {
  size: number;
} & Omit<FontAwesomeIconProps, 'size'>;

export const Icon = ({ size, width, height, ...props }: IconProps) => (
  <FontAwesomeIcon
    // We need to pass classes because font awesome is adding .svg-inline--fa class on the svg element and it has higher specificity than svg height/width
    className={clsx(
      size !== undefined && `h-[${size}px] w-[${size}px]`,
      height !== undefined && `h-[${height}px]`,
      width !== undefined && `h-[${width}px]`,
    )}
    height={height}
    width={width}
    {...props}
  />
);
