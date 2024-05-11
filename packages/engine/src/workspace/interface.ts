import { createDecorator } from '@alilc/lowcode-core';

export interface IWorkspaceMainService {
  initialize(): void;
}

export const IWorkspaceMainService = createDecorator<IWorkspaceMainService>('WorkspaceMainService');
