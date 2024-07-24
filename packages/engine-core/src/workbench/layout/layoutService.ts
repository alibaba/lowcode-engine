import { createDecorator } from '@alilc/lowcode-shared';

export interface ILayoutService {
  layout(): void;
}

export const ILayoutService = createDecorator<ILayoutService>('layoutService');
