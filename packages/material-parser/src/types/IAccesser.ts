import { ComponentMeta } from '../core';

/**
 * 接入器接口（用于定义物料化组件的接入渠道）
 * @interface IAccesser
 */
export interface IAccesser {
  /**
   * 接入
   * @returns {Promise<IMaterialinSchema>}
   * @memberof IAccesser
   */
  access(): Promise<ComponentMeta[]>;
}
