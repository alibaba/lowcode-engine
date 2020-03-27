/**
 * 外部依赖描述
 *
 * @export
 * @interface IExternalDependency
 */
export interface IExternalDependency extends IDependency {
  package: string; // 组件包的名称
  version: string; // 组件包的版本
}

export enum InternalDependencyType {
  PAGE = 'pages',
  BLOCK = 'components',
  COMPONENT = 'components',
  UTILS = 'utils',
}

export enum DependencyType {
  External = 'External',
  Internal = 'Internal',
}

export interface IInternalDependency extends IDependency {
  type: InternalDependencyType;
  moduleName: string;
}

export interface IDependency {
  destructuring: boolean; // 组件是否是解构方式方式导出
  exportName: string; // 导出命名
  subName?: string; // 下标子组件名称
  main?: string; // 包导出组件入口文件路径 /lib/input
  dependencyType?: DependencyType; // 依赖类型 内/外
  importName?: string; // 导入后名称
}
