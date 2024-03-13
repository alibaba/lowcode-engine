import { type RootSchema } from '@alilc/runtime-shared';

const CONTAINTER_NAME = ['Page', 'Block', 'Component'];

export function validateContainerSchema(schema: RootSchema): boolean {
  if (!CONTAINTER_NAME.includes(schema.componentName)) {
    return false;
  }

  return true;
}
