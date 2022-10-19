/**
 * npm 源引入完整描述对象
 */
export interface NpmInfo {
  /**
   * 源码组件名称
   */
  componentName?: string;
  /**
   * 源码组件库名
   */
  package: string;
  /**
   * 源码组件版本号
   */
  version?: string;
  /**
   * 是否解构
   */
  destructuring?: boolean;
  /**
   * 源码组件名称
   */
  exportName?: string;
  /**
   * 子组件名
   */
  subName?: string;
  /**
   * 组件路径
   */
  main?: string;
}

export interface LowCodeComponentType {
  /**
   * 研发模式
   */
  devMode: 'lowCode';
  /**
   * 组件名称
   */
  componentName: string;
}

export type ProCodeComponentType = NpmInfo;
export type ComponentMap = ProCodeComponentType | LowCodeComponentType;

export function isProCodeComponentType(desc: ComponentMap): desc is ProCodeComponentType {
  return 'package' in desc;
}

export function isLowCodeComponentType(desc: ComponentMap): desc is LowCodeComponentType {
  return !isProCodeComponentType(desc);
}

export type ComponentsMap = ComponentMap[];
