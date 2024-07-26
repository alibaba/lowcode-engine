import { createDecorator, Provide } from '@alilc/lowcode-shared';

export interface IWorkspaceService {}

export const IWorkspaceService = createDecorator<IWorkspaceService>('workspaceService');

@Provide(IWorkspaceService)
export class WorkspaceService implements IWorkspaceService {}
