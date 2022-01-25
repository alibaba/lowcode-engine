import { SVGIcon, IconProps } from '@alilc/lowcode-utils';

export function IconRadio(props: IconProps) {
  return (
    <SVGIcon viewBox="0 0 1024 1024" {...props}>
      <path d="M512 1024A512 512 0 1 1 512 0a512 512 0 0 1 0 1024z m0-64A448 448 0 1 0 512 64a448 448 0 0 0 0 896z" />
    </SVGIcon>
  );
}

IconRadio.displayName = 'IconRadio';

