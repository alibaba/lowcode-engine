import { IBasicSchema } from './schema/types';

/**
 *
 * @export
 * @interface IOtterErrorOptions
 */
export interface IOtterErrorOptions {
  url?: string;
  version?: string;
}

/**
 * 组件集合
 *
 * @export
 * @interface IComponents
 */
export interface IComponents {
  [componentPackage: string]: {
    // 组件包名称
    [componentName: string]: any; // 组件
  };
}

/**
 * 渲染引擎的输入
 * 编排引擎、渲染引擎使用
 *
 * @export
 * @interface IRenderInputData
 */
export interface IRenderInputData {
  schema: IBasicSchema;
  components: IComponents;
  options?: {
    domId?: string;
    propsHooks?: { [propName: string]: any };
  };
}
