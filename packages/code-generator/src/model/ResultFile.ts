import { IResultFile } from '../types';

export default class ResultFile implements IResultFile {
  public name: string;
  public ext: string;
  public content: string;

  constructor(name: string, ext: string = 'jsx', content: string = '') {
    this.name = name;
    this.ext = ext;
    this.content = content;
  }
}
