/**
 * 扁平文件信息（层级结构隐含在 pathName 中）
 */
export interface FlattenFile {
  /**
   * 文件路径
   */
  pathName: string;

  /**
   * 文件内容
   */
  content: string | Buffer;
}
