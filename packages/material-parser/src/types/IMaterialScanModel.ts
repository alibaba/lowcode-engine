/**
 * 对应扫描阶段的产物
 */
export interface IMaterialScanModel {
  /** 当前包名 */
  pkgName: string;
  /** 当前包版本 */
  pkgVersion: string;
  /** 在ts场景下，使用entry */
  useEntry?: boolean;
  /** main文件相对路径 */
  mainFilePath: string;
  /** module文件相对路径 */
  moduleFilePath?: string;
  /** typings文件相对路径 */
  typingsFilePath?: string;
  /** main文件绝对路径 */
  mainFileAbsolutePath: string;
  /** module文件绝对路径 */
  moduleFileAbsolutePath?: string;
  /** typings文件绝对路径 */
  typingsFileAbsolutePath?: string;
}
