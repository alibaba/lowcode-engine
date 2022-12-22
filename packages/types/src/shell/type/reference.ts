import { EitherOr } from '../../utils';

/**
 * 资源引用信息，Npm 的升级版本，
 */
export type IPublicTypeReference = EitherOr<{
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
