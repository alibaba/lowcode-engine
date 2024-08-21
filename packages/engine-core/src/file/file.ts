import { type IDisposable, Events } from '@alilc/lowcode-shared';
import { URI, IRelativePattern } from '../common';

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

export enum FilePermission {
  None = 0,

  /**
   * File is readonly. Components like editors should not
   * offer to edit the contents.
   */
  Readable = 1,

  Writable = 2,
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

  /**
   * The file permissions.
   */
  readonly permission: FilePermission;
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
   * The last modification date represented as millis from unix epoch.
   *
   * The value may or may not be resolved as
   * it is optional.
   */
  readonly mtime: number;

  /**
   * The creation date represented as millis from unix epoch.
   */
  readonly ctime: number;

  readonly permission: FilePermission;
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
}

export interface IFileOverwriteOptions {
  /**
   * Set to `true` to overwrite a file if it exists. Will
   * throw an error otherwise if the file does exist.
   */
  readonly overwrite?: boolean;
}

export interface IFileCreateOptions {
  /**
   * Set to `true` to create parent directory when it does not exist. Will
   * throw an error otherwise if the file does not exist.
   */
  readonly recursive?: boolean;
}

export interface IFileDeleteOptions {
  /**
   * Set to `true` to recursively delete any children of the file. This
   * only applies to folders and can lead to an error unless provided
   * if the folder is not empty.
   */
  readonly recursive?: boolean;
}

export interface IFileWriteOptions extends IFileCreateOptions, IFileOverwriteOptions {}

/**
 * Identifies a single change in a file.
 */
export interface IFileChange {
  /**
   * The type of change that occurred to the file.
   */
  type: FileChangeType;

  /**
   * The unified resource identifier of the file that changed.
   */
  readonly resource: URI;
}

/**
 * Possible changes that can occur to a file.
 */
export const enum FileChangeType {
  UPDATED = 1 << 1,
  ADDED = 1 << 2,
  DELETED = 1 << 3,
}

export interface IWatchOptions {
  /**
   * Set to `true` to watch for changes recursively in a folder
   * and all of its children.
   */
  recursive: boolean;

  /**
   * A set of glob patterns or paths to exclude from watching.
   * Paths can be relative or absolute and when relative are
   * resolved against the watched folder. Glob patterns are
   * always matched relative to the watched folder.
   */
  excludes: string[];

  /**
   * An optional set of glob patterns or paths to include for
   * watching. If not provided, all paths are considered for
   * events.
   * Paths can be relative or absolute and when relative are
   * resolved against the watched folder. Glob patterns are
   * always matched relative to the watched folder.
   */
  includes?: Array<string | IRelativePattern>;

  /**
   * If provided, allows to filter the events that the watcher should consider
   * for emitting. If not provided, all events are emitted.
   *
   * For example, to emit added and updated events, set to:
   * `FileChangeType.ADDED | FileChangeType.UPDATED`.
   */
  filter?: number;
}

export interface IFileSystemWatcher extends IDisposable {
  /**
   * An event which fires on file/folder change only for changes
   * that correlate to the watch request with matching correlation
   * identifier.
   */
  readonly onDidChange: Events.Event<FileChangesEvent>;
}

export class FileChangesEvent {}

export enum FsContants {
  F_OK = 1,
  R_OK = 1 << 1,
  W_OK = 1 << 2,
}

export interface IFileSystemProvider {
  watch(resource: URI, opts?: IWatchOptions): IFileSystemWatcher;

  chmod(resource: URI, mode: number): Promise<void>;
  access(resource: URI, mode?: number): Promise<void>;
  stat(resource: URI): Promise<IFileStat>;
  mkdir(resource: URI, opts?: IFileWriteOptions): Promise<void>;
  readdir(resource: URI): Promise<[string, FileType][]>;
  delete(resource: URI, opts?: IFileDeleteOptions): Promise<void>;

  rename(from: URI, to: URI, opts?: IFileOverwriteOptions): Promise<void>;
  // copy(from: URI, to: URI, opts: IFileOverwriteOptions): Promise<void>;

  readFile(resource: URI): Promise<string>;
  writeFile(resource: URI, content: string, opts?: IFileWriteOptions): Promise<void>;
}

export enum FileSystemErrorCode {
  FileExists = 'EntryExists',
  FileNotFound = 'EntryNotFound',
  FileNotADirectory = 'EntryNotADirectory',
  FileIsADirectory = 'EntryIsADirectory',
  FileTooLarge = 'EntryTooLarge',
  FileNotReadable = 'EntryNotReadable',
  FileNotWritable = 'EntryNotWritable',
  Unavailable = 'Unavailable',
  Unknown = 'Unknown',
}

export class FileSystemError extends Error {
  static create(error: Error | string, code: FileSystemErrorCode): FileSystemError {
    const providerError = new FileSystemError(error.toString(), code);
    return providerError;
  }

  private constructor(
    message: string,
    readonly code: FileSystemErrorCode,
  ) {
    super(message);
    this.name = code ? `${code} (FileSystemError)` : `FileSystemError`;
  }
}
