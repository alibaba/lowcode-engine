import { IComponentMaterial } from '../otter-core';
import IMaterialParsedModel from './IMaterialParsedModel';
import IMaterialScanModel from './IMaterialScanModel';

/**
 * 生成器
 */
export default interface IGenerator {
  /**
   * 根据前面两阶段的产物生成最终编排引擎需要的物料
   * @param {IMaterialScanModel} matScanModel 对应扫描阶段产物
   * @param {IMaterialParsedModel[]} matParsedModels 对应解析阶段产物
   * @returns {Promise<IMaterialinSchema>}
   * @memberof IGenerator
   */
  generate(
    matScanModel: IMaterialScanModel,
    matParsedModels: IMaterialParsedModel[],
  ): Promise<IComponentMaterial>;
}
