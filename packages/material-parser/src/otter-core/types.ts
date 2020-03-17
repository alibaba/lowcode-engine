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
