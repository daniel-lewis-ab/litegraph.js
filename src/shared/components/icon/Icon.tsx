import { FontAwesomeIcon, FontAwesomeIconProps } from '@fortawesome/react-fontawesome';

export type IconProps = {
  size?: number;
} & Omit<FontAwesomeIconProps, 'size'>;

export const Icon = ({ size, width, height, ...props }: IconProps) => (
  <FontAwesomeIcon
    // We need to pass classes because font awesome is adding .svg-inline--fa class on the svg element and it has higher specificity than svg height/width
    style={{
      height: height ? `${height}px` : size ? `${size}px` : undefined,
      width: width ? `${width}px` : size ? `${size}px` : undefined,
    }}
    height={height}
    width={width}
    {...props}
  />
);
