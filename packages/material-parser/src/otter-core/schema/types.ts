// 搭建基础协议、搭建入料协议的数据规范

/**
 * 搭建基础协议
 *
 * @export
 * @interface IBasicSchema
 */
export interface IBasicSchema {
  version: string; // 当前协议版本号
  componentsMap: IComponentsMapItem[]; // 组件映射关系(用于描述 componentName 到公域组件映射关系的规范)
  componentsTree: IComponentsTreeItem[]; // 描述模版/页面/区块/低代码业务组件的组件树(用于描述搭建出来的组件树结构的规范)
}

/**
 * 搭建基础协议 - 单个组件描述
 *
 * @export
 * @interface IComponentsMapItem
 */
export interface IComponentsMapItem {
  componentName: string; // 组件名称
  package: string; // 组件包的名称
  version: string; // 组件包的版本
  originalPackage: string; // 组件的原始包名称
  originalVersion: string; // 组件的原始包版本
  destructuring: boolean; // 组件是否是解构方式方式导出
  exportName: string; // 导出命名
  subName?: string; // 下标子组件名称
}

/**
 * 搭建基础协议 - 单个组件树节点描述
 *
 * @export
 * @interface IComponentsTreeItem
 */
export interface IComponentsTreeItem {
  id: string; // 节点的唯一标识
  componentName: string; // 组件名称
  pkg: string; // 组件所属的包
  props?: {
    className?: string; // 组件样式类名
    style?: { [cssAttribute: string]: string | number }; // 组件内联样式
    [propName: string]: any; // 业务属性
  }; // 组件属性对象
  children?: IComponentsTreeItem[] | string; // 子节点
  dataSource?: IDataSource; // 数据源
  state?: {
    // 初始数据状态
    [key: string]: any;
  };
  methods?: {
    // 自定事件绑定
    [methodName: string]: IJSExpression;
  };
  lifeCycles?: {
    // 组件生命周期
    didMount?: IJSExpression;
    willMount?: IJSExpression;
  };
}

/**
 * 搭建基础协议 - 函数表达式
 *
 * @export
 * @interface IComponentLifeCycle
 */
export interface IJSExpression {
  type: 'JSExpression';
  value: string;
}

/**
 * 搭建基础协议 - 数据源
 *
 * @export
 * @interface IDataSource
 */
export interface IDataSource {
  list: IDataSourceRequest[]; // 数据源配置列表
}

/**
 * 搭建基础协议 - 数据源单个配置
 *
 * @export
 * @interface IDataSourceRequest
 */
export interface IDataSourceRequest {
  id: string; // 数据请求 ID
  isInit: boolean; // 表示在组件初始化渲染时是否自动发送当前数据请求
  type: 'fetch' | 'jsonp' | 'custom'; // 数据请求类型
  options?: IRequestOptions; // 请求参数配置
  dataHandler?: any; // 数据结果处理函数，形如：(data, err) => Object
}

/**
 * 搭建基础协议 - 请求参数配置
 *
 * @export
 * @interface IRequestOptions
 */
export interface IRequestOptions {
  uri: string; // 请求地址
  params?: {
    // 请求参数
    [key: string]: any;
  };
  method: 'GET' | 'POST';
  isCors: boolean; // 是否支持跨域，对应credentials = 'include'
  timeout: number; // 超时时长
  headers?: {
    // 自定义请求头
    [key: string]: any;
  };
}

/**
 * 组件描述协议
 *
 * @export
 * @interface IMaterialinSchema
 */
export interface IMaterialinSchema {
  version: string; // 当前协议版本号
  components: IMaterialinComponent[]; // 组件集合
  pkgInfo: IMaterialinPkgInfo; // 组件包信息描述
}

/**
 * 组件描述协议 - 组件包信息描述（供出码引擎消费）
 *
 * @export
 * @interface IMaterialinPkgInfo
 */
export interface IMaterialinPkgInfo {
  // 包名
  package: string;
  // 版本号
  version: string;
  // 源版本号
  originalVersion: string;
  // 源组件包
  originalPackage: string;
  // 组件是否是 export 方式导出
  defaultExportedName: string;
}

/**
 * 组件描述协议 - 单个组件描述
 *
 * @export
 * @interface IMaterialinComponent
 */
export interface IMaterialinComponent {
  componentName: string; // 组件名
  manifest: IMaterialinManifest; // 组件配置信息描述
  origin: any; // 组件源
}

/**
 * 组件描述协议 - 组件配置信息描述
 *
 * @export
 * @interface IMaterialinManifest
 */
export interface IMaterialinManifest {
  name: string; // 组件名
  settings: IMaterialinSettings; // 定义组件的配置属性
  description?: string; // 组件的描述
  coverImage?: string; // 组件的封面图 URL
  category?: string; // 组件的分类
  presets?: IMaterialinPreset[]; // 定义组件左侧预览信息
}

/**
 * 组件描述协议 - 组件配置属性（直接影响组件在编排工作区中的行为表现）
 *
 * @export
 * @interface IMaterialinSettings
 */
export interface IMaterialinSettings {
  type: 'element_inline' | 'element_block' | 'container'; // 定义组件在编排画布上的渲染类型
  // 定义组件对于拖拽行为的响应，支持：t、b、r、l、v 组合；形如：tbrl
  // t：允许元素在组件顶部插入
  // b：允许元素在组件底部插入
  // r：允许元素在组件右侧插入
  // l：允许元素在组件左侧插入
  // v：允许将元素拖放到组件内部
  insertionModes: string; // 定义组件在编排画布上的响应模式
  handles: Array<'cut' | 'copy' | 'paste' | 'delete' | 'duplicate'>; // 定义组件需要响应的右键菜单操作
  shouldActive: boolean; // 用于控制物料组件在画布区块中是否响应用户鼠标的 Click 操作
  shouldDrag: boolean; // 用于控制物料组件在画布区块中是否可以被用户拖拽
  props: IMaterialinProp[]; // 物料组件属性配置
  lifeCycle?: IMaterialinLifeCycle; // 组件生命周期
}

/**
 * 组件描述协议 - 定义组件左侧预览信息
 *
 * @export
 * @interface IMaterialinPreset
 */
export interface IMaterialinPreset {
  alias: string; // 组件的别名
  thumbnail: string; // 组件的预览缩略图 URL
  colSpan?: number; // 代表组件所占栅格数
  customProps?: object; // 自定义属性值
}

/**
 * 组件描述协议 - 组件属性的描述
 *
 * @export
 * @interface IMaterialinProp
 */
export interface IMaterialinProp {
  name: string; // 属性名
  label: string; // 属性展示名称
  renderer: string; // 属性编辑器类型
  defaultValue?: any; // 属性默认值
  params?: any; // 属性编辑器的参数
  placeholder?: string; // 属性编辑器的 placeholder 信息
  hint?: string; // 属性编辑器的提示信息（类似于 tooltip 效果），用于帮助用户理解属性的使用方法
}

/**
 * 组件描述协议 - 组件生命周期描述
 *
 * @export
 * @interface IMaterialinLifeCycle
 */
export interface IMaterialinLifeCycle {
  didMount?: any; // 组件渲染完成后的钩子
  didUpdate?: any; // 组件数据状态更新时的钩子
}
