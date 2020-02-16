import { IMaterialinSchema } from '../otter-core';
import { IAccesser, IMaterializeOptions } from '../types';

/**
 * 接入器模板基类
 * @abstract
 * @class BaseAccesser
 * @implements {IAccesser}
 */
abstract class BaseAccesser implements IAccesser {
  /**
   * 物料化配置项
   * @protected
   * @type {IMaterializeOptions}
   * @memberof BaseAccesser
   */
  protected options: IMaterializeOptions;

  constructor(options: IMaterializeOptions) {
    this.options = options;
  }

  public abstract access(): Promise<IMaterialinSchema>;
}

export default BaseAccesser;
