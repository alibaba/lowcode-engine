import { SVGIcon, IconProps } from '@alilc/lowcode-utils';

export function IconSlot(props: IconProps) {
  return (
    <SVGIcon viewBox="0 0 1024 1024" {...props}>
      <path d="M682.325333 135.509333V204.8H819.2v613.376h-614.741333V204.8h136.874666v-69.290667h-206.165333v752.298667h754.346667V135.509333z" />
      <path d="M512 512m-170.325333 0a170.325333 170.325333 0 1 0 340.650666 0 170.325333 170.325333 0 1 0-340.650666 0Z" />
    </SVGIcon>
  );
}

IconSlot.displayName = 'IconSlot';
