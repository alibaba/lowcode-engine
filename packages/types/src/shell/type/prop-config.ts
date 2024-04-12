import { IPublicTypePropType } from './';

/**
 * 组件属性信息
 */
export interface IPublicTypePropConfig {
  /**
   * 属性名称
   */
  name: string;
  /**
   * 属性类型
   */
  propType: IPublicTypePropType;
  /**
   * 属性描述
   */
  description?: string;
  /**
   * 属性默认值
   */
  defaultValue?: any;
}
