import Generator from '../generator/Generator';
import { debug, IComponentMaterial } from '../otter-core';
import BaseParser from '../parser/BaseParser';
import ReactParser from '../parser/ReactParser';
import Scanner from '../scanner/Scanner';
import { IMaterialParsedModel, IMaterialScanModel, IParser } from '../types';
import BaseAccesser from './BaseAccesser';

const log = debug.extend('mat');

/**
 * 本地接入器
 * @class LocalAccesser
 * @extends {BaseAccesser}
 */
class LocalAccesser extends BaseAccesser {
  /**
   * 扫描器实例
   * @private
   * @type {Scanner}
   * @memberof LocalAccesser
   */
  private scanner!: Scanner;

  /**
   * 解析器实例
   * @private
   * @type {IParser}
   * @memberof LocalAccesser
   */
  private parser!: IParser;

  /**
   * 生成器实例
   * @private
   * @type {Generator}
   * @memberof LocalAccesser
   */
  private generator!: Generator;

  public async access(): Promise<IComponentMaterial> {
    await this.init();
    // 开始扫描
    const matScanModel: IMaterialScanModel = await this.scanner.scan();
    log('matScanModel', matScanModel);
    // 开始解析
    const matParsedModels: IMaterialParsedModel[] = await this.parser.parse(
      matScanModel,
    );
    log('matParsedModels', matParsedModels);
    // 开始生产
    const material: IComponentMaterial = await this.generator.generate(
      matScanModel,
      matParsedModels,
    );
    log('material', material);
    return material;
  }

  /**
   * 初始化
   * @private
   * @returns {Promise<void>}
   * @memberof LocalAccesser
   */
  private async init(): Promise<void> {
    const options = this.options;
    this.scanner = new Scanner(options);
    const ecology = await BaseParser.recognizeEcology(options);
    if (ecology === 'react') {
      this.parser = new ReactParser(options);
      this.generator = new Generator(options);
    }
  }
}

export default LocalAccesser;
