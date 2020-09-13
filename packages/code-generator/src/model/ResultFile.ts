import { IResultFile } from '../types';

export default class ResultFile implements IResultFile {
  public name: string;

  public ext: string;

  public content: string;

  constructor(name: string, ext = 'jsx', content = '') {
    this.name = name;
    this.ext = ext;
    this.content = content;
  }
}
