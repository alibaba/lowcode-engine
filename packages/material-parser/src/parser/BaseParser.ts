import { OtterError } from '../otter-core';
import {
  EcologyType,
  IMaterializeOptions,
  IMaterialParsedModel,
  IMaterialScanModel,
  IParser,
  SourceType,
} from '../types';

/**
 * 解析器基类
 * @abstract
 * @class BaseParser
 * @implements {IParser}
 */
abstract class BaseParser implements IParser {
  /**
   * 识别语法生态，判断是 react、vue、rax
   * @static
   * @param {IMaterializeOptions} options
   * @returns {Promise<EcologyType>}
   * @memberof BaseParser
   */
  public static recognizeEcology(
    options: IMaterializeOptions,
  ): Promise<EcologyType> {
    // TODO 识别物料组件生态
    return Promise.resolve(EcologyType.REACT);
  }

  private options: IMaterializeOptions;

  constructor(options: IMaterializeOptions) {
    this.options = options;
  }

  public async parse(
    model: IMaterialScanModel,
  ): Promise<IMaterialParsedModel[]> {
    const results: IMaterialParsedModel[] = [];
    switch (model.sourceType) {
      case SourceType.MODULE: {
        for (const item of model.modules) {
          const parsedModel: IMaterialParsedModel = await this.parseES6({
            model,
            filePath: item.filePath,
            fileContent: item.fileContent,
          });
          results.push(parsedModel);
        }
        break;
      }
      case SourceType.MAIN: {
        this.parseES5(model);
        break;
      }
      default: {
        throw new OtterError(`Unsupported SourceType [${model.sourceType}]`);
      }
    }
    return results;
  }

  public abstract parseES5(
    model: IMaterialScanModel,
  ): Promise<IMaterialParsedModel>;

  public abstract parseES6(params: {
    model: IMaterialScanModel;
    filePath: string;
    fileContent: string;
  }): Promise<IMaterialParsedModel>;
}

export default BaseParser;
