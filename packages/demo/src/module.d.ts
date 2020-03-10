/// <reference types="react" />
// tslint:disable

declare const __mock__: boolean;

declare module '*.vx' {
  const RecoreComponent: React.ComponentClass<{ [key: string]: any }>;
  export default RecoreComponent;
}

declare module '*.svg' {
  const SvgIcon: React.ComponentClass<any>;
  export default SvgIcon;
}

declare module '@alifd/layout';
declare module '@antv/data-set';
declare module '@ali/iceluna-sdk';

