import { CodeGeneratorError, IResultDir, IResultFile } from '../types';

export default class ResultDir implements IResultDir {
  public name: string;

  public dirs: IResultDir[];

  public files: IResultFile[];

  constructor(name: string) {
    this.name = name;
    this.dirs = [];
    this.files = [];
  }

  public addDirectory(dir: IResultDir): void {
    if (this.dirs.findIndex(d => d.name === dir.name) < 0) {
      this.dirs.push(dir);
    } else {
      throw new CodeGeneratorError('Adding same directory to one directory');
    }
  }

  public addFile(file: IResultFile): void {
    if (
      this.files.findIndex(f => f.name === file.name && f.ext === file.ext) < 0
    ) {
      this.files.push(file);
    } else {
      throw new CodeGeneratorError('Adding same file to one directory');
    }
  }
}
