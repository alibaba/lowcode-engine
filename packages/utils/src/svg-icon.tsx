import { ReactNode } from 'react';

const SizePresets: any = {
  xsmall: 8,
  small: 12,
  medium: 16,
  large: 20,
  xlarge: 30,
};

export interface IconProps {
  className?: string;
  fill?: string;
  size?: 'xsmall' | 'small' | 'medium' | 'large' | 'xlarge' | number;
  children?: ReactNode;
  style?: Record<string, unknown>;
}

export function SVGIcon({
  fill,
  size = 'medium',
  viewBox,
  style,
  children,
  ...props
}: IconProps & {
  viewBox: string;
}) {
  // eslint-disable-next-line no-prototype-builtins
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
        color: fill,
        ...style,
      }}
    >
      {children}
    </svg>
  );
}
