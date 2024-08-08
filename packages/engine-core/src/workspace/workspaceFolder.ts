import { URI, basename } from '../common';

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

export class WorkspaceFolder implements IWorkspaceFolder {
  readonly uri: URI;
  readonly name: string;
  readonly index: number;

  constructor(data: IWorkspaceFolderData) {
    this.uri = data.uri;
    this.name = data.name;
    this.index = data.index;
  }

  toResource(relativePath: string) {
    return URI.joinPath(this.uri, relativePath);
  }

  toJSON(): IWorkspaceFolderData {
    return { uri: this.uri, name: this.name, index: this.index };
  }
}

export function isWorkspaceFolder(thing: unknown): thing is IWorkspaceFolder {
  const candidate = thing as IWorkspaceFolder;

  return !!(
    candidate &&
    typeof candidate === 'object' &&
    URI.isUri(candidate.uri) &&
    typeof candidate.name === 'string' &&
    typeof candidate.toResource === 'function'
  );
}

export function toWorkspaceFolder(resource: URI): WorkspaceFolder {
  return new WorkspaceFolder({ uri: resource, index: 0, name: basename(resource.path) });
}
