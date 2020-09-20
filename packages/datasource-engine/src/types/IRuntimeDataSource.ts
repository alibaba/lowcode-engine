import { RuntimeDataSourceStatus } from './RuntimeDataSourceStatus';

/**
 * 运行时的数据源（对外暴露的接口）
 * @see https://yuque.antfin-inc.com/mo/spec/spec-low-code-building-schema#Jwgj5
 */
export interface IRuntimeDataSource<TParams = unknown, TResultData = unknown> {
  /** 当前状态(initial/loading/loaded/error) */
  readonly status: RuntimeDataSourceStatus;

  /** 加载成功时的数据 */
  readonly data?: TResultData;

  /** 加载出错的时候的错误信息 */
  readonly error?: Error;

  /**
   * 加载数据 (无论是否曾经加载过)
   * 注意：若提供 params，则会和默认配置的参数做浅合并；否则会使用默认配置的参数。
   */
  load(params?: TParams): Promise<TResultData>;
}
