import { Events } from '@alilc/lowcode-shared';
import {
  FileType,
  IFileSystemProvider,
  type IStat,
  type IFileChange,
  type IFileDeleteOptions,
  type IFileSystemWatcher,
  type IWatchOptions,
  type IFileWriteOptions,
  type IFileOverwriteOptions,
  FileSystemErrorCode,
  FileSystemError,
  IFileStat,
  FilePermission,
  FileChangeType,
  FsContants,
} from './file';
import { URI, basename, dirname } from '../common';

class File implements IStat {
  readonly type: FileType.File;
  readonly ctime: number;
  mtime: number;

  name: string;
  data: string;
  permission = FilePermission.Writable;

  constructor(name: string) {
    this.type = FileType.File;
    this.ctime = Date.now();
    this.mtime = Date.now();
    this.name = name;
  }
}

class Directory implements IStat {
  readonly type: FileType.Directory;
  readonly ctime: number;
  mtime: number;

  name: string;
  permission = FilePermission.Writable;
  readonly entries: Map<string, File | Directory>;

  constructor(name: string) {
    this.type = FileType.Directory;
    this.ctime = Date.now();
    this.mtime = Date.now();
    this.name = name;
    this.entries = new Map();
  }

  get size() {
    return this.entries.size;
  }
}

type Entry = File | Directory;

export class InMemoryFileSystemProvider implements IFileSystemProvider {
  private readonly _onDidChangeFile = new Events.Emitter<readonly IFileChange[]>();
  onDidChangeFile = this._onDidChangeFile.event;

  private _bufferedChanges: IFileChange[] = [];
  private _fireSoonHandle: number | undefined;

  private readonly _root = new Directory('');

  async chmod(resource: URI, mode: number): Promise<void> {
    const entry = this._lookup(resource.path, false);

    if (FilePermission.Writable < mode) {
      throw FileSystemError.create('Unsupported mode', FileSystemErrorCode.Unavailable);
    }

    entry.permission = mode;
  }

  async access(resource: URI, mode: number = FsContants.F_OK): Promise<void> {
    const entry = this._lookup(resource.path, false);

    if (mode === FsContants.F_OK) return;
    if (mode === FsContants.R_OK && entry.permission >= FilePermission.Readable) {
      return;
    }
    if (mode === FsContants.W_OK && entry.permission >= FilePermission.Writable) {
      return;
    }
  }

  async stat(resource: URI): Promise<IFileStat> {
    const file = this._lookup(resource.path, false);

    return {
      resource,
      name: file.name,
      ctime: file.ctime,
      mtime: file.mtime,
      permission: file.permission,
      isDirectory: file.type === FileType.Directory,
      isFile: file.type === FileType.File,
    };
  }

  watch(resource: URI, opts?: IWatchOptions): IFileSystemWatcher {
    return { resource, opts } as any as IFileSystemWatcher;
  }

  async mkdir(resource: URI, opts?: IFileWriteOptions): Promise<void> {
    const base = basename(resource.path);
    const dir = dirname(resource.path);
    const parent = this._lookupAsDirectory(dir, true);

    if (parent) {
      if (!opts?.overwrite && parent.entries.has(base)) {
        throw FileSystemError.create('directory exists', FileSystemErrorCode.FileExists);
      }

      const entry = new Directory(base);
      entry.mtime = Date.now();
      parent.entries.set(entry.name, entry);
      this._fireSoon(
        { resource: resource.with({ path: dir }), type: FileChangeType.UPDATED },
        { resource, type: FileChangeType.ADDED },
      );
    } else {
      if (!opts?.recursive) {
        throw FileSystemError.create('parent directory not found', FileSystemErrorCode.FileNotFound);
      }

      this._mkdirRecursive(resource);
    }
  }

  async readdir(resource: URI): Promise<[string, FileType][]> {
    const dir = this._lookupAsDirectory(resource.path, false);

    if (dir.permission < FilePermission.Readable) {
      throw FileSystemError.create('Permission denied', FileSystemErrorCode.FileNotReadable);
    }

    return [...dir.entries.entries()].map(([name, entry]) => [name, entry.type]);
  }

  async readFile(resource: URI): Promise<string> {
    const file = this._lookupAsFile(resource.path, false);

    if (file.permission < FilePermission.Readable) {
      throw FileSystemError.create('Permission denied', FileSystemErrorCode.FileNotReadable);
    }

    return file.data;
  }

  async writeFile(resource: URI, content: string, opts?: IFileWriteOptions): Promise<void> {
    const base = basename(resource.path);
    const dir = dirname(resource.path);
    const dirUri = resource.with({ path: dir });
    let parent = this._lookupAsDirectory(dir, true);

    if (!parent) {
      if (!opts?.recursive) {
        throw FileSystemError.create('file not found', FileSystemErrorCode.FileNotFound);
      }
      parent = await this._mkdirRecursive(dirUri);
    }

    let entry = parent.entries.get(base);
    if (entry instanceof Directory) {
      throw FileSystemError.create('file is directory', FileSystemErrorCode.FileIsADirectory);
    }
    if (entry && entry.permission < FilePermission.Writable) {
      throw FileSystemError.create('Permission denied', FileSystemErrorCode.FileNotWritable);
    }
    if (entry && !opts?.overwrite) {
      throw FileSystemError.create('file exists already', FileSystemErrorCode.FileExists);
    }

    if (!entry) {
      entry = new File(base);
      parent.entries.set(base, entry);
      this._fireSoon({ resource, type: FileChangeType.ADDED });
    }

    entry.mtime = Date.now();
    entry.data = content;
    this._fireSoon({ resource, type: FileChangeType.UPDATED });
  }

  async delete(resource: URI, opts?: IFileDeleteOptions): Promise<void> {
    const dir = dirname(resource.path);
    const base = basename(resource.path);
    const parent = this._lookupAsDirectory(dir, false);

    if (parent.permission < FilePermission.Writable) {
      throw FileSystemError.create('Permission denied', FileSystemErrorCode.FileNotWritable);
    }

    if (parent.entries.has(base)) {
      const entry = parent.entries.get(base)!;

      if (entry.permission < FilePermission.Writable) {
        throw FileSystemError.create('Permission denied', FileSystemErrorCode.FileNotWritable);
      }

      if (entry instanceof Directory) {
        if (opts?.recursive) {
          parent.entries.delete(base);
          parent.mtime = Date.now();
        } else {
          throw FileSystemError.create('file is directory', FileSystemErrorCode.FileIsADirectory);
        }
      } else {
        parent.entries.delete(base);
        parent.mtime = Date.now();
      }

      this._fireSoon(
        { resource, type: FileChangeType.DELETED },
        { resource: resource.with({ path: dir }), type: FileChangeType.UPDATED },
      );
    }
  }

  async rename(from: URI, to: URI, opts?: IFileOverwriteOptions): Promise<void> {
    if (from.path === to.path) return;

    const entry = this._lookup(from.path, false);

    if (entry.permission < FilePermission.Writable) {
      throw FileSystemError.create('Permission denied', FileSystemErrorCode.FileNotWritable);
    }
    if (!opts?.overwrite) {
      throw FileSystemError.create('file exists already', FileSystemErrorCode.FileExists);
    }

    const oldParent = this._lookupAsDirectory(dirname(from.path), false);

    const newParent = this._lookupAsDirectory(dirname(to.path), false);
    const newName = basename(to.path);

    oldParent.entries.delete(entry.name);
    entry.name = newName;
    newParent.entries.set(newName, entry);

    this._fireSoon({ resource: to, type: FileChangeType.ADDED }, { resource: from, type: FileChangeType.DELETED });
  }

  private async _mkdirRecursive(target: URI): Promise<Directory> {
    const dir = dirname(target.path);
    const dirUri = target.with({ path: dir });
    let parent = this._lookupAsDirectory(dir, false);

    if (!parent) {
      parent = await this._mkdirRecursive(dirUri);
    }

    if (parent.permission < FilePermission.Writable) {
      throw FileSystemError.create('Permission denied', FileSystemErrorCode.FileNotWritable);
    }

    const directory = new Directory(basename(target.path));
    directory.mtime = Date.now();
    parent.entries.set(directory.name, directory);
    this._fireSoon(
      {
        resource: dirUri,
        type: FileChangeType.UPDATED,
      },
      {
        resource: target,
        type: FileChangeType.ADDED,
      },
    );

    return directory;
  }

  // --- lookup

  private _lookup(target: string, silent: false): Entry;
  private _lookup(target: string, silent: boolean): Entry | undefined;
  private _lookup(target: string, silent: boolean): Entry | undefined {
    const parts = target.split('/');

    let entry: Entry = this._root;
    for (const part of parts) {
      if (!part) {
        continue;
      }
      let child: Entry | undefined;
      if (entry.type === FileType.Directory) {
        child = entry.entries.get(part);
      }
      if (!child) {
        if (!silent) {
          throw FileSystemError.create('file not found', FileSystemErrorCode.FileNotFound);
        } else {
          return undefined;
        }
      }
      entry = child;
    }
    return entry;
  }

  private _lookupAsDirectory(target: string, silent: false): Directory;
  private _lookupAsDirectory(target: string, silent: boolean): Directory | undefined;
  private _lookupAsDirectory(target: string, silent: boolean): Directory | undefined {
    const entry = this._lookup(target, silent);

    if (entry instanceof Directory) {
      return entry;
    }
    if (!silent) {
      throw FileSystemError.create('directory not found', FileSystemErrorCode.FileNotFound);
    }
  }

  private _lookupAsFile(target: string, silent: false): File;
  private _lookupAsFile(target: string, silent: boolean): File | undefined;
  private _lookupAsFile(target: string, silent: boolean): File | undefined {
    const entry = this._lookup(target, silent);
    if (entry instanceof File) {
      return entry;
    }
    if (!silent) {
      throw FileSystemError.create('file is a directory', FileSystemErrorCode.FileIsADirectory);
    }
  }

  private _fireSoon(...changes: IFileChange[]): void {
    this._bufferedChanges.push(...changes);

    if (this._fireSoonHandle) {
      clearTimeout(this._fireSoonHandle);
    }

    this._fireSoonHandle = window.setTimeout(() => {
      this._onDidChangeFile.notify(this._bufferedChanges);
      this._bufferedChanges.length = 0;
    }, 5);
  }
}
