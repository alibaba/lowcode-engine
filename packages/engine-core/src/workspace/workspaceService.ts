import { createDecorator, Provide } from '@alilc/lowcode-shared';

export interface IWorkspaceService {
  mount(container: HTMLElement): void;
}

export const IWorkspaceService = createDecorator<IWorkspaceService>('workspaceService');

@Provide(IWorkspaceService)
export class WorkspaceService implements IWorkspaceService {
  mount(container: HTMLElement): void {}
}
