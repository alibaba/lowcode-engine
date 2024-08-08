import { createDecorator, Disposable } from '@alilc/lowcode-shared';
import { Workspace, type IWorkspaceIdentifier, isWorkspaceIdentifier } from './workspace';
import { toWorkspaceFolder, IWorkspaceFolder } from './workspaceFolder';
import { URI } from '../common';

export interface IWorkspaceService {
  initialize(): Promise<void>;

  enterWorkspace(identifier: IWorkspaceIdentifier): Promise<void>;

  getWorkspace(): Workspace;

  getWorkspaceFolder(resource: URI): IWorkspaceFolder | null;
}

export const IWorkspaceService = createDecorator<IWorkspaceService>('workspaceService');

export class WorkspaceService extends Disposable implements IWorkspaceService {
  private _workspace: Workspace;

  constructor() {
    super();
  }

  async initialize() {}

  async enterWorkspace(identifier: IWorkspaceIdentifier) {
    if (!isWorkspaceIdentifier(identifier)) {
      throw new Error('Invalid workspace identifier');
    }

    this._workspace = new Workspace(identifier.id, identifier.uri, [toWorkspaceFolder(identifier.uri)]);
  }

  getWorkspace(): Workspace {
    return this._workspace;
  }

  getWorkspaceFolder(resource: URI) {
    return this._workspace.getFolder(resource);
  }
}
