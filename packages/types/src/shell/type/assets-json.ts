import { IPublicTypeComponentSort, IPublicTypePackage, IPublicTypeRemoteComponentDescription, IPublicTypeComponentDescription } from './';

/**
 * 资产包协议
 */

export interface IPublicTypeAssetsJson {
  /**
   * 资产包协议版本号
   */
  version: string;
  /**
   * 大包列表，external 与 package 的概念相似，融合在一起
   */
  packages?: IPublicTypePackage[];
  /**
   * 所有组件的描述协议列表所有组件的列表
   */
  components: Array<IPublicTypeComponentDescription | IPublicTypeRemoteComponentDescription>;
  /**
   * 组件分类列表，用来描述物料面板
   * @deprecated 最新版物料面板已不需要此描述
   */
  componentList?: any[];
  /**
   * 业务组件分类列表，用来描述物料面板
   * @deprecated 最新版物料面板已不需要此描述
   */
  bizComponentList?: any[];
  /**
   * 用于描述组件面板中的 tab 和 category
   */
  sort?: IPublicTypeComponentSort;
}
