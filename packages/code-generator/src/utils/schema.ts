import { ContainerSchema } from '@ali/lowcode-types';

export function isContainerSchema(x: any): x is ContainerSchema {
  return typeof x === 'object' && x && typeof x.componentName === 'string' && typeof x.fileName === 'string';
}
