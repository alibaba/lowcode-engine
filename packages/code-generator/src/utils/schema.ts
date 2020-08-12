import { ContainerSchema, NpmInfo } from '@ali/lowcode-types';

export function isContainerSchema(x: any): x is ContainerSchema {
  return typeof x === 'object' && x && typeof x.componentName === 'string' && typeof x.fileName === 'string';
}

export function isNpmInfo(x: any): x is NpmInfo {
  return typeof x === 'object' && x && typeof x.package === 'string';
}
