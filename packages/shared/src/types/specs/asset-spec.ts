/**
 * https://lowcode-engine.cn/site/docs/specs/assets-spec
 * 低代码引擎资产包协议规范
 */
import { ComponentTreeRoot } from './lowcode-spec';

export interface Package {
  /**
   * 唯一标识，与 package 必须要有一个存在值，如果为空，则以 package 为唯一标识
   */
  id?: string;
  /**
   * npm 包唯一标识，与 id 必须要有一个存在值
   */
  package?: string;
  /**
   * 包版本号
   */
  version: string;
  /**
   * 资源类型，默认为 proCode
   */
  type?: 'proCode' | 'lowCode';
  /**
   * 组件渲染态视图打包后的 CDN url 列表，包含 js 和 css
   */
  urls?: string[];
  /**
   * 组件多个渲染态视图打包后的 CDN url 列表，包含 js 和 css，优先级高于 urls
   */
  advancedUrls?: MultiModeUrls;
  /**
   * 组件编辑态视图打包后的 CDN url 列表，包含 js 和 css
   */
  editUrls?: string[];
  /**
   * 组件多个编辑态视图打包后的 CDN url 列表，包含 js 和 css，优先级高于 editUrls
   */
  advancedEditUrls?: MultiModeUrls;
  /**
   * 低代码组件的 schema 内容
   */
  schema?: ComponentTreeRoot;
  /**
   * 当前资源所依赖的其他资源包的 id 列表
   */
  deps?: string[];
  /**
   * 指定当前资源加载的环境
   */
  loadEnv?: LoadEnv[];
  /**
   * 当前资源是否是 external 资源
   */
  external?: boolean;
  /**
   * 作为全局变量引用时的名称，和 webpack output.library 字段含义一样，用来定义全局变量名
   */
  library?: string | undefined;
  /**
   * 组件描述导出名字，可以通过 window[exportName] 获取到组件描述的 Object 内容；
   */
  exportName?: string;
  /**
   * 标识当前 package 资源加载在 window.library 上的是否是一个异步对象
   */
  async?: boolean;
  /**
   * 标识当前 package 从其他 package 的导出方式
   */
  exportMode?: string;
  /**
   * 标识当前 package 内容是从哪个 package 导出来的
   */
  exportSourceId?: string;
  /**
   * 标识当前 package 是从 window 上的哪个属性导出来的
   */
  exportSourceLibrary?: string;
}

/**
 * 多模态资源
 */
export interface MultiModeUrls {
  /**
   * 默认的资源 url
   */
  default: string[];
  /**
   * 其他模态资源的 url
   */
  [mode: string]: string[];
}

/**
 * 资源加载环境种类
 */
export type LoadEnv = 'design' | 'runtime';
