import { SVGIcon, IconProps } from '@alilc/lowcode-utils';

export function IconLock(props: IconProps) {
  return (
    <SVGIcon viewBox="0 0 1024 1024" {...props}>
      <path d="M704 480v-160c0-105.6-86.4-192-192-192s-192 86.4-192 192v160H160v416h704V480h-160z m-320-160c0-70.4 57.6-128 128-128s128 57.6 128 128v160h-256v-160z m416 512H224v-288h576v288z" fill="#ffffff" p-id="2680" />
      <path d="M480 768h64v-160h-64z" fill="#ffffff" p-id="2681" />
    </SVGIcon>
  );
}
IconLock.displayName = 'IconLock';
