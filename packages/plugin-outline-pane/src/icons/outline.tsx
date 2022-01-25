import { SVGIcon, IconProps } from '@alilc/lowcode-utils';

export function IconOutline(props: IconProps) {
  return (
    <SVGIcon viewBox="0 0 1024 1024" {...props}>
      <path d="M128 96h512a64 64 0 0 1 64 64v64a64 64 0 0 1-64 64H128a64 64 0 0 1-64-64V160a64 64 0 0 1 64-64z m32 64a32 32 0 1 0 0 64h448a32 32 0 0 0 0-64H160z m224 576h512a64 64 0 0 1 64 64v64a64 64 0 0 1-64 64H384a64 64 0 0 1-64-64v-64a64 64 0 0 1 64-64z m32 64a32 32 0 0 0 0 64h448a32 32 0 0 0 0-64H416z m-32-384h512a64 64 0 0 1 64 64v64a64 64 0 0 1-64 64H384a64 64 0 0 1-64-64v-64a64 64 0 0 1 64-64z m32 64a32 32 0 0 0 0 64h448a32 32 0 0 0 0-64H416z" />
    </SVGIcon>
  );
}

IconOutline.displayName = 'IconOutline';

