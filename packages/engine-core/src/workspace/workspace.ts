import { URI, basename, TernarySearchTree } from '../common';
import { IWorkspaceFolder, WorkspaceFolder } from './workspaceFolder';

export interface IWorkspaceIdentifier {
  /**
   * Every workspace (multi-root, single folder or empty)
   * has a unique identifier. It is not possible to open
   * a workspace with the same `id` in multiple windows
   */
  readonly id: string;
  /**
   * Folder path as `URI`.
   */
  readonly uri: URI;
}

export function isWorkspaceIdentifier(obj: unknown): obj is IWorkspaceIdentifier {
  const workspaceIdentifier = obj as IWorkspaceIdentifier | undefined;

  return typeof workspaceIdentifier?.id === 'string' && URI.isUri(workspaceIdentifier.uri);
}

export function toWorkspaceIdentifier(pathOrWorkspace: IWorkspace | string): IWorkspaceIdentifier {
  if (typeof pathOrWorkspace === 'string') {
    return {
      id: basename(pathOrWorkspace),
      uri: URI.from({ path: pathOrWorkspace }),
    };
  }

  const workspace = pathOrWorkspace;

  return {
    id: workspace.id,
    uri: workspace.uri,
  };
}

export interface IWorkspace {
  readonly id: string;

  readonly uri: URI;
  /**
   * Folders in the workspace.
   */
  folders: IWorkspaceFolder[];
}

export class Workspace implements IWorkspace {
  private _folders: WorkspaceFolder[];
  private _foldersMap: TernarySearchTree<string, WorkspaceFolder>;

  constructor(
    private _id: string,
    private _uri: URI,
    folders: WorkspaceFolder[],
    private _ignorePathCasing = false,
  ) {
    this.folders = folders;
  }

  get id() {
    return this._id;
  }

  get uri() {
    return this._uri;
  }

  get folders() {
    return this._folders;
  }

  set folders(folders: WorkspaceFolder[]) {
    this._folders = folders;
    this._updateFoldersMap();
  }

  getFolder(resource: URI): IWorkspaceFolder | null {
    if (!resource) {
      return null;
    }
    return this._foldersMap.findSubstr(resource.path) || null;
  }

  private _updateFoldersMap(): void {
    this._foldersMap = TernarySearchTree.forPaths<WorkspaceFolder>(this._ignorePathCasing);
    for (const folder of this.folders) {
      this._foldersMap.set(folder.uri.path, folder);
    }
  }
}
