import LocalAccesser from './accesser/LocalAccesser';
import OnlineAccesser from './accesser/OnlineAccesser';
import { IMaterialinSchema } from './otter-core';
import { IAccesser, IMaterializeOptions } from './types';

/**
 * 物料化（将普通组件包装为可接入和可流通的物料组件的过程，称为物料化）运行于 node 端
 * @class Materialize
 */
class Materialize {
  /**
   * 物料化配置项
   * @private
   * @type {IMaterializeOptions}
   * @memberof Materialize
   */
  private options: IMaterializeOptions;

  /**
   * 接入器
   * @private
   * @type {IAccesser}
   * @memberof Materialize
   */
  private accesser?: IAccesser;

  constructor(options: IMaterializeOptions) {
    this.options = options;
  }

  /**
   * 开始物料化
   *
   * @returns {Promise<IMaterialinSchema>}
   * @memberof Materialize
   */
  public async start(): Promise<IMaterialinSchema> {
    // 分发请求到对应接入器
    if (this.options.accesser === 'local') {
      this.accesser = new LocalAccesser(this.options);
    } else {
      this.accesser = new OnlineAccesser(this.options);
    }
    return this.accesser.access();
  }
}

export default Materialize;
