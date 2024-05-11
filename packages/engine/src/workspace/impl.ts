import { Provide } from '@alilc/lowcode-core';
import { IWorkspaceMainService } from './interface';

@Provide('WorkspaceMainService')
export class WorkspaceMainService implements IWorkspaceMainService {
  initialize(): void {
    console.log('initialize...');
  }
}
