import { IWorkspaceFolder } from './folder';

/**
 * workspace -> one or more folders -> virtual files
 * file -> editWindow
 * editorView -> component tree schema
 *
 * project = (one or muti folders -> files) + some configs
 */
export interface IWorkspace {
  readonly id: string;

  /**
   * Folders in the workspace.
   */
  readonly folders: IWorkspaceFolder[];
}

export class Workspace implements IWorkspace {
  private _folders: IWorkspaceFolder[] = [];

  constructor(private _id: string) {}

  get id() {
    return this._id;
  }

  get folders() {
    return this._folders;
  }
}
