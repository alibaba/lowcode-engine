import { type AppOptions } from '@alilc/lowcode-renderer-core';
import { type ComponentType } from 'react';
import { type ComponentOptions } from '../runtime/createComponent';

export interface ReactAppOptions extends AppOptions {
  component?: Pick<
    ComponentOptions,
    'beforeElementCreate' | 'elementCreated' | 'componentRefAttached'
  >;
  faultComponent?: ComponentType<any>;
}
