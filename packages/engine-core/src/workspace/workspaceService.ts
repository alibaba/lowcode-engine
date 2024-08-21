import { createDecorator, Disposable } from '@alilc/lowcode-shared';
import { Workspace, type IWorkspaceIdentifier, isWorkspaceIdentifier } from './workspace';
import { toWorkspaceFolder } from './workspaceFolder';

export interface IWorkspaceService {
  initialize(): Promise<void>;

  enterWorkspace(identifier: IWorkspaceIdentifier): Promise<Workspace>;

  getWorkspace(id: string | IWorkspaceIdentifier): Workspace | undefined;
}

export const IWorkspaceService = createDecorator<IWorkspaceService>('workspaceService');

export class WorkspaceService extends Disposable implements IWorkspaceService {
  private _workspacesMap = new Map<string, Workspace>();

  constructor() {
    super();
  }

  async initialize() {}

  async enterWorkspace(identifier: IWorkspaceIdentifier): Promise<Workspace> {
    if (!isWorkspaceIdentifier(identifier)) {
      throw new Error('Invalid workspace identifier');
    }

    const workspace = new Workspace(identifier.id, identifier.uri, [toWorkspaceFolder(identifier.uri)]);

    this._workspacesMap.set(identifier.id, workspace);

    return workspace;
  }

  getWorkspace(identifier: string | IWorkspaceIdentifier): Workspace | undefined {
    if (isWorkspaceIdentifier(identifier)) {
      return this._workspacesMap.get(identifier.id);
    }

    return this._workspacesMap.get(identifier);
  }
}
