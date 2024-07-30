import { createDecorator } from '@alilc/lowcode-shared';

export interface IWorkspaceService {}

export const IWorkspaceService = createDecorator<IWorkspaceService>('workspaceService');

export class WorkspaceService implements IWorkspaceService {}
