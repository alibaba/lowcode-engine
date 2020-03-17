/**
 * 导出内容结构，文件夹
 *
 * @export
 * @interface IResultDir
 */
export interface IResultDir {
  /**
   * 文件夹名称，Root 名称默认为 .
   *
   * @type {string}
   * @memberof IResultDir
   */
  name: string;
  /**
   * 子目录
   *
   * @type {IResultDir[]}
   * @memberof IResultDir
   */
  dirs: IResultDir[];
  /**
   * 文件夹内文件
   *
   * @type {IResultFile[]}
   * @memberof IResultDir
   */
  files: IResultFile[];
  /**
   * 添加文件
   *
   * @param {IResultFile} file
   * @memberof IResultDir
   */
  addFile(file: IResultFile): void;
  /**
   * 添加子目录
   *
   * @param {IResultDir} dir
   * @memberof IResultDir
   */
  addDirectory(dir: IResultDir): void;
}

/**
 * 导出内容，对文件的描述
 *
 * @export
 * @interface IResultFile
 */
export interface IResultFile {
  /**
   * 文件名
   *
   * @type {string}
   * @memberof IResultFile
   */
  name: string;
  /**
   * 文件类型扩展名，例如 .js .less
   *
   * @type {string}
   * @memberof IResultFile
   */
  ext: string;
  /**
   * 文件内容
   *
   * @type {string}
   * @memberof IResultFile
   */
  content: string;
}

export interface IPackageJSON {
  name: string;
  version: string;
  description?: string;
  dependencies: Record<string, string>;
  devDependencies: Record<string, string>;
  scripts?: Record<string, string>;
  engines?: Record<string, string>;
  repository?: {
    type: string;
    url: string;
  };
  private?: boolean;
}
