import { createDecorator } from '@alilc/lowcode-shared';

export interface IWorkbenchService {
  initialize(): void;
}

export const IWorkbenchService = createDecorator<IWorkbenchService>('workbenchService');

export class WorkbenchService implements IWorkbenchService {
  initialize(): void {
    console.log('workbench service');
  }
}
