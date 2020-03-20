import { ReactNode } from 'react';

const SizePresets: any = {
  xsmall: 8,
  small: 12,
  medium: 16,
  large: 20,
  xlarge: 30,
};

export interface IconBaseProps {
  className?: string;
  fill?: string;
  size?: 'xsmall' | 'small' | 'medium' | 'large' | 'xlarge' | number;
  viewBox: string;
  children?: ReactNode;
  style?: object;
};

export function IconBase({ fill, size = 'medium', viewBox, style, children, ...props }: IconBaseProps) {
  if (SizePresets.hasOwnProperty(size)) {
    size = SizePresets[size];
  }

  return (
    <svg
      fill="currentColor"
      preserveAspectRatio="xMidYMid meet"
      width={size}
      height={size}
      viewBox={viewBox}
      {...props}
      style={{
        verticalAlign: 'middle',
        color: fill,
        ...style,
      }}
    >{children}</svg>
  );
}
