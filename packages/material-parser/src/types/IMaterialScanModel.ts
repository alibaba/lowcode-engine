/**
 * 对应扫描阶段的产物
 */
interface IMaterialScanModel {
  /** 标记物料组件包所使用的模块规范 */
  sourceType: 'module' | 'main';
  /** 入口文件路径 */
  entryFilePath: string;
  /** 入口文件内容 */
  entryFileContent: string;
  /** main文件相对路径 */
  mainFilePath: string;
  /** 当前包名 */
  pkgName: string;
  /** 当前包版本 */
  pkgVersion: string;
}

export default IMaterialScanModel;
