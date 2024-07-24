import { createDecorator, Provide } from '@alilc/lowcode-shared';

export interface IWorkbenchService {
  initialize(): void;
}

export const IWorkbenchService = createDecorator<IWorkbenchService>('workbenchService');

@Provide(IWorkbenchService)
export class WorkbenchService implements IWorkbenchService {
  initialize(): void {
    console.log('workbench service');
  }
}
