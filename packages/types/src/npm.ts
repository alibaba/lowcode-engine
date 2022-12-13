import { EitherOr } from './utils';
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

/**
 * 资源引用信息，Npm 的升级版本，
 */
export type Reference = EitherOr<{
  /**
   * 引用资源的 id 标识
   */
  id: string;
  /**
   * 引用资源的包名
   */
  package: string;
  /**
   * 引用资源的导出对象中的属性值名称
   */
  exportName: string;
  /**
   * 引用 exportName 上的子对象
   */
  subName: string;
  /**
   * 引用的资源主入口
   */
  main?: string;
  /**
   * 是否从引用资源的导出对象中获取属性值
   */
  destructuring?: boolean;
  /**
   * 资源版本号
   */
  version: string;
}, 'package', 'id'>;

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
