import { IMaterialParsedModel } from './IMaterialParsedModel';
import IMaterialScanModel from './IMaterialScanModel';

/**
 * 解析器
 * @interface IParser
 */
interface IParser {
  /**
   * 根据 IScanner 阶段的产出结果，解析对文件内容进行 AST 解析
   * @param {IMaterialScanModel} model IScanner 阶段的产出结果
   * @returns {Promise<IMaterialParsedModel[]>}
   * @memberof IParser
   */
  parse(model: IMaterialScanModel): Promise<IMaterialParsedModel[]>;

  /**
   * 解析 ES5 语法
   * @param {IMaterialScanModel} model
   * @returns {Promise<IMaterialParsedModel>}
   * @memberof IParser
   */
  parseES5(model: IMaterialScanModel): Promise<IMaterialParsedModel>;

  /**
   * 解析 ESM 语法
   * @param {{
   *     model: IMaterialScanModel,
   *     filePath: string, // 要解析的文件路径
   *     fileContent: string // 要解析的文件内容
   *   }} params
   * @returns {Promise<IMaterialParsedModel>}
   * @memberof IParser
   */
  parseES6(params: {
    model: IMaterialScanModel;
    filePath: string;
    fileContent: string;
  }): Promise<IMaterialParsedModel>;
}

export default IParser;
