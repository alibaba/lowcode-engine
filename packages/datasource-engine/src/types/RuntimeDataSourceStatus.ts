/** 数据源的状态 */
export enum RuntimeDataSourceStatus {
  /** 初始状态，尚未加载 */
  Initial = 'init',

  /** 正在加载 */
  Loading = 'loading',

  /** 已加载(无错误) */
  Loaded = 'loaded',

  /** 加载出错了 */
  Error = 'error',
}
