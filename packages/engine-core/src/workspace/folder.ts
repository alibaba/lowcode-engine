import { URI } from '../common/uri';

export interface IWorkspaceFolderData {
  /**
   * The associated URI for this workspace folder.
   */
  readonly uri: URI;

  /**
   * The name of this workspace folder. Defaults to
   * the basename of its [uri-path](#Uri.path)
   */
  readonly name: string;

  /**
   * The ordinal number of this workspace folder.
   */
  readonly index: number;
}

export interface IWorkspaceFolder extends IWorkspaceFolderData {
  /**
   * Given workspace folder relative path, returns the resource with the absolute path.
   */
  toResource: (relativePath: string) => URI;
}
