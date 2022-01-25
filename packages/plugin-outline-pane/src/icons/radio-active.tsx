import { SVGIcon, IconProps } from '@alilc/lowcode-utils';

export function IconRadioActive(props: IconProps) {
  return (
    <SVGIcon viewBox="0 0 1024 1024" {...props}>
      <path d="M512 1024A512 512 0 1 1 512 0a512 512 0 0 1 0 1024z m0-256a256 256 0 1 0 0-512 256 256 0 0 0 0 512z" />
    </SVGIcon>
  );
}

IconRadioActive.displayName = 'IconRadioActive';

