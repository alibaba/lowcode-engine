import { URI } from '../../common/uri';

export enum FileType {
  /**
   * File is unknown (neither file, directory).
   */
  Unknown = 0,

  /**
   * File is a normal file.
   */
  File = 1,

  /**
   * File is a directory.
   */
  Directory = 2,
}

export interface IStat {
  /**
   * The file type.
   */
  readonly type: FileType;

  /**
   * The last modification date represented as millis from unix epoch.
   */
  readonly mtime: number;

  /**
   * The creation date represented as millis from unix epoch.
   */
  readonly ctime: number;
}

export interface IBaseFileStat {
  /**
   * The unified resource identifier of this file or folder.
   */
  readonly resource: URI;

  /**
   * The name which is the last segment
   * of the {{path}}.
   */
  readonly name: string;

  /**
   * The size of the file.
   *
   * The value may or may not be resolved as
   * it is optional.
   */
  readonly size?: number;

  /**
   * The last modification date represented as millis from unix epoch.
   *
   * The value may or may not be resolved as
   * it is optional.
   */
  readonly mtime?: number;

  /**
   * The creation date represented as millis from unix epoch.
   *
   * The value may or may not be resolved as
   * it is optional.
   */
  readonly ctime?: number;

  /**
   * A unique identifier that represents the
   * current state of the file or directory.
   *
   * The value may or may not be resolved as
   * it is optional.
   */
  readonly etag?: string;

  /**
   * File is readonly. Components like editors should not
   * offer to edit the contents.
   */
  readonly readonly?: boolean;

  /**
   * File is locked. Components like editors should offer
   * to edit the contents and ask the user upon saving to
   * remove the lock.
   */
  readonly locked?: boolean;
}

/**
 * A file resource with meta information and resolved children if any.
 */
export interface IFileStat extends IBaseFileStat {
  /**
   * The resource is a file.
   */
  readonly isFile: boolean;

  /**
   * The resource is a directory.
   */
  readonly isDirectory: boolean;

  /**
   * The children of the file stat or undefined if none.
   */
  children: IFileStat[] | undefined;
}

export interface IFileStatWithMetadata extends Required<IFileStat> {
  readonly children: IFileStatWithMetadata[];
}

export const enum FileOperation {
  CREATE,
  DELETE,
  MOVE,
  COPY,
  WRITE,
}

export interface IFileOperationEvent {
  readonly resource: URI;
  readonly operation: FileOperation;

  isOperation(operation: FileOperation.DELETE | FileOperation.WRITE): boolean;
  isOperation(
    operation: FileOperation.CREATE | FileOperation.MOVE | FileOperation.COPY,
  ): this is IFileOperationEventWithMetadata;
}

export interface IFileOperationEventWithMetadata extends IFileOperationEvent {
  readonly target: IFileStatWithMetadata;
}
