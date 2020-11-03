import { SVGIcon, IconProps } from '@ali/lowcode-utils';

export function IconFloat(props: IconProps) {
  return (
    <SVGIcon viewBox="0 0 1024 1024" {...props}>
      <path d="M160.256 816.64C116.224 872.448 102.4 921.6 102.4 921.6s49.152-13.824 104.96-57.856c22.016-17.408 128-112.64 200.704-174.08l-73.728-73.728c-61.44 72.704-157.184 178.688-174.08 200.704zM648.704 209.408L442.368 355.328l226.304 226.304 145.92-206.336 15.872 15.872c20.992 20.992 54.784 20.992 75.776 0s20.992-54.784 0-75.776l-197.12-197.12c-20.992-20.992-54.784-20.992-75.776 0-20.992 20.992-20.992 54.784 0 75.776l15.36 15.36zM247.808 334.848c-9.728 2.048-18.944 6.656-26.624 14.336-20.992 20.992-20.992 54.784 0 75.776l377.856 377.856c20.992 20.992 54.784 20.992 75.776 0 7.68-7.68 12.288-16.896 14.336-26.624L247.808 334.848z" />
      <path d="M840.704 879.104c-9.728 0-19.456-3.584-27.136-11.264L155.648 210.432c-14.848-14.848-14.848-39.424 0-54.272 14.848-14.848 39.424-14.848 54.272 0L867.84 814.08c14.848 14.848 14.848 39.424 0 54.272-7.168 7.168-16.896 10.752-27.136 10.752z" />
    </SVGIcon>
  );
}

IconFloat.displayName = 'Float';
