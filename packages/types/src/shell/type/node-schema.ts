import { IPublicTypeCompositeValue, IPublicTypePropsMap, IPublicTypeNodeData } from './';

// 转换成一个 .jsx 文件内 React Class 类 render 函数返回的 jsx 代码
/**
 * 搭建基础协议 - 单个组件树节点描述
 */
export interface IPublicTypeNodeSchema {

  id?: string;

  /**
   * 组件名称 必填、首字母大写
   */
  componentName: string;

  /**
   * 组件属性对象
   */
  props?: {
    children?: IPublicTypeNodeData | IPublicTypeNodeData[];
  } & IPublicTypePropsMap; // | PropsList;

  /**
   * 渲染条件
   */
  condition?: IPublicTypeCompositeValue;

  /**
   * 循环数据
   */
  loop?: IPublicTypeCompositeValue;

  /**
   * 循环迭代对象、索引名称 ["item", "index"]
   */
  loopArgs?: [string, string];

  /**
   * 子节点
   */
  children?: IPublicTypeNodeData | IPublicTypeNodeData[];

  /**
   * 是否锁定
   */
  isLocked?: boolean;

  // @todo
  // ------- future support -----
  conditionGroup?: string;
  title?: string;
  ignore?: boolean;
  locked?: boolean;
  hidden?: boolean;
  isTopFixed?: boolean;

  /** @experimental 编辑态内部使用 */
  __ctx?: any;
}
