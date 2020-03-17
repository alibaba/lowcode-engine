import IMaterialScanModel from './IMaterialScanModel';

/**
 * 扫描器接口
 * @interface IScanner
 */
interface IScanner {
  /**
   * 扫描
   * @returns {Promise<IMaterialScanModel>} 扫描产物
   * @memberof IScanner
   */
  scan(): Promise<IMaterialScanModel>;

  /**
   * 加载文件
   * @param {string} filePath 文件地址
   * @returns {Promise<string>} 返回文件内容
   * @memberof IScanner
   */
  loadFile(filePath: string): Promise<string>;

  /**
   * 解析 package.json 文件
   * @param {string} pkgJsonPath 文件路径
   * @returns {Promise<{ [k: string]: any }>} package 文件信息
   * @memberof IScanner
   */
  resolvePkgJson(pkgJsonPath: string): Promise<{ [k: string]: any }>;
}

export default IScanner;
