import { createComponent as internalCreate, ComponentOptions } from '../component';

export function createComponent(options: ComponentOptions) {
  return internalCreate(options);
}
