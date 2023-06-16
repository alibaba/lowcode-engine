import { EitherOr } from '../../utils';
import { IPublicTypeComponentSchema, IPublicTypeProjectSchema } from './';

/**
 * 定义组件大包及 external 资源的信息
 * 应该被编辑器默认加载
 */
export type IPublicTypePackage = EitherOr<{
  /**
   * npm 包名
   */
  package: string;
  /**
   * 包唯一标识
   */
  id: string;
  /**
   * 包版本号
   */
  version: string;
  /**
   * 组件渲染态视图打包后的 CDN url 列表，包含 js 和 css
   */
  urls?: string[] | any;
  /**
   * 组件编辑态视图打包后的 CDN url 列表，包含 js 和 css
   */
  editUrls?: string[] | any;
  /**
   * 作为全局变量引用时的名称，和webpack output.library字段含义一样，用来定义全局变量名
   */
  library: string;
  /**
   * @experimental
   *
   * TODO: 需推进提案 @度城
   */
  async?: boolean;
  /**
   * 标识当前 package 从其他 package 的导出方式
   */
  exportMode?: 'functionCall';
  /**
   * 标识当前 package 是从 window 上的哪个属性导出来的
   */
  exportSourceLibrary?: any;
  /**
   * 组件描述导出名字，可以通过 window[exportName] 获取到组件描述的 Object 内容；
   */
  exportName?: string;
  /**
   * 低代码组件 schema 内容
   */
  schema?: IPublicTypeProjectSchema<IPublicTypeComponentSchema>;
}, 'package', 'id'>;
