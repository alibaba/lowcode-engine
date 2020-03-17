/**
 * 对应扫描阶段的产物
 */
interface IMaterialScanModel {
  /** 入口文件地址 */
  mainEntry: string;
  /** 标记物料组件包所使用的模块规范 */
  sourceType: 'module' | 'main';
  /** 每个文件对应的文件内容 */
  modules: Array<{
    filePath: string;
    fileContent: string;
  }>;
  /** 当前包名 */
  pkgName: string;
  /** 当前包版本 */
  pkgVersion: string;
}

export default IMaterialScanModel;
