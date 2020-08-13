/**
 * 导出内容结构，文件夹
 *
 * @export
 * @interface ResultDir
 */
export interface ResultDir {
  /**
   * 文件夹名称，Root 名称默认为 .
   *
   * @type {string}
   * @memberof ResultDir
   */
  name: string;
  /**
   * 子目录
   *
   * @type {ResultDir[]}
   * @memberof ResultDir
   */
  dirs: ResultDir[];
  /**
   * 文件夹内文件
   *
   * @type {ResultFile[]}
   * @memberof ResultDir
   */
  files: ResultFile[];
}

/**
 * 导出内容，对文件的描述
 *
 * @export
 * @interface ResultFile
 */
export interface ResultFile {
  /**
   * 文件名
   *
   * @type {string}
   * @memberof ResultFile
   */
  name: string;
  /**
   * 文件类型扩展名，例如 .js .less
   *
   * @type {string}
   * @memberof ResultFile
   */
  ext: string;
  /**
   * 文件内容
   *
   * @type {string}
   * @memberof ResultFile
   */
  content: string;
}
